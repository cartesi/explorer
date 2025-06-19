// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbAlertTriangleFilled } from 'react-icons/tb';
import { Box, chakra, HStack, Icon, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useColorModeValue } from '../ui/color-mode';
import CloseButton from '../CloseButton';

export interface NodeRetiredBannerProps {
    onClose?: () => void;
}

export const NodeRetiredBanner: FC<NodeRetiredBannerProps> = ({ onClose }) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            shadow="sm"
            p={3}
            pl={5}
            mb={6}
            borderLeftWidth={14}
            borderLeftColor={'orange'}
        >
            <HStack gap={2} justifyContent="space-between">
                <HStack gap={2} mb={1}>
                    <Icon
                        as={TbAlertTriangleFilled}
                        color="orange.500"
                        mr={2}
                    />
                    <Text fontSize="sm">
                        <chakra.span fontWeight="bold" fontSize="sm">
                            Your node has been retired
                        </chakra.span>
                        , you will need to hire a new node.
                    </Text>
                </HStack>
                <CloseButton onClick={onClose} />{' '}
            </HStack>
        </Box>
    );
};
