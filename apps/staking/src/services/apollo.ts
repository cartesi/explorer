// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useFlag } from '@unleash/proxy-client-react';
import { useMemo } from 'react';
import { Environment } from '../utils/environment';
import { Network } from '../utils/networks';

const hostedBaseUrl = 'https://api.thegraph.com/subgraphs/name/cartesi';
const hostedUris = {
    1: `${hostedBaseUrl}/pos`,
    5: `${hostedBaseUrl}/pos-goerli`,
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
};

const mainnetURL =
    Environment.PRODUCTION === process.env.NEXT_PUBLIC_ENVIRONMENT
        ? 'https://ethereum-mainnet.graph-eu.p2pify.com/75d339525576cdbd7ff93e11ff2ffdc7/pos'
        : 'https://ethereum-mainnet.graph-eu.p2pify.com/8d17b395563b06f244441ad91b0d4c04/pos-preview';

const chainstackURI = {
    1: mainnetURL,
    5: 'https://ethereum-goerli.graph-eu.p2pify.com/a76ae69498820dfffde048a21229ff89/pos-goerli',
    31337: 'http://localhost:8000/subgraphs/name/cartesi/pos',
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

export const createApollo = (
    chainId: number,
    chainstack: boolean
): ApolloClient<any> => {
    let uri = chainstack ? chainstackURI[chainId] : hostedUris[chainId];

    // default to mainnet
    uri =
        uri ||
        (chainstack
            ? chainstackURI[Network.MAINNET]
            : hostedUris[Network.MAINNET]);

    const ssrMode = typeof window === 'undefined';

    return new ApolloClient({
        ssrMode,
        uri,
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

export const useApollo = (chainId: number): ApolloClient<any> => {
    const enabled = useFlag('chainstackEnabled');
    return useMemo(() => createApollo(chainId, enabled), [chainId, enabled]);
};
