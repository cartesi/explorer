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
    isOwned?: boolean;
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
    isOwned = false,
    onRetire,
    onDeposit,
    onHire,
}) => {
    // dark mode support
    const bg = useColorModeValue('white', 'gray.800');
    const buttonBg = useColorModeValue('gray.80', 'gray.800');
    const tooltipColor = useColorModeValue('gray.400', 'white');

    const retireModal = useDisclosure();
    const depositModal = useDisclosure();

    const isNodeHireSectionVisible =
        !isRetiringNode &&
        (isHiring || isRetired || !isOwned || isEmpty(address));

    const toETH = (value: BigNumber) => {
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        };

        const numberFormat = new Intl.NumberFormat('en-US', options);
        return numberFormat.format(
            value ? parseFloat(formatUnits(value, 18)) : 0
        );
    };

    const onConfirmRetire = () => {
        retireModal.onClose();
        onRetire(address);
    };

    return (
        <>
            {isNodeHireSectionVisible ? (
                <>
                    <NodeHireNodeSection isHiring={isHiring} onHire={onHire} />
                </>
            ) : (
                <>
                    <Box
                        bg={bg}
                        shadow="md"
                        px={{ base: 2, lg: 8 }}
                        py={{ base: 2, lg: 6 }}
                        mb={2}
                    >
                        <Stack
                            spacing={4}
                            direction={{ base: 'column', md: 'row' }}
                            mb={2}
                        >
                            <Box w={{ base: '100%', md: '140px' }}>
                                <Text variant="label">Node address</Text>
                            </Box>
                            <Text isTruncated>{address}</Text>
                        </Stack>
                        <Stack
                            spacing={4}
                            direction={{ base: 'column', md: 'row' }}
                            mb={2}
                            alignItems="center"
                        >
                            <Box w={{ base: '100%', md: '140px' }}>
                                <HStack>
                                    <Text variant="label">Node balance</Text>
                                    <Box display="flex" alignItems="center">
                                        <Tooltip
                                            placement="bottom"
                                            label="The node balance is the amount of ETH available in the node’s wallet."
                                            fontSize="small"
                                            color="white"
                                        >
                                            <Icon
                                                width={3.5}
                                                height={3.5}
                                                color={tooltipColor}
                                            />
                                        </Tooltip>
                                    </Box>
                                </HStack>
                            </Box>

                            <HStack
                                spacing={4}
                                alignItems="center"
                                flex={1}
                                width="100%"
                            >
                                <Box>
                                    <Flex align="baseline">
                                        <Text>{toETH(nodeBalance)}</Text>
                                        <Text pl={1}>ETH</Text>
                                    </Flex>
                                </Box>
                                <Box>
                                    <IconButton
                                        aria-label="Edit"
                                        size="sm"
                                        icon={<EditIcon w={4} h={4} />}
                                        variant="ghost"
                                        data-testid="edit-balance-button"
                                        disabled={isRetiringNode}
                                        onClick={depositModal.onOpen}
                                    />
                                </Box>
                            </HStack>
                        </Stack>
                        <Stack
                            spacing={4}
                            direction={{ base: 'column', md: 'row' }}
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
                        bgColor={buttonBg}
                        w={{ base: '100%', md: 'auto' }}
                        minW="173px"
                        fontWeight="bold"
                        textTransform="uppercase"
                        me={2}
                    >
                        Retire node
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
