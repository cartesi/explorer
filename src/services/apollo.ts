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

const hostedBaseUrl = 'https://api.thegraph.com/subgraphs/name/cartesi';
const hostedUris = {
    1: `${hostedBaseUrl}/pos`,
    3: `${hostedBaseUrl}/pos-ropsten`,
    4: `${hostedBaseUrl}/pos-rinkeby`,
    5: `${hostedBaseUrl}/pos-goerli`,
    42: `${hostedBaseUrl}/pos-kovan`,
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
};

const awsBaseUrl = 'https://thegraph.cartesi.io/subgraphs/name/cartesi';
const awsUris = {
    1: `${awsBaseUrl}/pos`,
    3: `${awsBaseUrl}/pos-ropsten`,
    4: `${awsBaseUrl}/pos-rinkeby`,
    5: `${awsBaseUrl}/pos-goerli`,
    42: `${awsBaseUrl}/pos-kovan`,
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
};

const extendedUris = {
    1: 'https://thegraph.cartesi.io/extended/mainnet/graphql',
    3: 'https://thegraph.cartesi.io/extended/ropsten/graphql',
    4: 'https://thegraph.cartesi.io/extended/rinkeby/graphql',
    5: 'https://thegraph.cartesi.io/extended/goerli/graphql',
    42: 'https://thegraph.cartesi.io/extended/kovan/graphql',
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
    uri = uri || (aws ? awsUris[1] : hostedUris[1]);

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
    const uri =
        extendedUris[chainId] ||
        'https://thegraph.cartesi.io/extended/mainnet/graphql';
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
