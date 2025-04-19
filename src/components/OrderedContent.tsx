// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { memo, ReactNode } from 'react';
import { List, StackProps, VStack } from '@chakra-ui/react';

export type OrderedContentProps = {
    title: string | ReactNode;
    orderedItems: string[] | ReactNode[];
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
            <List.Root as="ol" pl={{ base: 4, md: 8 }}>
                {orderedItems.map((content, i) => (
                    <List.Item
                        id={`text-${i}}`}
                        key={i}
                        _marker={{ color: 'inherit' }}
                    >
                        {content}
                    </List.Item>
                ))}
            </List.Root>
        </VStack>
    )
);
