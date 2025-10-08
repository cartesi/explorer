// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';
import { Network } from '../utils/networks';

const MAINNET_GRAPHQL_URL = process.env.NEXT_PUBLIC_MAINNET_GRAPHQL_URL;
const SEPOLIA_GRAPHQL_URL = process.env.NEXT_PUBLIC_SEPOLIA_GRAPHQL_URL;

const LOCAL_GRAPHQL_URL =
    process.env.NEXT_PUBLIC_LOCAL_GRAPHQL_URL ??
    'http://localhost:8000/subgraphs/name/cartesi/pos';

const chainstackURI = {
    1: MAINNET_GRAPHQL_URL,
    11155111: SEPOLIA_GRAPHQL_URL,
    31337: LOCAL_GRAPHQL_URL,
} as const;

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

export const createApollo = (chainId: number): ApolloClient => {
    let uri = chainstackURI[chainId];

    // default to mainnet
    uri = uri || chainstackURI[Network.MAINNET];

    const ssrMode = typeof window === 'undefined';

    return new ApolloClient({
        ssrMode,

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

        link: new HttpLink({
            uri,
        }),
    });
};

export const useApollo = (chainId: number): ApolloClient => {
    return useMemo(() => createApollo(chainId), [chainId]);
};
