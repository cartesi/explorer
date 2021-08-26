// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, Flex, FlexProps, Heading, Spacer, Text } from '@chakra-ui/react';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { BigNumberish } from 'ethers';
import CTSIText from '../CTSIText';

interface BalancesProps extends FlexProps {
    balance: BigNumberish;
    stakedBalance: BigNumberish;
}

export const Balances: FC<BalancesProps> = (props) => {
    const { balance, stakedBalance, ...restProps } = props;

    return (
        <Flex
            {...restProps}
            direction={['column', 'column', 'column', 'row']}
            bg="black"
            color="white"
            opacity={0.9}
            p="50px 6vw 65px 6vw"
        >
            <Box pb={[4, 4, 4, 0]}>
                <Heading as="h5" size="lg" fontWeight="normal">
                    Staking
                </Heading>
            </Box>

            <Spacer />

            <Flex w={['100%', '100%', '100%', '50%']}>
                <Box flex={1}>
                    <CTSIText value={balance} icon={FaWallet}>
                        <Text>Wallet Balance</Text>
                    </CTSIText>
                </Box>

                <Box flex={1}>
                    <CTSIText value={stakedBalance} icon={FaCoins}>
                        <Text>Staked Balance</Text>
                    </CTSIText>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Balances;
