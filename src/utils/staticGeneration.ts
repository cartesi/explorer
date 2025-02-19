// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { GetStaticProps } from 'next';
import { Domain, StakingPoolData } from '../graphql/models';
import { STAKING_POOL, STAKING_POOLS_IDS } from '../graphql/queries';
import { DOMAINS } from '../graphql/queries/ensDomains';
import { createApollo } from '../services/apollo';
import ensClient from '../services/apolloENSClient';
import { Network } from './networks';
import { formatEnsName } from './stringUtils';

const getGraphQLClients = () => {
    return {
        mainnetClient: createApollo(Network.MAINNET),
        sepoliaClient: createApollo(Network.SEPOLIA),
    };
};

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
    const { mainnetClient } = getGraphQLClients();
    const { data } = await mainnetClient.query({
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

export type ENSStaticProps = {
    formattedAddress: string;
};

export const getENSStaticProps: GetStaticProps<ENSStaticProps> = async ({
    params,
}: Context) => {
    const { mainnetClient, sepoliaClient } = getGraphQLClients();

    const queryConfig = {
        query: STAKING_POOL,
        variables: {
            id: params.pool,
        },
    };

    const [poolQ, sepoliaPoolQ, ensQ] = await Promise.all([
        mainnetClient.query<StakingPoolData>(queryConfig),
        sepoliaClient.query<StakingPoolData>(queryConfig),
        ensClient
            .query({
                query: DOMAINS,
                variables: {
                    first: 1,
                    where: { resolvedAddress: params.pool },
                    orderBy: 'createdAt',
                    orderDirection: 'desc',
                },
            })
            .catch((e) => {
                console.log(`problem with ENS: ${e.message}`);
                return { data: { domains: [] } };
            }),
    ]);

    const sepoliaStakingPool = sepoliaPoolQ.data.stakingPool;
    const mainnetStakingPool = poolQ.data.stakingPool;

    // In case the pool does not exist we say to nextJS to return a 404 page
    if (!mainnetStakingPool && !sepoliaStakingPool) return { notFound: true };

    const { data } = ensQ;

    const domain: Domain = data?.domains[0];

    const formattedAddress = formatEnsName(params.pool, domain?.name);

    return {
        props: {
            formattedAddress,
        },
        // re-run the StaticProps once daily
        revalidate: inSeconds,
    };
};
