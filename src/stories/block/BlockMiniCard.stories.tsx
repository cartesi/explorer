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
import blocks from './blocks.json';
import BlockMiniCard from '../../components/block/BlockMiniCard';
import { Block } from '../../graphql/models';

const block = blocks[0] as unknown as Block;

export default {
    title: 'BlockMiniCard',
    component: BlockMiniCard,
    argTypes: {},
} as Meta<typeof BlockMiniCard>;

type Story = StoryObj<typeof BlockMiniCard>;

const Template: Story = {
    render: (args) => <BlockMiniCard {...args} />,
};

export const Complete: Story = {
    args: {
        block,
    },
    ...Template,
};

export const NoProtocol: Story = {
    args: {
        block,
        showProtocol: false,
    },
    ...Template,
};

export const OnlyNumber: Story = {
    args: {
        block,
        showChain: false,
        showProtocol: false,
    },
    ...Template,
};
