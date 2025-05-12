// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ethers } from 'ethers';
import {
    DOMAINS,
    GetEnsDomainsQuery,
} from '../../../graphql/queries/ensDomains';
import { Network } from '../../../utils/networks';
import ensClient from '../../apolloENSClient';
import { ENSAddressData, Entry, QueriedDomain, StaleEntry } from './types';
import defaultTo from 'lodash/fp/defaultTo';

type GetDomainsResult = Record<string, QueriedDomain>;
type PayloadState = 'ok' | 'ens_query_failed';
type ENSPayload = {
    state: PayloadState;
    data: ENSAddressData[];
};

const defaultMaxEntriesPerReqLimit = 900 as const;
const MAX_ENTRIES_PER_REQ = Math.min(
    defaultMaxEntriesPerReqLimit,
    defaultTo(
        defaultMaxEntriesPerReqLimit,
        parseInt(process.env.ENS_ENTRIES_PER_REQ_LIMIT ?? '')
    )
);

const httpNodeRpc =
    process.env.HTTP_MAINNET_NODE_RPC ?? 'https://cloudflare-eth.com';

const buildRpcClient = (nodeRpcEndpoint: string, network: number) => {
    const provider = new ethers.providers.JsonRpcProvider(
        {
            url: nodeRpcEndpoint,
            skipFetchSetup: true,
        },
        network
    );

    return provider;
};

const provider = buildRpcClient(httpNodeRpc, Network.MAINNET);

const ACTION_NAME = {
    addAvatarUrl: 'ADD_AVATAR_URL',
    getDomains: 'GET_DOMAINS',
    addENSName: 'ADD_ENS_NAME',
    getAvatarUrl: 'GET_AVATAR_URL',
    getFreshENSData: 'GET_FRESH_ENS_DATA',
} as const;

const getAvatarUrl = (name: string): Promise<string | null> => {
    return provider
        .getResolver(name)
        .then((resolver) => {
            return resolver.getText('avatar');
        })
        .catch((error) => {
            console.error(
                `${ACTION_NAME.getAvatarUrl}: (${name}) => Fail to get avatar.\nReason: ${error.message}`
            );
            return null;
        });
};

const addAvatarUrl = async (ensPayload: ENSPayload): Promise<ENSPayload> => {
    // skip any L1 resolver checks, as the primary query failed.
    if (ensPayload.state === 'ens_query_failed') return ensPayload;

    const timeLabel = `${ACTION_NAME.addAvatarUrl}(${ensPayload.data.length})`;
    console.time(timeLabel);
    const listP = ensPayload.data.map((ensAddressData) => {
        if (
            !ensAddressData.hasEns ||
            (ensAddressData.hasEns && !ensAddressData.name)
        ) {
            return Promise.resolve(ensAddressData);
        }

        return getAvatarUrl(ensAddressData.name)
            .then((ensAvatar) => {
                console.info(
                    `${ACTION_NAME.addAvatarUrl}: (${ensAddressData.name}) => avatar(${ensAvatar})`
                );
                ensAddressData.avatarUrl = ensAvatar;
                return ensAddressData;
            })
            .catch((reason: any) => {
                console.error(
                    `${ACTION_NAME.addAvatarUrl}: (Errored) ${ensAddressData.address} - reason (${reason.message})`
                );
                return ensAddressData;
            });
    });

    const data = await Promise.all(listP);
    console.timeEnd(timeLabel);

    return { state: 'ok', data };
};

const getDomains = async (addresses: string[]): Promise<GetDomainsResult> => {
    const timeLabel = `${ACTION_NAME.getDomains}(${addresses.length})`;
    console.time(timeLabel);
    const result = await ensClient.query<GetEnsDomainsQuery>({
        query: DOMAINS,
        variables: {
            first: addresses.length,
            where: { resolvedAddress_in: addresses },
            orderBy: 'createdAt',
            orderDirection: 'asc',
        },
    });

    const domains = result.data.domains ?? [];
    const domainsByAddress = domains.reduce((prev, curr) => {
        const address = curr.resolvedAddress?.id ?? '';
        return {
            ...prev,
            [address]: curr,
        };
    }, {} as GetDomainsResult);

    console.info(
        `${ACTION_NAME.getDomains}: (Number of addresses): ${addresses.length}`
    );
    console.info(
        `${ACTION_NAME.getDomains}: (Domains found): ${domains.length}`
    );

    console.timeEnd(timeLabel);

    return domainsByAddress;
};

const addENSName = async (entries: Entry[]): Promise<ENSPayload> => {
    if (!entries || (entries && entries.length === 0))
        return { state: 'ok', data: [] };
    const timeLabel = `${ACTION_NAME.addENSName}(${entries.length})`;
    console.time(timeLabel);

    let state: PayloadState = 'ok';
    let domainsByAddress: GetDomainsResult;

    try {
        const addresses = entries.map((e) => e.address);
        domainsByAddress = await getDomains(addresses);
    } catch (error: any) {
        console.error(error);
        state = 'ens_query_failed';
        domainsByAddress = {};
    }

    const data = entries.map((entry) => {
        const ensInfo = domainsByAddress[entry.address];
        const name = ensInfo?.name || ensInfo?.labelName;
        const newEntry: ENSAddressData = {
            ...entry,
            hasEns: ensInfo !== undefined,
        };

        if (name) newEntry.name = name;

        return newEntry;
    });

    console.timeEnd(timeLabel);

    return { state, data };
};

export const getENSData = async (entries: Entry[]) => {
    return addENSName(entries).then(addAvatarUrl);
};

/**
 * Receive a list of N entries and break into Y partitions of limited number of entries.
 * The Y partitions is the number of concurrent requests to be sent.
 * The return is a list of Y ENS-payloads.
 *
 * @returns {Promise<ENSPayload[]>}
 */
export const getFreshENSData = async (staleList: StaleEntry[]) => {
    const partitions = Math.ceil(staleList.length / MAX_ENTRIES_PER_REQ);
    const promises: Promise<ENSPayload>[] = [];
    const label = `(${ACTION_NAME.getFreshENSData})`;
    console.info(`${label}: Maximum items per request ${MAX_ENTRIES_PER_REQ}`);
    console.info(`${label}: Total stale entries to check ${staleList.length}`);
    console.info(`${label}: Breaking into ${partitions} concurrent calls`);

    for (let i = 1; i <= partitions; i++) {
        promises.push(getENSData(staleList.splice(0, MAX_ENTRIES_PER_REQ)));
    }

    const payloads = await Promise.all(promises);

    return payloads;
};
