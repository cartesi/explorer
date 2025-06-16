// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbEdit } from 'react-icons/tb';
import { BsQuestionCircle } from 'react-icons/bs';

import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Stack,
    Text,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { Tooltip } from '../Tooltip';
import { useColorModeValue } from '../ui/color-mode';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import { FC } from 'react';
import { truncateString } from '../../utils/stringUtils';
import { NodeHireNodeSection } from './NodeHireNodeSection';
import { NodeRetiredHistory } from './NodeRetiredHistory';
import { NodeBalanceModal } from './modals/NodeBalanceModal';
import { NodeRetireModal } from './modals/NodeRetireModal';

export interface INodeInfoSection {
    ownerAccount?: string;
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
    ownerAccount,
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
    const tooltipColor = useColorModeValue('gray.400', 'white');
    const bg = useColorModeValue('light.gray.secondary', 'dark.gray.primary');
    const boxShadow = useColorModeValue('sm', 'none');
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');
    const colorScheme = useColorModeValue('teal', 'blue');
    const [isLargerThan554] = useMediaQuery(['(min-width: 555px)']);
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
                        shadow={boxShadow}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="1rem"
                        px={{ base: 4, sm: 6, lg: 8 }}
                        py={{ base: 2, sm: 4, lg: 6 }}
                        mb={4}
                    >
                        <Stack
                            gap={{ base: 2, md: 4 }}
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
                            <Text lineClamp={1} flex={1}>
                                {formattedAddress}
                            </Text>
                        </Stack>
                        <Stack
                            gap={{ base: 2, md: 4 }}
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
                                            showArrow
                                            content="The node balance is the amount of ETH available in the node’s wallet."
                                            positioning={{
                                                placement: 'bottom',
                                            }}
                                            openDelay={0}
                                        >
                                            <Icon
                                                as={BsQuestionCircle}
                                                color={tooltipColor}
                                                w={3}
                                                h={3}
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
                                        h={8}
                                        w={8}
                                        variant="ghost"
                                        data-testid="edit-balance-button"
                                        disabled={isRetiring}
                                        onClick={depositModal.onOpen}
                                    >
                                        <Icon as={TbEdit} w={4} h={4} />
                                    </IconButton>
                                </Box>
                            </HStack>
                        </Stack>
                        <Stack
                            gap={{ base: 2, md: 4 }}
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
                            <HStack gap={4} alignItems="flex-end" flex={1}>
                                <Box>
                                    <Text>Hired</Text>
                                </Box>
                            </HStack>
                        </Stack>
                    </Box>
                    <Button
                        w={{ base: 'auto' }}
                        px={{ base: 4, md: 6 }}
                        minWidth={{ base: 'auto', md: '173px' }}
                        me={2}
                        colorPalette="gray"
                        variant="ghost"
                        disabled={isRetiring}
                        onClick={retireModal.onOpen}
                    >
                        Retire node
                    </Button>

                    {!isAuthorized ? (
                        <Button
                            colorPalette={colorScheme}
                            loadingText="authorizing"
                            w={{ base: 'auto' }}
                            px={{ base: 4, md: 6 }}
                            minWidth={{ base: 'auto', md: '173px' }}
                            me={2}
                            loading={isAuthorizing}
                            onClick={onAuthorize}
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
            <NodeRetiredHistory address={ownerAccount} />
        </>
    );
};
