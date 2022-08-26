// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon } from '@chakra-ui/icons';
import {
    Box,
    Text,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    Button,
    IconButton,
    useDisclosure,
    Tooltip,
    Icon,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { NodeBalanceModal } from './modals/NodeBalanceModal';
import { NodeRetireModal } from './modals/NodeRetireModal';
import { NodeHireNodeSection } from './NodeHireNodeSection';

export interface INodeInfoSection {
    address: string;
    userBalance: BigNumber;
    nodeBalance: BigNumber;
    isRetired?: boolean;
    isHiring?: boolean;
    isRetiringNode?: boolean;
    onRetire: (nodeAddress: string) => void;
    onDeposit: (funds: BigNumber) => void;
    onHire: (nodeAddress: string, funds: BigNumber) => void;
}

export const NodeInfoSection: FC<INodeInfoSection> = ({
    address,
    userBalance,
    nodeBalance,
    isRetired = false,
    isHiring = false,
    isRetiringNode = false,
    onRetire,
    onDeposit,
    onHire,
}) => {
    // dark mode support
    const bg = useColorModeValue('white', 'gray.800');

    const retireModal = useDisclosure();
    const depositModal = useDisclosure();

    const toETH = (value: BigNumber) => {
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        };

        const numberFormat = new Intl.NumberFormat('en-US', options);
        const valueFormatted = numberFormat.format(
            value ? parseFloat(formatUnits(value, 18)) : 0
        );

        return valueFormatted;
    };

    const needToHire = isRetired || isEmpty(address);

    const onConfirmRetire = () => {
        retireModal.onClose();
        onRetire(address);
    };

    return (
        <>
            {needToHire ? (
                <>
                    <NodeHireNodeSection isHiring={isHiring} onHire={onHire} />
                </>
            ) : (
                <>
                    <Box
                        bg={bg}
                        borderRadius="lg"
                        shadow="sm"
                        p={{ base: 2, lg: 6 }}
                        mb={6}
                    >
                        <Stack
                            spacing={4}
                            alignContent="flex-start"
                            direction={{ base: 'column', md: 'row' }}
                            p={2}
                        >
                            <Box w={{ base: '100%', md: '140px' }}>
                                <Text variant="label">Node address</Text>
                            </Box>
                            <Text isTruncated>{address}</Text>
                        </Stack>
                        <Stack
                            spacing={4}
                            alignContent="flex-start"
                            direction={{ base: 'column', md: 'row' }}
                            p={2}
                        >
                            <Box w={{ base: '100%', md: '140px' }}>
                                <HStack>
                                    <Text variant="label">Node balance</Text>
                                    <Box>
                                        <Tooltip
                                            placement="bottom"
                                            label="The node balance is the amount of ETH available in the node’s wallet."
                                            fontSize="small"
                                            color="white"
                                        >
                                            <Icon
                                                width={4}
                                                height={4}
                                                color="gray.600"
                                            />
                                        </Tooltip>
                                    </Box>
                                </HStack>
                            </Box>

                            <HStack spacing={4} alignItems="flex-end">
                                <Box>
                                    <Flex align="baseline">
                                        <Text>{toETH(nodeBalance)}</Text>
                                        <Text pl={1}>ETH</Text>
                                    </Flex>
                                </Box>
                                <Box alignSelf="flex-end">
                                    <IconButton
                                        aria-label="Edit"
                                        size="sm"
                                        icon={<EditIcon />}
                                        variant="ghost"
                                        onClick={depositModal.onOpen}
                                    />
                                </Box>
                            </HStack>
                        </Stack>
                        <Stack
                            spacing={4}
                            alignContent="flex-start"
                            direction={{ base: 'column', md: 'row' }}
                            p={2}
                        >
                            <Box w={{ base: '100%', md: '140px' }}>
                                <HStack>
                                    <Text variant="label">Node status</Text>
                                </HStack>
                            </Box>
                            <HStack spacing={4} alignItems="flex-end">
                                <Box>
                                    <Text>Hired</Text>
                                </Box>
                            </HStack>
                        </Stack>
                    </Box>
                    <Button
                        onClick={retireModal.onOpen}
                        disabled={isRetiringNode}
                        bgColor={bg}
                        w={{ base: '100%', md: 'auto' }}
                        minW="15rem"
                        me={2}
                    >
                        RETIRE NODE
                    </Button>

                    <NodeRetireModal
                        address={address}
                        disclosure={retireModal}
                        onConfirmRetire={onConfirmRetire}
                    />

                    <NodeBalanceModal
                        disclosure={depositModal}
                        userBalance={userBalance}
                        onDepositFunds={onDeposit}
                    />
                </>
            )}
        </>
    );
};
