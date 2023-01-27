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
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import { FC } from 'react';
import { truncateString } from '../../utils/stringUtils';
import { NodeBalanceModal } from './modals/NodeBalanceModal';
import { NodeRetireModal } from './modals/NodeRetireModal';
import { NodeHireNodeSection } from './NodeHireNodeSection';
import { NodeRetiredHistory } from './NodeRetiredHistory';

export interface INodeInfoSection {
    address: string;
    userBalance: BigNumber;
    nodeBalance: BigNumber;
    isHiring?: boolean;
    isRetired?: boolean;
    isRetiring?: boolean;
    isAuthorizing?: boolean;
    isAuthorized?: boolean;
    onRetire: (nodeAddress: string) => void;
    onDeposit: (funds: BigNumber) => void;
    onHire: (nodeAddress: string, funds: BigNumber) => void;
    onAuthorize?: () => void;
}

export const NodeInfoSection: FC<INodeInfoSection> = ({
    address,
    userBalance,
    nodeBalance,
    isHiring = false,
    isRetired = false,
    isRetiring = false,
    isAuthorizing = false,
    isAuthorized = true,
    onRetire,
    onDeposit,
    onHire,
    onAuthorize,
}) => {
    // dark mode support
    const bg = useColorModeValue('white', 'gray.800');
    const buttonBg = useColorModeValue('gray.80', 'gray.800');
    const tooltipColor = useColorModeValue('gray.400', 'white');
    const [isLargerThan554] = useMediaQuery('(min-width: 555px)');
    const textFontWeight = isLargerThan554 ? 400 : 600;

    const retireModal = useDisclosure();
    const depositModal = useDisclosure();

    const isNodeHireSectionVisible = isRetired || isHiring || isEmpty(address);
    const formattedAddress = isLargerThan554
        ? address
        : truncateString(address);

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
                <NodeHireNodeSection isHiring={isHiring} onHire={onHire} />
            ) : (
                <>
                    <Box
                        bg={bg}
                        shadow="md"
                        px={{ base: 4, sm: 6, lg: 8 }}
                        py={{ base: 2, sm: 4, lg: 6 }}
                        mb={2}
                    >
                        <Stack
                            spacing={{ base: 2, md: 4 }}
                            direction={{ base: 'row' }}
                            mb={2}
                        >
                            <Box
                                minWidth={{ base: '130px', sm: '140px' }}
                                flex={{ base: 'none', md: 0 }}
                            >
                                <Text
                                    variant="label"
                                    fontWeight={textFontWeight}
                                >
                                    Node Address
                                </Text>
                            </Box>
                            <Text noOfLines={1} flex={1}>
                                {formattedAddress}
                            </Text>
                        </Stack>
                        <Stack
                            spacing={{ base: 2, md: 4 }}
                            direction={{ base: 'row' }}
                            mb={2}
                            alignItems="center"
                        >
                            <Box
                                minWidth={{ base: '130px', sm: '140px' }}
                                flex={{ base: 'none', md: 0 }}
                            >
                                <HStack>
                                    <Text
                                        variant="label"
                                        fontWeight={textFontWeight}
                                    >
                                        Node Balance
                                    </Text>
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

                            <HStack alignItems="center" flex={1} width="100%">
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
                                        disabled={isRetiring}
                                        onClick={depositModal.onOpen}
                                    />
                                </Box>
                            </HStack>
                        </Stack>
                        <Stack
                            spacing={{ base: 2, md: 4 }}
                            direction={{ base: 'row' }}
                        >
                            <Box
                                minWidth={{ base: '130px', sm: '140px' }}
                                flex={{ base: 'none', md: 0 }}
                            >
                                <HStack>
                                    <Text
                                        variant="label"
                                        fontWeight={textFontWeight}
                                    >
                                        Node Status
                                    </Text>
                                </HStack>
                            </Box>
                            <HStack spacing={4} alignItems="flex-end" flex={1}>
                                <Box>
                                    <Text>Hired</Text>
                                </Box>
                            </HStack>
                        </Stack>
                    </Box>
                    <Button
                        onClick={retireModal.onOpen}
                        disabled={isRetiring}
                        bgColor={buttonBg}
                        w={{ base: 'auto' }}
                        px={{ base: 4, md: 6 }}
                        minWidth={{ base: 'auto', md: '173px' }}
                        fontWeight="bold"
                        textTransform="uppercase"
                        me={2}
                    >
                        Retire node
                    </Button>

                    {!isAuthorized ? (
                        <Button
                            onClick={onAuthorize}
                            isLoading={isAuthorizing}
                            loadingText="authorizing"
                            bgColor={buttonBg}
                            w={{ base: 'auto' }}
                            px={{ base: 4, md: 6 }}
                            minWidth={{ base: 'auto', md: '173px' }}
                            fontWeight="bold"
                            textTransform="uppercase"
                            me={2}
                        >
                            Authorize
                        </Button>
                    ) : null}

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
            <NodeRetiredHistory address={address} />
        </>
    );
};
