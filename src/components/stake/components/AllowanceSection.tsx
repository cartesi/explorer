// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon } from '@chakra-ui/icons';
import {
    Box,
    Text,
    Flex,
    HStack,
    VStack,
    Tooltip,
    Icon,
    Heading,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import CTSI from '../../pools/staking/CTSI';
import { PencilIconWhite } from '../../Icons';

export interface IAllowanceSectionProps {
    allowance: BigNumber;
    onAllowanceClick: () => void;
}

export const AllowanceSection: FC<IAllowanceSectionProps> = ({
    allowance,
    onAllowanceClick,
}) => {
    const color = useColorModeValue('gray.400', 'white');
    const IconColor = useColorModeValue('black', 'white');
    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '25%' }}>
            <HStack
                w="full"
                spacing={4}
                alignItems="center"
                pt={{ base: 4, lg: 0 }}
            >
                <Box flexGrow="1">
                    <HStack>
                        <Text color={color}>Pool allowance</Text>
                        <Tooltip
                            placement="top"
                            label="Here you can see your current pool allowance."
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon color={color} w={3.5} h={3.5} />
                        </Tooltip>
                    </HStack>
                    <Heading m={0} size="sm" pt={2.5}>
                        <Flex align="baseline">
                            <CTSI value={allowance} />
                            <Text ml={1} fontSize="sm">
                                CTSI
                            </Text>
                            <Box>
                                <IconButton
                                    mx={2}
                                    marginTop="-7px"
                                    aria-label="Edit"
                                    size="sm"
                                    icon={
                                        <PencilIconWhite
                                            style={{
                                                height: 24,
                                                width: 24,
                                            }}
                                            color={IconColor}
                                        />
                                    }
                                    variant="ghost"
                                    role="button-icon"
                                    onClick={onAllowanceClick}
                                />
                            </Box>
                        </Flex>
                    </Heading>
                </Box>
            </HStack>
        </VStack>
    );
};
