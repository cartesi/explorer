// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    Stack,
    Heading,
    VStack,
    useColorModeValue,
    chakra,
    Text,
} from '@chakra-ui/react';
import { useBalance } from '../../services/eth';
import { useNode } from '../../services/node';
import { useUserNode } from '../../graphql/hooks/useNodes';
import { NodeInfoSection } from '../../components/node/NodeInfoSection';
import PoolSetting from '../../components/stake/PoolSetting';
import { useWallet } from '../../contexts/wallet';
import TransactionBanner from '../../components/node/TransactionBanner';
import { NodeRetiredBanner } from '../../components/node/NodeRetiredBanner';
import { useStakingPool } from '../../services/pool';
import { isEmpty } from 'lodash/fp';

export interface PoolManageContainerProps {
    address: string;
}

export const PoolManageContainer: FC<PoolManageContainerProps> = ({
    address,
}) => {
    const { account } = useWallet();
    const userBalance = useBalance(account);
    const pool = useStakingPool(address, account);

    // get most recent node hired by user (i.e. the Pool)
    const existingNode = useUserNode(address);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();
    const [hiringAddress, setHiringAddress] = useState<string>();

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    const [currentTransaction, setCurrentTransaction] = useState<any>(null);
    const [transactionBanners, setTransactionBanners] = useState<any>({});

    // dark mode support
    const bg = useColorModeValue('gray.50', 'header');
    const hiredNewNode =
        currentTransaction === 'hire' &&
        pool.transaction?.state === 'confirmed';

    useEffect(() => {
        if (isEmpty(hiringAddress)) return;

        if (hiredNewNode) {
            setWorker(hiringAddress);
            setHiringAddress('');
        }
    }, [hiredNewNode, hiringAddress]);

    return (
        <>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 6 }}
                bg={bg}
            >
                <VStack spacing={4} alignItems="stretch">
                    {transactionBanners?.deposit && (
                        <TransactionBanner
                            title="Setting deposit..."
                            failTitle="Error setting deposit"
                            successDescription="New deposit set successfully."
                            transaction={
                                currentTransaction === 'deposit'
                                    ? node.transaction
                                    : null
                            }
                        />
                    )}
                    {transactionBanners?.retire && (
                        <TransactionBanner
                            title="Retiring Node..."
                            failTitle="Error retiring the node"
                            successDescription="Node retired successfully."
                            transaction={
                                currentTransaction === 'retire'
                                    ? pool.transaction
                                    : null
                            }
                        />
                    )}
                    {transactionBanners?.hire && (
                        <TransactionBanner
                            title="Hiring node..."
                            failTitle="Error hiring node"
                            successDescription={
                                <>
                                    <Text fontSize="sm">
                                        <chakra.span
                                            fontWeight="bold"
                                            fontSize="sm"
                                        >
                                            Congratulations!
                                        </chakra.span>{' '}
                                        You hire a new node for your pool
                                        successfully.
                                    </Text>
                                </>
                            }
                            transaction={
                                currentTransaction === 'hire'
                                    ? pool.transaction
                                    : null
                            }
                        />
                    )}
                    {node.retired && <NodeRetiredBanner />}
                </VStack>
            </Box>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pb={{ base: 6, sm: 8, lg: 8 }}
                bg={bg}
                fontSize={'xl'}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mb={4}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" mb={0}>
                            Pool Node
                        </Heading>
                    </Box>
                </Stack>

                <NodeInfoSection
                    address={activeWorker}
                    userBalance={userBalance}
                    nodeBalance={node.balance}
                    isRetired={node.retired}
                    isHiring={pool.transaction?.isOngoing}
                    isRetiringNode={
                        currentTransaction === 'retire' &&
                        pool.transaction?.isOngoing
                    }
                    onRetire={(address) => {
                        setCurrentTransaction('retire');
                        setTransactionBanners((t) => ({ ...t, retire: true }));
                        pool.retire(address);
                    }}
                    onDeposit={(amount) => {
                        setCurrentTransaction('deposit');
                        setTransactionBanners({
                            ...transactionBanners,
                            deposit: true,
                        });
                        node.transfer(amount);
                    }}
                    onHire={(nodeAddress, funds) => {
                        setCurrentTransaction('hire');
                        setTransactionBanners({
                            ...transactionBanners,
                            hire: true,
                        });
                        setHiringAddress(nodeAddress);
                        pool.hire(nodeAddress, funds);
                    }}
                />
            </Box>
            <PoolSetting />
        </>
    );
};
