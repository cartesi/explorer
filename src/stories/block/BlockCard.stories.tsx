// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import BlockCard from '../../components/block/BlockCard';
import blocks from './blocks.json';

export default {
    title: 'BlockCard',
    component: BlockCard,
    argTypes: {
        highlightColor: { control: 'color' },
    },
} as Meta<typeof BlockCard>;

type Story = StoryObj<typeof BlockCard>;

const Template: Story = {
    render: (args) => <BlockCard block={blocks[0]} {...args} />,
};

export const Default: Story = {
    ...Template,
};

export const HighlightId: Story = {
    args: {
        highlight: 'id',
    },
    ...Template,
};

export const HighlightProducer: Story = {
    args: {
        highlight: 'producer',
    },
    ...Template,
};

export const HighlightNode: Story = {
    args: {
        highlight: 'node',
    },
    ...Template,
};
