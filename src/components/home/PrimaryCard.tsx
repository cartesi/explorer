// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Flex,
    HStack,
    Heading,
    IconProps,
    StackProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';

export interface PrimaryCardProps extends StackProps {
    children: React.ReactNode;
    icon: FC<IconProps>;
}

const PrimaryCard: FC<PrimaryCardProps> = ({
    children,
    icon,
    ...restProps
}) => {
    const CardIcon = icon;

    return (
        <HStack {...restProps}>
            <Box
                bg="gray.90"
                w="4.125rem"
                h="4.125rem"
                borderRadius="full"
                display="grid"
                placeContent="center"
                mr="0.25rem"
            >
                <CardIcon color="light.support.attention" w={6} h={6} />
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
