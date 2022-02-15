// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Heading, Link } from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';

export interface IDepositSection {
    allowance: BigNumber;
    userWalletBalance: BigNumber;
    userETHBalance: BigNumber;
    onDepositClick: () => void;
}

export const DepositSection: FC<IDepositSection> = ({
    allowance,
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
                <Heading as="h2" size="lg" mb={0}>
                    Staking
                </Heading>
                <Link href="#" isExternal fontSize="xs">
                    Learn more <ExternalLinkIcon />
                </Link>
            </Box>
            <Box px={6}>
                <Button
                    colorScheme="blue"
                    onClick={onDepositClick}
                    w={{ base: '100%', md: 'auto' }}
                    minW="15rem"
                    disabled={
                        allowance.isZero() ||
                        userWalletBalance.isZero() ||
                        userETHBalance?.isZero()
                    }
                >
                    Deposit
                </Button>
            </Box>
        </Stack>
    );
};
