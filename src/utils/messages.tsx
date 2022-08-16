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
    field: {
        isRequired: () => 'This field is required.',
        value: {
            should: {
                beGreaterThan: (val = 0, label = 'Value') =>
                    `${label} should be greater than ${val}`,
            },
            max: {
                allowed: (val = 0, label = 'value') =>
                    `Maximum ${label} allowed is ${val}`,
            },
            min: {
                allowed: (val = 0, label = 'value') =>
                    `Minimum ${label} allowed is ${val}`,
            },
        },
    },
    balance: {
        eth: {
            available: {
                forGasCosts: () =>
                    `Please make sure you have sufficient ETH to proceed with the staking fee.`,
            },
        },
    },
    commission: {
        model: {
            flatRate: {
                howItWorks: () =>
                    `This model calculates the commission as a fixed percentage of the block CTSI reward before distributing the remaining amount to the pool users.`,
            },
            gasBased: {
                howItWorks: () =>
                    `This model calculates the commission considering the current network gas price, Ethereum price and CTSI price. The configured amount of gas above is multiplied by the gas price provided by a ChainLink oracle, then converted from ETH to CTSI using an Uniswap V2 price oracle.`,
            },
        },
    },
    pool: {
        factory: {
            not: {
                initialised: () =>
                    'The pool factory is not initialised properly.',
            },
        },
        creation: {
            paused: () => `Creation of new pools is currently paused.`,
        },
        set: {
            ens: {
                success: () => 'Pool ENS updated with success!',
                fail: () => 'Pool ENS update failed!',
                update: () => 'Updating pool ENS...',
            },
        },
        ens: {
            howItWorks: () =>
                `Pool owners can name the pool addresses to provide additional trust or just make it easier to identify the pool. The system relies on authority information provided by ENS domains:`,
        },
    },
    step: {
        skippable: () => 'This step could be skip.',
    },
    notice: {
        problem: (suffix = '') => `We notice a problem${suffix}`,
    },
};

/**
 * Conditional types (ref: https://github.com/microsoft/TypeScript/pull/40002)
 * and variadic tuple types (ref: https://github.com/microsoft/TypeScript/pull/39094)
 * To turn an object type into a union of tuples of keys where the matching value is a function.
 */
type PropsPath<T> = T extends (...a: any) => string
    ? []
    : {
          [K in Extract<keyof T, string>]: [K, ...PropsPath<T[K]>];
      }[Extract<keyof T, string>];

/**
 * Using template string types to join a tuple of string literal with delimiter type D (e.g '.' or '-' or '_')
 */
type Join<T extends string[], D extends string> = T extends []
    ? never
    : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
    ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
    : string;

type MessageArrayPath = PropsPath<typeof messages>;
type MessagePath = Join<MessageArrayPath, '.'>;

/**
 *
 * @param path { MessagePath } key to the message (dotted when nested e.g node.owned.mine)
 * @param params rest parameter in case the message is parameterized
 * @returns { String }
 */
export const useMessages = (path: MessagePath, ...params: any[]): string => {
    const messFunc = pathOr(() => '', path, messages);
    return messFunc(...params);
};
