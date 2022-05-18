// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ContractReceipt } from 'ethers';
import { cond, isEqual, constant, stubTrue, cloneDeep } from 'lodash/fp';
import { Node, NodeStatus } from '../../../src/services/node';
import { Transaction } from '../../../src/services/transaction';
import { toBigNumber } from '../../../src/utils/numberParser';

/**
 * Don't use this directly. Use the build function exported below
 */
const stubReceipt: ContractReceipt = {
    blockHash:
        '0x8a179bc6cb299f936c4fd614995e62d597ec6108b579c23034fb220967ceaa94',
    blockNumber: 12598244,
    byzantium: true,
    confirmations: 2083037,
    contractAddress: '0x733aF852514e910E2f8af40d61E00530377889E9',
    cumulativeGasUsed: toBigNumber('12102324'),
    effectiveGasPrice: toBigNumber('10100000000'),
    from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    gasUsed: toBigNumber('443560'),
    logs: [
        {
            address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
            blockHash:
                '0x8a179bc6cb299f936c4fd614995e62d597ec6108b579c23034fb220967ceaa94',
            blockNumber: 12598244,
            data: '0x000000000000000000000000084b1c3c81545d370f3634392de611caabff8148',
            logIndex: 160,
            topics: [
                '0xce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e82',
                '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2',
                '0x4774f6d3b3d08b5ec00115f0e2fddb92604b39e52b0dc908c6f8fcb7aa5d2a9a',
            ],
            transactionHash:
                '0x5b73e239c55d790e3c9c3bbb84092652db01bb8dbf49ccc9e4a318470419d9a0',
            transactionIndex: 315,
            removed: false,
        },
        {
            address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
            blockHash:
                '0x8a179bc6cb299f936c4fd614995e62d597ec6108b579c23034fb220967ceaa94',
            blockNumber: 12598244,
            data: '0x000000000000000000000000a2c122be93b0074270ebee7f6b7292c7deb45047',
            logIndex: 161,
            topics: [
                '0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0',
                '0x790fdce97f7b2b1c4c5a709fb6a49bf878feffcaa85ed0245f6dff09abcefda7',
            ],
            transactionHash:
                '0x5b73e239c55d790e3c9c3bbb84092652db01bb8dbf49ccc9e4a318470419d9a0',
            transactionIndex: 315,
            removed: false,
        },
    ],
    events: [],
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000004000000000000010000000000000020000000000000000000040000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000040000000000000000100004000000000000008000040000000000000000000000000000000000005000000000041000000000000000000000000000000000000000000000000100000000000000001000000000000000000000',
    status: 1,
    to: null,
    transactionHash:
        '0x5b73e239c55d790e3c9c3bbb84092652db01bb8dbf49ccc9e4a318470419d9a0',
    transactionIndex: 315,
    type: 0,
};

const buildTransaction = (): Transaction<any> => ({
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

export const buildContractReceipt = () => cloneDeep(stubReceipt);
