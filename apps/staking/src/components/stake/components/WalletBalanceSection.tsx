// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { WarningIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    HStack,
    Heading,
    Icon,
    Text,
    Tooltip,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { WalletIcon } from '@explorer/ui';
import { useWallet } from '@explorer/wallet';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { useMessages } from '../../../utils/messages';
import CTSI from '../../pools/staking/CTSI';

export interface IWalletBalanceSectionProps {
    userCTSIBalance: BigNumber;
    userETHBalance: BigNumber;
}

export const WalletBalanceSection: FC<IWalletBalanceSectionProps> = ({
    userETHBalance,
    userCTSIBalance,
}) => {
    const balanceColor = useColorModeValue('gray.400', 'white');
    const bgIcon = useColorModeValue('teal.light', 'black');
    const { isGnosisSafe } = useWallet();
    const ethInfoMessage = useMessages('balance.eth.available.forGasCosts');
    const iconColor = useColorModeValue('light.primary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.primary');
    const warningIconColor = useColorModeValue(
        'light.support.warning',
        'white'
    );

    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '70%' }}>
            <HStack spacing={4} alignItems="center" pt={{ base: 4, lg: 0 }}>
                <Box
                    bg={bgIcon}
                    w="4.125rem"
                    h="4.125rem"
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                >
                    <WalletIcon color={iconColor} w={6} h={6} />{' '}
                </Box>
                <Box>
                    <HStack>
                        <Text color={balanceColor}>Wallet balance</Text>
                        <Tooltip
                            placement="top"
                            label="Here you can see your current wallet balance."
                            fontSize="small"
                            bg="dark.gray.quaternary"
                            color="white"
                            borderRadius={'md'}
                            opacity={0.9}
                        >
                            <Icon color={balanceColor} w={3.5} h={3.5} />
                        </Tooltip>
                    </HStack>
                    <Heading m={0} size="sm">
                        <Flex align="baseline">
                            <CTSI value={userCTSIBalance} />
                            <Text ml={1} fontSize="sm">
                                CTSI
                            </Text>
                        </Flex>
                    </Heading>
                </Box>
            </HStack>
            {userETHBalance?.isZero() && !isGnosisSafe && (
                <HStack spacing={2} alignItems="flex-start">
                    <WarningIcon color={warningIconColor} />
                    <Text fontSize="sm">
                        You don't have enough ETH in your wallet for the
                        transaction fee.
                    </Text>
                </HStack>
            )}

            {isGnosisSafe && (
                <HStack spacing={2} alignItems="flex-start">
                    <WarningIcon color="orange.500" />
                    <Text fontSize="sm">{ethInfoMessage}</Text>
                </HStack>
            )}
        </VStack>
    );
};
