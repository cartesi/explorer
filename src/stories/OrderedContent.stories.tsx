// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { SimpleGrid } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { OrderedContent } from '../components/OrderedContent';

export default {
    title: 'Ordered Content',
    component: OrderedContent,
    argTypes: {},
} as Meta<typeof OrderedContent>;

type Story = StoryObj<typeof OrderedContent>;

const Template: Story = {
    render: (args) => {
        return <OrderedContent {...args} />;
    },
};

const WithGridTemplate: Story = {
    render: (args) => {
        return (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
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
    },
};

export const Simple: Story = {
    args: {
        title: 'Main responsibilities:',
        orderedItems: [
            'Must guarantee availability 24/7',
            'Make sure the node always have funds',
        ],
    },
    ...Template,
};

export const MultipleInAGrid: Story = {
    args: {
        title: 'Main responsibilities:',
        orderedItems: [
            'Must guarantee availability 24/7',
            'Make sure the node always have funds',
        ],
        stackProps: {
            boxShadow: 'md',
            borderRadius: 6,
        },
    },
    ...WithGridTemplate,
};
