// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { IoMdWarning } from 'react-icons/io';
import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { useMessages } from '../../../utils/messages';
import { WalletIcon } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';
import { useWallet } from '../../wallet';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import { FaRegQuestionCircle } from 'react-icons/fa';

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
    const warningIconColor = useColorModeValue(
        'light.support.warning',
        'white'
    );

    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '70%' }}>
            <HStack gap={4} alignItems="center" pt={{ base: 4, lg: 0 }}>
                <Box
                    bg={bgIcon}
                    color={iconColor}
                    w="4.125rem"
                    h="4.125rem"
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                >
                    <WalletIcon style={{ width: '1.5rem', height: '1.5rem' }} />{' '}
                </Box>
                <Box>
                    <HStack>
                        <Text color={balanceColor}>Wallet balance</Text>
                        <Tooltip
                            showArrow
                            content="Here you can see your current wallet balance."
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <Box color={balanceColor}>
                                <FaRegQuestionCircle
                                    style={{
                                        width: '0.75rem',
                                        height: '0.75rem',
                                    }}
                                />
                            </Box>
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
                <HStack gap={2} alignItems="flex-start">
                    <Box color={warningIconColor}>
                        <IoMdWarning />
                    </Box>
                    <Text fontSize="sm">
                        You don't have enough ETH in your wallet for the
                        transaction fee.
                    </Text>
                </HStack>
            )}

            {isGnosisSafe && (
                <HStack gap={2} alignItems="flex-start">
                    <Box color="orange.500">
                        <IoMdWarning />
                    </Box>
                    <Text fontSize="sm">{ethInfoMessage}</Text>
                </HStack>
            )}
        </VStack>
    );
};
