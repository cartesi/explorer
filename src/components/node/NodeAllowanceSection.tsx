// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbEdit } from 'react-icons/tb';
import { BsQuestionCircle } from 'react-icons/bs';

import {
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Tooltip } from '../Tooltip';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import CTSI from '../pools/staking/CTSI';
import { useColorModeValue } from '../ui/color-mode';

interface INodeAllowanceSectionProps {
    allowance: BigNumber;
    onAllowanceClick: () => void;
}

export const NodeAllowanceSection: FC<INodeAllowanceSectionProps> = ({
    allowance,
    onAllowanceClick,
}) => {
    const color = useColorModeValue('gray.400', 'white');

    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '20%' }}>
            <HStack
                w="full"
                gap={4}
                justify="flex-end"
                alignItems="center"
                pt={{ base: 4, lg: 0 }}
            >
                <Box
                    bg="transparent"
                    w="4.125rem"
                    h="4.125rem"
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                />
                <Box flex={0}>
                    <HStack>
                        <Text color={color}>Allowance</Text>
                        <Tooltip
                            showArrow
                            content="Here you can see your current wallet balance."
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <Icon
                                as={BsQuestionCircle}
                                color={color}
                                w={3}
                                h={3}
                            />
                        </Tooltip>
                    </HStack>
                    <Heading m={0} size="sm">
                        <Flex align="baseline">
                            <CTSI value={allowance} />
                            <Text ml={1}>CTSI</Text>
                        </Flex>
                    </Heading>
                </Box>
                <Box alignSelf="flex-end" mt="1.625rem !important">
                    <IconButton
                        aria-label="Edit"
                        size="md"
                        variant="ghost"
                        onClick={onAllowanceClick}
                    >
                        <TbEdit />
                    </IconButton>
                </Box>
            </HStack>
        </VStack>
    );
};
