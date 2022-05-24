// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

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
import CTSI from '../pools/staking/CTSI';

interface INodeAllowanceSectionProps {
    allowance: BigNumber;
    onAllowanceClick: () => void;
}

export const NodeAllowanceSection: FC<INodeAllowanceSectionProps> = ({
    allowance,
    onAllowanceClick,
}) => {
    return (
        <VStack alignItems="flex-start" flexBasis={{ base: '100%', lg: '20%' }}>
            <HStack
                w="full"
                spacing={4}
                alignItems="center"
                pt={{ base: 4, lg: 0 }}
            >
                <Box flexGrow="1">
                    <HStack>
                        <Text color="gray.400">Allowance</Text>
                        <Tooltip
                            placement="top"
                            label="Here you can see your current allowance."
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon color="gray.400" />
                        </Tooltip>
                    </HStack>
                    <Heading m={0} size="sm">
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
        </VStack>
    );
};
