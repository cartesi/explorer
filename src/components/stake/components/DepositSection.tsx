// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbAlertCircleFilled } from 'react-icons/tb';
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../ui/color-mode';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { useWallet } from '../../wallet';

export interface IDepositSection {
    userWalletBalance: BigNumber;
    userETHBalance: BigNumber;
    onDepositClick: () => void;
}

export const DepositSection: FC<IDepositSection> = ({
    userWalletBalance,
    userETHBalance,
    onDepositClick,
}) => {
    const { isGnosisSafe } = useWallet();
    const noEthAndIsNotASafe = userETHBalance?.isZero() && !isGnosisSafe;
    const warningIconColor = useColorModeValue(
        'light.support.warning',
        'dark.support.warning'
    );
    const colorScheme = useColorModeValue('teal', 'blue');

    return (
        <Stack
            gap={4}
            justifyContent="space-between"
            alignContent="flex-start"
            direction={{ base: 'column', md: 'row' }}
        >
            <Box>
                <Heading as="h2" size="lg" py={2} mb={0}>
                    Staking
                </Heading>
            </Box>
            <Flex px={6} justifyContent="right" flexDirection="column">
                <Button
                    colorPalette={colorScheme}
                    onClick={onDepositClick}
                    width="173px"
                    ml="auto"
                    disabled={userWalletBalance.isZero() || noEthAndIsNotASafe}
                >
                    Deposit
                </Button>
                <Box pt={2} ml="auto">
                    <Text
                        fontSize="xs"
                        textAlign={{ base: 'left', md: 'right' }}
                    >
                        {userWalletBalance.isZero() ? (
                            <>
                                <Icon
                                    as={TbAlertCircleFilled}
                                    color={warningIconColor}
                                    w={4}
                                    h={4}
                                />{' '}
                                You have 0 CTSI. Please, add CTSI to deposit.
                            </>
                        ) : noEthAndIsNotASafe ? (
                            <>
                                <Icon
                                    as={TbAlertCircleFilled}
                                    color={warningIconColor}
                                    w={4}
                                    h={4}
                                />{' '}
                                You have 0 ETH. You'll need ETH for transaction
                                fees.
                            </>
                        ) : (
                            <>Let's deposit your tokens to the pool!</>
                        )}
                    </Text>
                </Box>
            </Flex>
        </Stack>
    );
};
