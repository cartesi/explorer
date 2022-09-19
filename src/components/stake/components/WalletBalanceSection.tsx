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
    Text,
    Flex,
    HStack,
    VStack,
    Tooltip,
    Icon,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { useWallet } from '../../../contexts/wallet';
import { useMessages } from '../../../utils/messages';
import { WalletIcon } from '../../Icons';
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
    const { isGnosisSafe } = useWallet();
    const ethInfoMessage = useMessages('balance.eth.available.forGasCosts');

    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '70%' }}>
            <HStack spacing={4} alignItems="center" pt={{ base: 4, lg: 0 }}>
                <Box
                    bg="orange.40"
                    w="4.125rem"
                    h="4.125rem"
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                >
                    <WalletIcon color="light.support.attention" w={6} h={6} />{' '}
                </Box>
                <Box>
                    <HStack>
                        <Text color={balanceColor}>Wallet balance</Text>
                        <Tooltip
                            placement="top"
                            label="Here you can see your current wallet balance."
                            fontSize="small"
                            bg="black"
                            color="white"
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
                    <WarningIcon color="orange.500" />
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
