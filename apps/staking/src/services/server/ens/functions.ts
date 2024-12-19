// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Network } from '@explorer/utils';
import { ethers } from 'ethers';
import {
    DOMAINS,
    GetEnsDomainsQuery,
} from '../../../graphql/queries/ensDomains';
import ensClient from './../../../services/apolloENSClient';
import { ENSAddressData, Entry, QueriedDomain } from './types';

const httpNodeRpc =
    process.env.HTTP_MAINNET_NODE_RPC ?? 'https://cloudflare-eth.com';

const buildRpcClient = (nodeRpcEndpoint: string, network: number) => {
    const provider = new ethers.providers.JsonRpcProvider(
        nodeRpcEndpoint,
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

const addAvatarUrl = async (
    ensAddressDataList: ENSAddressData[]
): Promise<ENSAddressData[]> => {
    const timeLabel = `${ACTION_NAME.addAvatarUrl}(${ensAddressDataList.length})`;
    console.time(timeLabel);
    const listP = ensAddressDataList.map((ensAddressData) => {
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
                    `${ACTION_NAME}: (Errored) ${ensAddressData.address} - reason (${reason.message})`
                );
                return ensAddressData;
            });
    });

    const result = await Promise.all(listP);
    console.timeEnd(timeLabel);

    return result;
};

const getDomains = async (addresses: string[]) => {
    const timeLabel = `${ACTION_NAME.getDomains}(${addresses.length})`;
    console.time(timeLabel);
    const result = await ensClient
        .query<GetEnsDomainsQuery>({
            query: DOMAINS,
            variables: {
                first: addresses.length,
                where: { resolvedAddress_in: addresses },
                orderBy: 'createdAt',
                orderDirection: 'asc',
            },
        })
        .catch((reason: any) => {
            console.error(reason);
            return {
                data: {
                    domains: [],
                },
            };
        });

    const domains = (result.data.domains ?? []) as QueriedDomain[];
    console.info(
        `${ACTION_NAME.getDomains}: (Number of addresses): ${addresses.length}`
    );
    console.info(
        `${ACTION_NAME.getDomains}: (Domains found): ${domains.length}`
    );

    console.timeEnd(timeLabel);
    return domains;
};

const getDomainsByAddress = (domains: QueriedDomain[]) => {
    return domains.reduce((prev, curr) => {
        const address = curr.resolvedAddress?.id ?? '';
        return {
            ...prev,
            [address]: curr,
        };
    }, {} as Record<string, QueriedDomain>);
};

const addENSName = async (entries: Entry[]): Promise<ENSAddressData[]> => {
    const timeLabel = `${ACTION_NAME.addENSName}(${entries.length})`;
    console.time(timeLabel);
    if (!entries || (entries && entries.length === 0)) return [];

    const addresses = entries.map((e) => e.address);
    const domains = await getDomains(addresses);
    const domainsByAddress = getDomainsByAddress(domains);

    const result = entries.map((entry) => {
        const ensInfo = domainsByAddress[entry.address];
        return {
            ...entry,
            hasEns: ensInfo !== undefined,
            name: ensInfo?.name || ensInfo?.labelName,
        };
    });

    console.timeEnd(timeLabel);

    return result;
};

export const getENSData = async (entries: Entry[]) => {
    return addENSName(entries).then(addAvatarUrl);
};
