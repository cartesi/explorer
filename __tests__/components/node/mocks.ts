// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Node } from '../../../src/services/node';

const initialNodeState: Node = {
    address: undefined,
    authorize: jest.fn(),
    authorized: false,
    authorized1: false,
    available: false,
    balance: undefined,
    cancelHire: jest.fn(),
    hire: jest.fn(),
    loading: false,
    owned: false,
    pending: false,
    retire: jest.fn(),
    retired: false,
    transaction: {
        ack: jest.fn(),
        acknowledged: true,
        error: undefined,
        receipt: undefined,
        result: undefined,
        set: jest.fn(),
        submitting: false,
        transaction: undefined,
    },
    transfer: jest.fn(),
    user: '',
};

const ownedNode: Node = {
    ...initialNodeState,
    owned: true,
};

const retiredNode: Node = {
    ...initialNodeState,
    retired: true,
};

const availableNode: Node = {
    ...initialNodeState,
    available: true,
};

const pendingNode: Node = {
    ...initialNodeState,
    pending: true,
};

type NodeStatus = 'available' | 'owned' | 'retired' | 'pending';

export const buildNodeObj = (nodeStatus?: NodeStatus, address?: string) => {
    const user = address || '';
    switch (nodeStatus) {
        case 'available':
            return {
                ...availableNode,
                user,
            };
        case 'pending':
            return {
                ...pendingNode,
                user,
            };
        case 'owned':
            return {
                ...ownedNode,
                user,
            };
        case 'retired':
            return {
                ...retiredNode,
                user,
            };
        default:
            return { ...initialNodeState, user };
    }
};
