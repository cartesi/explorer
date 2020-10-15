import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import getConfig from '../../next.config';
import { Prize } from '../graphql/prizes';

let apolloClient;

function createApolloClient() {
    const { graphUrl } = getConfig();

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({
            uri: graphUrl,
        }),
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        const existingCache = _apolloClient.extract();
        _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    if (typeof window === 'undefined') return _apolloClient;

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
}
