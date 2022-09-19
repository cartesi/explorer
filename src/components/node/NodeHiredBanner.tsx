// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CheckCircleIcon } from '@chakra-ui/icons';
import {
    Text,
    Box,
    HStack,
    chakra,
    CloseButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { FC } from 'react';

export interface NodeHiredBannerProps {
    onClose?: () => void;
}

export const NodeHiredBanner: FC<NodeHiredBannerProps> = ({ onClose }) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            shadow="sm"
            p={3}
            pl={5}
            mb={6}
            borderLeftWidth={14}
            borderLeftColor={'green.400'}
        >
            <HStack spacing={2} justifyContent="space-between">
                <HStack spacing={2} mb={1}>
                    <CheckCircleIcon color="green.400" mr={2} />
                    <Text fontSize="sm">
                        <chakra.span fontWeight="bold" fontSize="sm">
                            Congratulations!{' '}
                        </chakra.span>
                        The node was hired successfully.
                    </Text>
                </HStack>
                <CloseButton onClick={onClose} />
            </HStack>
        </Box>
    );
};
