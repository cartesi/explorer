// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cond, isEqual, constant, stubTrue } from 'lodash/fp';
import { Node, NodeStatus } from '../../../src/services/node';

const buildTransaction = () => ({
    ack: jest.fn(),
    acknowledged: true,
    error: undefined,
    receipt: undefined,
    result: undefined,
    set: jest.fn(),
    submitting: false,
    transaction: undefined,
});

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
    transaction: buildTransaction(),
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

const getNode = cond<NodeStatus, Node>([
    [isEqual('available'), constant(availableNode)],
    [isEqual('owned'), constant(ownedNode)],
    [isEqual('pending'), constant(pendingNode)],
    [isEqual('retired'), constant(retiredNode)],
    [stubTrue, constant(initialNodeState)],
]);

export const buildNodeObj = (nodeStatus?: NodeStatus, address?: string) => {
    const user = address || '';
    const transaction = buildTransaction();
    const nodeToCopy = getNode(nodeStatus);

    return { ...nodeToCopy, user, transaction };
};
