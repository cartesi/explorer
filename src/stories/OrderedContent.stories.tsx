// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { SimpleGrid } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
    OrderedContent,
    OrderedContentProps,
} from '../components/OrderedContent';

export default {
    title: 'Ordered Content',
    component: OrderedContent,
    argTypes: {},
} as ComponentMeta<typeof OrderedContent>;

const SimpleStory: ComponentStory<typeof OrderedContent> = (args) => {
    return <OrderedContent {...args} />;
};

const WithGridTemplate: ComponentStory<typeof OrderedContent> = (args) => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
            <OrderedContent
                title={args.title}
                orderedItems={args.orderedItems}
                stackProps={args.stackProps}
            />
            <OrderedContent
                title={args.title}
                orderedItems={args.orderedItems}
                stackProps={args.stackProps}
            />
            <OrderedContent
                title={args.title}
                orderedItems={args.orderedItems}
                stackProps={args.stackProps}
            />
            <OrderedContent
                title={args.title}
                orderedItems={args.orderedItems}
                stackProps={args.stackProps}
            />
            <OrderedContent
                title={args.title}
                orderedItems={args.orderedItems}
                stackProps={args.stackProps}
            />
        </SimpleGrid>
    );
};

export const Simple = SimpleStory.bind({});
Simple.args = {
    title: 'Main responsabilities:',
    orderedItems: [
        'Must guarantee availability 24/7',
        'Make sure the node always have funds',
    ],
} as OrderedContentProps;

export const MultipleInAGrid = WithGridTemplate.bind({});
MultipleInAGrid.args = {
    title: 'Main responsabilities:',
    orderedItems: [
        'Must guarantee availability 24/7',
        'Make sure the node always have funds',
    ],
    stackProps: {
        boxShadow: 'md',
        borderRadius: 6,
    },
} as OrderedContentProps;
