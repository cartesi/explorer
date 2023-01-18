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
    wallet: {
        is: {
            disconnected: () => 'Your wallet is disconnected',
        },
    },
    pos: {
        v2: () => 'Proof of Staking Version 2',
    },
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
        authorize: {
            authorizing: () => 'Authorizing node to use new PoS...',
            success: () => 'Node authorized with success!',
            fail: () => 'Node authorization failed!',
            pos: {
                steps: {
                    title: () =>
                        'Here is what you need to do in case you did not migrate your node yet.',
                    one: () =>
                        'Enter the management screen of your private node.',
                    two: () =>
                        'You should see an AUTHORIZE button in the node section.',
                    three: () =>
                        'Click AUTHORIZE and confirm the transaction with your wallet.',
                    four: () =>
                        'Once confirmed, congratulations you are officially using the PoS v2.',
                },
            },
        },
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
        update: {
            v2: {
                success: () => 'Pool updated to use PoS v2 with success!',
                fail: () => 'Pool update failed!',
                update: () => 'Updating pool to use PoS v2...',
            },
            pos: {
                steps: {
                    title: () =>
                        'Here is what you need to do in case you did not upgrade your pool(s) yet.',
                    one: () =>
                        'Enter the management screen of your staking pool.',
                    two: () => 'Go to the Pool Settings area at the bottom.',
                    three: () =>
                        'Read the warning message, click update and sign the transaction with your wallet.',
                    four: () =>
                        'Once the transaction is confirmed, congratulations the staking pool is using the new PoS',
                },
            },
        },
    },
    step: {
        skippable: () => 'This step could be skipped.',
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

/**
 * Alias to useMessages but not in Hook naming convention
 */
export const getMessages = useMessages;
