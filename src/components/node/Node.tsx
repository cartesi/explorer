// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    Text,
    VStack,
    StackProps,
    useMediaQuery,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

import AvailableNode from './AvailableNode';
import PendingNode from './PendingNode';
import OwnedNode from './OwnedNode';
import RetiredNode from './RetiredNode';

export interface NodeProps extends StackProps {
    chainId: number;
    account: string; // metamask user
    user: string; // in case of pool, user is the pool address, in case of direct, user is same as account
    balance: BigNumber; // node ETH balance
    userBalance: BigNumber; // user ETH balance
    address: string; // node address
    available: boolean;
    pending: boolean;
    owned: boolean;
    retired: boolean;
    authorized: boolean;
    onAddressChange: (worker: string) => void;
    onHire: (worker: string, deposit: BigNumberish) => void;
    onCancelHire: (worker: string) => void;
    onRetire: (worker: string) => void;
    onTransfer: (worker: string, amount: BigNumberish) => void;
}

const Node: FC<NodeProps> = (props) => {
    const {
        chainId,
        account,
        address,
        balance,
        user,
        userBalance,
        available,
        pending,
        owned,
        retired,
        authorized,
        onAddressChange,
        onHire,
        onCancelHire,
        onRetire,
        onTransfer,
        ...stackProps
    } = props;

    const [isLargerThan555] = useMediaQuery('(min-width: 555px)');

    return (
        <VStack {...stackProps}>
            <HStack justify="space-between" w="100%" spacing={10}>
                <Text>Node</Text>
                <Editable
                    w="100%"
                    fontSize={['sm', 'md', 'xl', '3xl']}
                    textAlign="center"
                    color={address ? undefined : 'gray.300'}
                    placeholder="Click to enter your node address"
                    value={address}
                    onChange={onAddressChange}
                >
                    {isLargerThan555 ? (
                        <EditablePreview />
                    ) : (
                        <EditablePreview maxWidth={225} />
                    )}
                    <EditableInput />
                </Editable>
            </HStack>
            {available && (
                <AvailableNode
                    balance={userBalance}
                    onHire={(deposit) => onHire(address, deposit)}
                />
            )}
            {pending && (
                <PendingNode
                    account={account}
                    balance={balance}
                    chainId={chainId}
                    user={user}
                    onCancelHire={() => onCancelHire(address)}
                />
            )}
            {owned && (
                <OwnedNode
                    account={account}
                    authorized={authorized}
                    nodeBalance={balance}
                    userBalance={userBalance}
                    chainId={chainId}
                    user={user}
                    onRetire={() => onRetire(address)}
                    onTransfer={(amount) => onTransfer(address, amount)}
                />
            )}
            {retired && (
                <RetiredNode chainId={chainId} user={user} balance={balance} />
            )}
        </VStack>
    );
};

export default Node;
