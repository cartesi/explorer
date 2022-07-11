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
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { WalletIcon } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';

export interface IWalletBalanceSectionProps {
    userCTSIBalance: BigNumber;
    userETHBalance: BigNumber;
}

export const WalletBalanceSection: FC<IWalletBalanceSectionProps> = ({
    userETHBalance,
    userCTSIBalance,
}) => (
    <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '70%' }}>
        <HStack spacing={4} alignItems="center" pt={{ base: 4, lg: 0 }}>
            <Box
                bg="yellow.100"
                w={14}
                h={14}
                borderRadius="full"
                display="grid"
                placeContent="center"
            >
                <WalletIcon color="yellow.500" w={6} h={6} />
            </Box>
            <Box>
                <HStack>
                    <Text color="gray.400">Wallet balance</Text>
                    <Tooltip
                        placement="top"
                        label="Here you can see your current wallet balance."
                        fontSize="small"
                        bg="black"
                        color="white"
                    >
                        <Icon color="gray.400" />
                    </Tooltip>
                </HStack>
                <Heading m={0} size="sm">
                    <Flex align="baseline">
                        <CTSI value={userCTSIBalance} />
                        <Text ml={1}>CTSI</Text>
                    </Flex>
                </Heading>
            </Box>
        </HStack>
        {userETHBalance?.isZero() && (
            <HStack spacing={2} alignItems="flex-start">
                <WarningIcon color="orange.500" />
                <Text fontSize="sm">
                    You don't have enough ETH in your wallet for the transaction
                    fee.
                </Text>
            </HStack>
        )}
    </VStack>
);
