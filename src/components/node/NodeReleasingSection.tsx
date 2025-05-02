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
    Button,
    Flex,
    HStack,
    Heading,
    Icon,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { AiFillDollarCircle } from 'react-icons/ai';
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
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );
    const colorScheme = useColorModeValue('teal', 'cyan');
    const iconColorModeColor = useColorModeValue(
        'dark.secondary',
        'dark.primary'
    );
    const iconColor = releasingBalance.isZero()
        ? 'gray.450'
        : iconColorModeColor;

    return (
        <Box
            position="relative"
            bg={bg}
            p={6}
            pl={7}
            mt={5}
            borderRadius="1rem"
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack gap={8} alignItems="center">
                    <Box
                        w={14}
                        h={14}
                        minW={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <Icon
                            w={9}
                            h={9}
                            as={AiFillDollarCircle}
                            color={iconColor}
                        />
                    </Box>
                    <Box>
                        <Text pb={1} fontWeight="semibold" fontSize="lg">
                            {releasingLeftShort ? 'Releasing' : 'Released'}
                        </Text>
                        <Text pb={1} fontSize="sm">
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
                    gap={4}
                    alignItems="center"
                >
                    {releasingBalance.gt(0) && releasingLeftShort && (
                        <Button
                            colorPalette="gray"
                            variant="ghost"
                            mt={[8, 0]}
                            disabled
                        >
                            WITHDRAW ({releasingLeftShort})
                        </Button>
                    )}
                    {releasingBalance.gt(0) && !releasingLeftShort && (
                        <Button
                            colorPalette={colorScheme}
                            mt={[8, 0]}
                            onClick={onWithdraw}
                        >
                            WITHDRAW
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
