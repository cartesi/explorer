// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Icon } from '@chakra-ui/icons';
import {
    Box,
    Heading,
    HStack,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    Wrap,
} from '@chakra-ui/react';
import { useWallet } from '@explorer/wallet';
import { theme } from '@explorer/ui';
import CTSIText from '../../components/CTSIText';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';

const HomeHeader = () => {
    const { account } = useWallet();
    const blockNumber = useBlockNumber();
    const { balance } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking(account);
    const poolBalance = useTotalPoolBalance(account);
    const headerBg = useColorModeValue('header', 'dark.gray.tertiary');
    const fontFamily = theme.fonts.title;

    return (
        <Box
            bg={headerBg}
            color="white"
            display={{ base: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
            pt={4}
            pb={8}
            px={{ base: '6vw', xl: '12vw' }}
        >
            <Stack alignItems="flex-start" direction="column">
                <Heading
                    as="h1"
                    fontSize={['4xl', '5xl']}
                    fontFamily={fontFamily}
                    fontWeight={500}
                >
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
                shouldWrapChildren
            >
                <CTSIText
                    value={balance}
                    pt={{ base: 4, md: 0 }}
                    pr={{ base: 2, sm: 10, md: 16 }}
                    fontFamily={fontFamily}
                >
                    <Text
                        color="white"
                        mb={2}
                        fontFamily={fontFamily}
                        fontWeight={500}
                    >
                        Wallet Balance
                    </Text>
                </CTSIText>

                <CTSIText
                    value={stakedBalance.add(poolBalance)}
                    pt={{ base: 4, md: 0 }}
                    fontFamily={fontFamily}
                >
                    <HStack mb={2} fontFamily={fontFamily} fontWeight={500}>
                        <Text color="white">Staked Balance</Text>
                        <Tooltip
                            label="This includes direct staking and pool staking."
                            placement="top"
                        >
                            <Icon />
                        </Tooltip>
                    </HStack>
                </CTSIText>
            </Wrap>
        </Box>
    );
};

export default HomeHeader;
