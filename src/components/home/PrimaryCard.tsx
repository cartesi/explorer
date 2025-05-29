// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Flex, HStack, Heading, StackProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useColorModeValue } from '../ui/color-mode';

export interface PrimaryCardProps extends StackProps {
    children: React.ReactNode;
    icon: ReactNode;
}

const PrimaryCard: FC<PrimaryCardProps> = ({
    children,
    icon,
    ...restProps
}) => {
    const bg = useColorModeValue('dark.gray.senary', 'transparent');

    return (
        <HStack {...restProps}>
            <Box
                bg={bg}
                w="4.125rem"
                h="4.125rem"
                borderRadius="full"
                display="grid"
                placeContent="center"
                mr="0.25rem"
            >
                {icon}
            </Box>

            <Box>
                <Heading m={0} size="sm">
                    <Flex align="baseline">{children}</Flex>
                </Heading>
            </Box>
        </HStack>
    );
};

export default PrimaryCard;
