// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { memo } from 'react';
import { VStack, Box, StackProps } from '@chakra-ui/react';

export type OrderedContentProps = {
    title: string;
    orderedItems: string[];
    stackProps?: StackProps;
};

export const OrderedContent = memo(
    ({ title, orderedItems, stackProps }: OrderedContentProps) => (
        <VStack
            alignItems="flex-start"
            py={{ base: 2, md: 5 }}
            px={{ base: 3, md: 7 }}
            {...stackProps}
        >
            <p>{title}</p>
            <Box as="ol" pl={{ base: 4, md: 8 }} type="1">
                {orderedItems.map((content, i) => (
                    <li id={`text-${i}}`} key={i}>
                        {content}
                    </li>
                ))}
            </Box>
        </VStack>
    )
);
