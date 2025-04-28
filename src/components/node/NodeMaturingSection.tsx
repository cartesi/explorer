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
    Stack,
    Text,
    Icon,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { TimeIcon } from '../Icons';
import CTSI from '../pools/staking/CTSI';
import { useColorModeValue } from '../ui/color-mode';

export interface INodeMaturingSection {
    maturingBalance: BigNumber;
    maturingLeft?: string;
}

export const NodeMaturingSection: FC<INodeMaturingSection> = ({
    maturingBalance,
    maturingLeft = '6 hours',
}) => {
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );
    const iconColorModeColor = useColorModeValue(
        'dark.secondary',
        'dark.primary'
    );
    const iconColor = maturingBalance.isZero()
        ? 'gray.450'
        : iconColorModeColor;

    return (
        <Box
            position="relative"
            bg={bg}
            p={6}
            pl={7}
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
                        <Icon as={TimeIcon} color={iconColor} w={9} h={9} />
                    </Box>

                    <Box>
                        <Text pb={1} fontSize="lg" fontWeight={600}>
                            Maturing
                        </Text>
                        <Text pb={1} fontSize="sm">
                            The staking will take 6 hours to be ready. Each new
                            stake will restart the waiting time.
                        </Text>
                        <Heading m={0} size="sm">
                            <Flex align="baseline">
                                <CTSI value={maturingBalance} />
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
                    {maturingBalance.gt(0) && maturingLeft && (
                        <Button
                            colorPalette="gray"
                            variant="ghost"
                            mt={[8, 0]}
                            disabled
                        >
                            STAKE ({maturingLeft})
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
