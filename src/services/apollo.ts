import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import getConfig from '../../next.config';

export let apolloClient: ApolloClient<any>;

const createApolloClient = (): ApolloClient<any> => {
    const { graphUrl } = getConfig();

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({
            uri: graphUrl,
        }),
        cache: new InMemoryCache(),
    });
};

export const initializeApollo = (initialState = null): ApolloClient<any> => {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        const existingCache = _apolloClient.extract();
        _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    if (typeof window === 'undefined') return _apolloClient;

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
};

export const useApollo = (initialState): ApolloClient<any> => {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
};
