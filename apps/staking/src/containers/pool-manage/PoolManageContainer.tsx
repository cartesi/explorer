// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    chakra,
    Heading,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@explorer/wallet';
import { isEmpty } from 'lodash/fp';
import { FC, useEffect, useState } from 'react';
import { NodeInfoSection } from '../../components/node/NodeInfoSection';
import { NodeRetiredBanner } from '../../components/node/NodeRetiredBanner';
import PoolSetting from '../../components/stake/PoolSetting';
import TransactionBanner from '../../components/TransactionBanner';
import { useUserNode } from '../../graphql/hooks/useNodes';
import { useBalance } from '../../services/eth';
import { useNode } from '../../services/node';
import { useStakingPool } from '../../services/pool';

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

    const retiredDisclosure = useDisclosure();

    // dark mode support
    const bg = useColorModeValue('gray.80', 'header');
    const hiredNewNode = pool.hireTransaction?.state === 'confirmed';

    useEffect(() => {
        if (isEmpty(hiringAddress)) return;

        if (hiredNewNode) {
            setWorker(hiringAddress);
            setHiringAddress('');
        }
    }, [hiredNewNode, hiringAddress]);

    useEffect(() => {
        if (node?.retired) {
            retiredDisclosure.onOpen();
        }
    }, [node]);

    return (
        <>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 6 }}
                pb={4}
                bg={bg}
            >
                <VStack spacing={4} alignItems="stretch">
                    <TransactionBanner
                        title="Setting deposit..."
                        failTitle="Error setting deposit"
                        successDescription="New deposit set successfully."
                        transaction={node.transaction}
                    />

                    <TransactionBanner
                        title="Retiring Node..."
                        failTitle="Error retiring the node"
                        successDescription="Node retired successfully."
                        transaction={pool.retireTransaction}
                    />

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
                        transaction={pool.hireTransaction}
                    />

                    {retiredDisclosure.isOpen && (
                        <NodeRetiredBanner
                            onClose={retiredDisclosure.onClose}
                        />
                    )}
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

                {!node?.ready && !node?.error ? (
                    <Box
                        bg={bg}
                        px={{ base: 2, lg: 8 }}
                        py={{ base: 2, lg: 6 }}
                        display="flex"
                        justifyContent="center"
                    >
                        <Spinner size="xl" />
                    </Box>
                ) : (
                    <NodeInfoSection
                        ownerAccount={address}
                        address={activeWorker}
                        pool={pool}
                        userBalance={userBalance}
                        nodeBalance={node.balance}
                        isRetired={node.retired}
                        isHiring={pool.hireTransaction?.isOngoing}
                        isRetiring={pool.retireTransaction?.isOngoing}
                        onRetire={pool.retire}
                        onDeposit={node.transfer}
                        onHire={(nodeAddress, funds) => {
                            setHiringAddress(nodeAddress);
                            pool.hire(nodeAddress, funds);
                        }}
                    />
                )}
            </Box>
            <PoolSetting address={address} />
        </>
    );
};
