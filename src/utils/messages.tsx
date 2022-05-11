// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { pathOr } from 'lodash/fp';

const messages = {
    node: {
        owned: {
            mine: () => 'Looks like you already own that node.',
            notMine: () => 'Looks like that node is already owned.',
        },
        pending: {
            mine: () =>
                'Looks like the node is yours but it is in a pending state',
            notMine: () => 'Looks like that node is already owned.',
        },
        retired: () => 'This node is already retired.',
    },
    deposit: {
        maxAllowed: (amount: number, token = 'ETH') =>
            `Max amount of ${token} allowed to deposit is ${amount}`,
        minAllowed: (amount: number, token = 'ETH') =>
            `Min amount of ${token} allowed to deposit is ${amount}`,
    },
    required: {
        field: () => 'This field is required.',
    },
};

/**
 *
 * @param key 'a.b.0.d' || ['a', 'b', '0', 'd']
 * @param params rest parameter in case the message has any kind of parameter(s)
 * @returns { String }
 */
export const useMessages = (
    key: string | string[],
    ...params: any[]
): string => {
    const messFunc = pathOr(() => '', key, messages);
    return messFunc(...params);
};
