// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import {
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';

import { useUserNodes } from '../../graphql/hooks/useNodes';
import { useNode } from '../../services/node';
import TransactionFeedback from '../TransactionFeedback';
import AvailableNode from './AvailableNode';
import PendingNode from './PendingNode';
import OwnedNode from './OwnedNode';
import RetiredNode from './RetiredNode';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

interface NodeProps {
    chainId: number;
    user: string; // in case of pool, user is the pool address, in case of direct, user is same as account
    balance: BigNumber;
    onHire: (worker: string, deposit: BigNumberish) => void;
    onCancelHire: (worker: string) => void;
    onRetire: (worker: string) => void;
}

const Node: FC<NodeProps> = (props) => {
    const { balance, chainId, user, onHire, onCancelHire, onRetire } = props;

    // get most recent node hired by user (if any)
    const nodes = useUserNodes(user, 2);
    const existingNode =
        nodes.data?.nodes?.length > 0 &&
        nodes.data.nodes[0].id != user &&
        nodes.data.nodes[0].id;

    // use a state variable for the typed node address
    const [address, setAddress] = useState<string>();

    // priority is the typed address (at state variable)
    const activeAddress = address || existingNode || '';

    const node = useNode(activeAddress);

    // dark mode compatible background color
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <VStack bg={bg} w="100%" shadow="md">
            <TransactionFeedback transaction={node?.transaction} />
            <HStack justify="space-between" w="100%" p={10} spacing={10}>
                <Text>Node</Text>
                <Editable
                    w="100%"
                    fontSize="3xl"
                    textAlign="center"
                    color={activeAddress ? undefined : 'gray.300'}
                    placeholder="Click to enter your node address"
                    value={activeAddress}
                    onChange={setAddress}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
            </HStack>
            {node.available && (
                <AvailableNode
                    balance={balance}
                    onHire={(deposit) => onHire(activeAddress, deposit)}
                />
            )}
            {node.pending && (
                <PendingNode
                    account={user}
                    balance={node?.balance}
                    chainId={chainId}
                    user={node?.user}
                    onCancelHire={() => onCancelHire(activeAddress)}
                />
            )}
            {node.owned && (
                <OwnedNode
                    account={user}
                    authorized={true}
                    nodeBalance={node.balance}
                    userBalance={balance}
                    chainId={chainId}
                    user={node.user}
                    onRetire={() => onRetire(activeAddress)}
                    onTransfer={node.transfer}
                />
            )}
            {node.retired && (
                <RetiredNode
                    chainId={chainId}
                    user={node.user}
                    balance={node.balance}
                />
            )}
        </VStack>
    );
};

export default Node;
