// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Text,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    Heading,
    Icon,
    Button,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { AiOutlineDollar } from 'react-icons/ai';
import CTSI from '../pools/staking/CTSI';

export interface INodeReleasingSection {
    releasingBalance: BigNumber;
    releasingLeftShort?: string;
    onWithdraw: () => void;
}

export const NodeReleasingSection: FC<INodeReleasingSection> = ({
    releasingBalance,
    releasingLeftShort,
    onWithdraw,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            borderRadius="lg"
            shadow="sm"
            p={6}
            pl={5}
            mt={6}
            borderLeftWidth={14}
            borderLeftColor={
                releasingBalance.isZero() ? 'gray.200' : 'yellow.400'
            }
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={4} alignItems="center">
                    <Box
                        w={14}
                        h={14}
                        minW={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <Icon
                            as={AiOutlineDollar}
                            color={
                                releasingBalance.isZero()
                                    ? 'gray.200'
                                    : 'yellow.400'
                            }
                            w={9}
                            h={9}
                        />
                    </Box>
                    <Box>
                        <Text pb={1} color="gray.400" fontWeight="semibold">
                            {releasingLeftShort ? 'Releasing' : 'Released'}
                        </Text>
                        <Text pb={1} fontSize={'sm'} color="gray.400">
                            Your funds take 48 hours to become unblocked.
                        </Text>
                        <Heading m={0} size="sm">
                            <Flex align="baseline">
                                <CTSI value={releasingBalance} />
                                <Text ml={1}>CTSI</Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>
                <Stack
                    direction={['column', 'row']}
                    spacing={4}
                    alignItems="center"
                >
                    {releasingBalance.gt(0) && releasingLeftShort && (
                        <Button bg={bg} mt={[8, 0]} disabled={true}>
                            WITHDRAW ({releasingLeftShort})
                        </Button>
                    )}
                    {releasingBalance.gt(0) && !releasingLeftShort && (
                        <Button bg={bg} mt={[8, 0]} onClick={onWithdraw}>
                            WITHDRAW
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
