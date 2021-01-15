// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useMemo } from 'react';
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloLink,
    Operation,
    NextLink,
    concat,
} from '@apollo/client';

const uris = {
    1: 'https://api.thegraph.com/subgraphs/name/cartesi/pos',
    5: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
    31337: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
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

const createApollo = (chainId: number): ApolloClient<any> => {
    const uri =
        uris[chainId] || 'https://api.thegraph.com/subgraphs/name/cartesi/pos';
    const ssrMode = typeof window === 'undefined';

    const cleanTypeName = new ApolloLink(
        (operation: Operation, forward: NextLink) => {
            if (operation.operationName === '_meta') {
                if (operation.variables) {
                    const omitTypename = (key, value) =>
                        key === '__typename' ? undefined : value;
                    operation.variables = JSON.parse(
                        JSON.stringify(operation.variables),
                        omitTypename
                    );
                }

                const context = operation.getContext();
                operation.setContext({
                    ...context,
                    cache: {
                        ...context.cache,
                        addTypename: false,
                        config: {
                            ...context.cache.config,
                            addTypename: false,
                        },
                    },
                });
            }

            return forward(operation);
        }
    );

    return new ApolloClient({
        ssrMode,
        link: concat(
            cleanTypeName,
            new HttpLink({
                uri,
            })
        ),
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
    return useMemo(() => createApollo(chainId), [chainId]);
};
