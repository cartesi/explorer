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

const uris = {
    1: 'https://api.thegraph.com/subgraphs/name/cartesi/pos',
    3: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-ropsten',
    4: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-rinkeby',
    5: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
    42: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-kovan',
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

export const createApollo = (chainId: number): ApolloClient<any> => {
    const uri =
        uris[chainId] || 'https://api.thegraph.com/subgraphs/name/cartesi/pos';
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
    return useMemo(() => createApollo(chainId), [chainId]);
};

export const useExtendedApollo = (chainId: number): ApolloClient<any> => {
    return useMemo(() => createExtendedApollo(chainId), [chainId]);
};
