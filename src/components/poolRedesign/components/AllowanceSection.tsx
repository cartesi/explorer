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
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { AllowanceIcon } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';

interface IAllowanceSectionProps {
    allowance: BigNumber;
    onAllowanceClick: () => void;
}

export const AllowanceSection: FC<IAllowanceSectionProps> = ({
    allowance,
    onAllowanceClick,
}) => {
    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '50%' }}>
            <HStack
                w="full"
                spacing={4}
                alignItems="center"
                p={4}
                border="1px dotted"
                borderRadius={6}
                borderColor="yellow.300"
            >
                <Box
                    bg="yellow.100"
                    w={14}
                    h={14}
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                >
                    <AllowanceIcon color="yellow.500" w={6} h={6} />
                </Box>
                <Box flexGrow="1">
                    <HStack>
                        <Text color="gray.400">Pool allowance</Text>
                        <Tooltip
                            placement="top"
                            label="Here you can see your current pool allowance."
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon color="gray.400" />
                        </Tooltip>
                    </HStack>
                    <Heading m={0} size="lg">
                        <Flex align="baseline">
                            <CTSI value={allowance} />
                            <Text ml={1}>CTSI</Text>
                        </Flex>
                    </Heading>
                </Box>
                <Box alignSelf="flex-end">
                    <IconButton
                        aria-label="Edit"
                        size="sm"
                        icon={<EditIcon />}
                        variant="ghost"
                        onClick={onAllowanceClick}
                    />
                </Box>
            </HStack>
            <Text fontSize="sm">
                Step 1 for newcomers: Set up an upper limit for an additional
                layer of protection.
            </Text>
        </VStack>
    );
};
