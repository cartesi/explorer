// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
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
import { useStakingPool } from '../../services/pool';
import { useBalance, useBlockNumber } from '../../services/eth';
import TransactionFeedback from '../TransactionFeedback';
import AvailableNode from '../node/AvailableNode';
import PendingNode from '../node/PendingNode';
import OwnedNode from '../node/OwnedNode';
import RetiredNode from '../node/RetiredNode';

interface NodeProps {
    poolAddress: string;
}

const PoolNode = ({ poolAddress }: NodeProps) => {
    const { account, chainId } = useWeb3React<Web3Provider>();

    // query block number
    const blockNumber = useBlockNumber();

    // query user ETH balance
    const balance = useBalance(account, [blockNumber]);

    // get most recent node hired by user (if any)
    const userNodes = useUserNodes(poolAddress, 1);
    const existingNode =
        userNodes.data?.nodes?.length > 0 &&
        userNodes.data.nodes[0].id != poolAddress &&
        userNodes.data.nodes[0].id;

    // use a state variable for the typed node address
    const [address, setAddress] = useState<string>();

    // priority is the typed address (at state variable)
    const activeAddress = address || existingNode || '';

    const node = useNode(activeAddress);
    const pool = useStakingPool(poolAddress, account);

    // available:
    //   hire node, input for deposit
    // pending: cancel hire if mine
    // ready: add funds, retire

    // dark mode compatible background color
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <VStack bg={bg} w="100%" shadow="md">
            <TransactionFeedback transaction={node?.transaction} />
            <HStack justify="space-between" w="100%" p={10} spacing={10}>
                <Text>Node</Text>
                <Editable
                    w="100%"
                    fontSize="xx-large"
                    textAlign="center"
                    color={activeAddress ? undefined : 'gray.300'}
                    defaultValue={
                        activeAddress
                            ? activeAddress
                            : pool
                            ? 'Click to enter your node address'
                            : 'Connect to wallet first'
                    }
                    onChange={setAddress}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
            </HStack>
            {node.available && (
                <AvailableNode balance={balance} onHire={node.hire} />
            )}
            {node.pending && (
                <PendingNode
                    account={account}
                    balance={node?.balance}
                    chainId={chainId}
                    user={node?.user}
                    onCancelHire={node.cancelHire}
                />
            )}
            {node.owned && (
                <OwnedNode
                    account={account}
                    authorized={node.authorized}
                    nodeBalance={node.balance}
                    userBalance={balance}
                    chainId={chainId}
                    user={node.user}
                    onRetire={node.retire}
                    onTransfer={node.transfer}
                    onAuthorize={node.authorize}
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

export default PoolNode;
