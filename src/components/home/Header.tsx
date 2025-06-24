// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Heading, HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import CTSIText from '../CTSIText';
import { TbHelp } from 'react-icons/tb';

import { Tooltip } from '../Tooltip';

import { useWallet } from '../wallet';

const HomeHeader = () => {
    const { account } = useWallet();
    const blockNumber = useBlockNumber();
    const { balance } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking(account);
    const poolBalance = useTotalPoolBalance(account);

    return (
        <Box
            bg="dark.gray.tertiary"
            color="white"
            display={{ base: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
            pt={4}
            pb={8}
            px={{ base: '6vw', xl: '12vw' }}
        >
            <Stack alignItems="flex-start" direction="column">
                <Heading as="h1" fontSize={['4xl', '5xl']} fontWeight={500}>
                    Explorer
                </Heading>
            </Stack>
            <Wrap
                color="white"
                justify={{
                    base: 'flex-start',
                    sm: 'flex-end',
                }}
                align="flex-end"
                pl={{ base: 0, md: '6vw' }}
            >
                <CTSIText
                    value={balance}
                    pt={{ base: 4, md: 0 }}
                    pr={{ base: 2, sm: 10, md: 16 }}
                >
                    <Text color="white" mb={2} fontWeight={500}>
                        Wallet Balance
                    </Text>
                </CTSIText>

                <CTSIText
                    value={stakedBalance.add(poolBalance)}
                    pt={{ base: 4, md: 0 }}
                >
                    <HStack mb={2} fontWeight={500}>
                        <Text color="white">Staked Balance</Text>
                        <Tooltip
                            showArrow
                            content="This includes direct staking and pool staking."
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <TbHelp />
                        </Tooltip>
                    </HStack>
                </CTSIText>
            </Wrap>
        </Box>
    );
};

export default HomeHeader;
