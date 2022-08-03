// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Flex, Button, Stack, Heading, Text } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

import { BigNumber } from 'ethers';
import { FC } from 'react';

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
    return (
        <Stack
            spacing={4}
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
                    colorScheme="blue"
                    onClick={onDepositClick}
                    width="173px"
                    ml="auto"
                    disabled={
                        userWalletBalance.isZero() || userETHBalance?.isZero()
                    }
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
                                <WarningIcon color="orange.500" /> You have 0
                                CTSI. Please, add CTSI to deposit.
                            </>
                        ) : userETHBalance?.isZero() ? (
                            <>
                                <WarningIcon color="orange.500" /> You have 0
                                ETH. You'll need ETH for transaction fees.
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
