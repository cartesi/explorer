// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BlockMiniCard from '../../components/block/BlockMiniCard';

export default {
    title: 'BlockMiniCard',
    component: BlockMiniCard,
    argTypes: {},
} as ComponentMeta<typeof BlockMiniCard>;

const Template: ComponentStory<typeof BlockMiniCard> = (args) => (
    <BlockMiniCard {...args} />
);

import blocks from './blocks.json';

export const Complete = Template.bind({});
Complete.args = {
    block: blocks[0],
};

export const NoProtocol = Template.bind({});
NoProtocol.args = {
    block: blocks[0],
    showProtocol: false,
};

export const OnlyNumber = Template.bind({});
OnlyNumber.args = {
    block: blocks[0],
    showChain: false,
    showProtocol: false,
};
