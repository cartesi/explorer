// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Network } from './networks';
import { STAKING_POOLS_IDS } from '../graphql/queries';
import { createApollo } from '../services/apollo';
import ensClient from '../services/apolloENSClient';
import { DOMAINS } from '../graphql/queries/ensDomains';
import { Domain } from '../graphql/models';
import { formatEnsName } from './stringUtils';
import { InferGetStaticPropsType } from 'next';

// using AWS and Mainnet
const awsClient = createApollo(Network.MAINNET, true);

type PoolId = {
    pool: string;
};

type PoolStaticPathsRet = {
    paths: PoolId[];
    fallback: boolean | string;
};

// Once daily
const inSeconds = 60 * 60 * 24;

export async function getPoolsStaticPaths(): Promise<PoolStaticPathsRet> {
    const { data } = await awsClient.query({
        query: STAKING_POOLS_IDS,
        variables: {
            where: {
                totalUsers_gt: 5,
            },
        },
    });

    const paths = data.stakingPools.map((p) => ({ params: { pool: p.id } }));

    return {
        paths,
        fallback: true,
    };
}

export type Context = {
    params: {
        pool: string;
    };
};

export async function getENSStaticProps({ params }: Context) {
    const { data } = await ensClient.query({
        query: DOMAINS,
        variables: {
            first: 1,
            where: { resolvedAddress: params.pool },
            orderBy: 'createdAt',
            orderDirection: 'desc',
        },
    });

    const domain: Domain = data.domains[0];

    const formattedAddress = formatEnsName(params.pool, domain?.name);

    return {
        props: {
            formattedAddress,
        },
        // re-run the StaticProps once daily
        revalidate: inSeconds,
    };
}

export type ENSStaticProps = InferGetStaticPropsType<typeof getENSStaticProps>;
