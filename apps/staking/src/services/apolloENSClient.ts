// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const createENSApollo = (): ApolloClient<any> => {
    // Mainnet
    const uri = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';
    const ssrMode = typeof window === 'undefined';

    return new ApolloClient({
        ssrMode,
        link: new HttpLink({ uri }),
        cache: new InMemoryCache(),
    });
};

const client = createENSApollo();

export default client;
