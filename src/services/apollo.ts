// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { useFlag } from '@unleash/proxy-client-react';
import { Network } from '../utils/networks';
import { Environment } from '../utils/environment';

const hostedBaseUrl = 'https://api.thegraph.com/subgraphs/name/cartesi';
const hostedUris = {
    1: `${hostedBaseUrl}/pos`,
    3: `${hostedBaseUrl}/pos-ropsten`,
    5: `${hostedBaseUrl}/pos-goerli`,
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
};

const AWS_URL =
    Environment.PRODUCTION === process.env.NEXT_PUBLIC_ENVIRONMENT
        ? 'https://thegraph.cartesi.io'
        : 'https://thegraph.staging.cartesi.io';

const subgraphBaseUrl = `${AWS_URL}/subgraphs/name/cartesi`;
const awsUris = {
    1: `${subgraphBaseUrl}/pos`,
    3: `${subgraphBaseUrl}/pos-ropsten`,
    5: `${subgraphBaseUrl}/pos-goerli`,
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
};

const extendedBaseUrl = `${AWS_URL}/extended`;
const extendedUris = {
    1: `${extendedBaseUrl}/mainnet/graphql`,
    3: `${extendedBaseUrl}/ropsten/graphql`,
    5: `${extendedBaseUrl}/goerli/graphql`,
    31337: 'http://localhost:5001/graphql',
};

const mergeUniqueSort = (fieldName: string) => {
    return (existing: any[] = [], incoming: any[], { readField }) => {
        // concatenate the data
        const array = [...existing, ...incoming];

        // remove duplicates
        const unique = array.reduce<any[]>((unique: any[], item: any) => {
            const exists = unique.findIndex(
                (block) => block.__ref == item.__ref
            );
            return exists >= 0 ? unique : [...unique, item];
        }, []);

        // sort by fieldName
        return unique.sort((a, b) => {
            const fa: number = readField(fieldName, a);
            const fb: number = readField(fieldName, b);
            return fb - fa;
        });
    };
};

export const createApollo = (
    chainId: number,
    aws: boolean
): ApolloClient<any> => {
    let uri = aws ? awsUris[chainId] : hostedUris[chainId];

    // default to mainnet
    uri = uri || (aws ? awsUris[Network.MAINNET] : hostedUris[Network.MAINNET]);

    const ssrMode = typeof window === 'undefined';

    return new ApolloClient({
        ssrMode,
        link: new HttpLink({
            uri,
        }),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        blocks: {
                            keyArgs: ['where'],
                            merge: mergeUniqueSort('timestamp'),
                        },
                    },
                },
            },
        }),
    });
};

export const createExtendedApollo = (chainId: number): ApolloClient<any> => {
    const uri = extendedUris[chainId] || extendedUris[Network.MAINNET];
    const ssrMode = typeof window === 'undefined';

    return new ApolloClient({
        ssrMode,
        link: new HttpLink({
            uri,
        }),
        cache: new InMemoryCache(),
    });
};

export const useApollo = (chainId: number): ApolloClient<any> => {
    const aws = useFlag('aws');
    return useMemo(() => createApollo(chainId, aws), [chainId, aws]);
};

export const useExtendedApollo = (chainId: number): ApolloClient<any> => {
    return useMemo(() => createExtendedApollo(chainId), [chainId]);
};
