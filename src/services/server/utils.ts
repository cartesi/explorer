// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { isNil } from 'lodash/fp';
import {
    IS_CARTESI_USER_QUERY,
    IsCartesiUserQuery,
    userQueryVars,
} from '../../graphql/queries';
import { networks } from '../../utils/networks';
import { createApollo } from '../apollo';

export const getChainId = (chainName: string) =>
    parseInt(
        Object.keys(networks).find(
            (key) => networks[key] == chainName.toLowerCase()
        )
    ) || 1;

export async function isCartesiUser(address: string, chainId: number) {
    const client = createApollo(chainId);
    const { data } = await client.query<
        IsCartesiUserQuery,
        typeof userQueryVars
    >({
        query: IS_CARTESI_USER_QUERY,
        variables: {
            id: address,
        },
    });
    const isUser =
        !isNil(data.user) || !isNil(data.poolUser) || !isNil(data.node);

    if (!isUser) {
        console.info(
            `IS_CARTESI_USER: ${address} is not an user on ${chainId}`
        );
    }
    return isUser;
}
