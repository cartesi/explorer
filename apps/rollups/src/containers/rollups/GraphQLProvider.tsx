// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { FC, useMemo } from 'react';
import { Client, Provider, createClient } from 'urql';

type Props = {
    chainId: number;
    children?: React.ReactNode;
};

const SEPOLIA_GRAPHQL = process.env.NEXT_PUBLIC_SEPOLIA_GRAPHQL_URL;
const ARB_GOERLI_GRAPHQL = process.env.NEXT_PUBLIC_ARB_GOERLI_GRAPHQL_URL;
const LOCAL_GRAPHQL = process.env.NEXT_PUBLIC_LOCAL_GRAPHQL_URL;

export const urls: Record<number, string> = {
    [31337]: LOCAL_GRAPHQL,
    [421613]: ARB_GOERLI_GRAPHQL,
    [11155111]: SEPOLIA_GRAPHQL,
};

const GraphQLProvider: FC<Props> = ({ children, chainId }) => {
    const client: Client | undefined = useMemo(
        () => (chainId ? createClient({ url: urls[chainId] }) : undefined),
        [chainId]
    );
    return <Provider value={client}>{children}</Provider>;
};

export default GraphQLProvider;
