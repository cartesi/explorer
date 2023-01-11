// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { InferGetStaticPropsType } from 'next';
import { Domain, StakingPoolData } from '../graphql/models';
import { STAKING_POOL, STAKING_POOLS_IDS } from '../graphql/queries';
import { DOMAINS } from '../graphql/queries/ensDomains';
import { createApollo } from '../services/apollo';
import ensClient from '../services/apolloENSClient';
import { Network } from './networks';
import { formatEnsName } from './stringUtils';

// using AWS for Mainnet/Goerli
const awsClient = createApollo(Network.MAINNET, true);
const goerliAWS = createApollo(Network.GOERLI, true);

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
        fallback: 'blocking',
    };
}

export type Context = {
    params: {
        pool: string;
    };
};

export async function getENSStaticProps({ params }: Context) {
    const [poolQ, goerliPoolQ, ensQ] = await Promise.all([
        awsClient.query<StakingPoolData>({
            query: STAKING_POOL,
            variables: {
                id: params.pool,
            },
        }),
        goerliAWS.query<StakingPoolData>({
            query: STAKING_POOL,
            variables: {
                id: params.pool,
            },
        }),
        ensClient.query({
            query: DOMAINS,
            variables: {
                first: 1,
                where: { resolvedAddress: params.pool },
                orderBy: 'createdAt',
                orderDirection: 'desc',
            },
        }),
    ]);

    const goerliStakingPool = goerliPoolQ.data.stakingPool;
    const mainnetStakingPool = poolQ.data.stakingPool;

    // In case the pool does not exist we say to nextJS to return a 404 page
    if (!goerliStakingPool && !mainnetStakingPool) return { notFound: true };

    const { data } = ensQ;

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
