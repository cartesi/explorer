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

import BlockCard from '../../components/block/BlockCard';

export default {
    title: 'BlockCard',
    component: BlockCard,
    argTypes: {
        highlightColor: { control: 'color' },
    },
} as ComponentMeta<typeof BlockCard>;

import blocks from './blocks.json';

const Template: ComponentStory<typeof BlockCard> = (args) => (
    <BlockCard block={blocks[0]} {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const HighlightId = Template.bind({});
HighlightId.args = {
    highlight: 'id',
};

export const HighlightProducer = Template.bind({});
HighlightProducer.args = {
    highlight: 'producer',
};

export const HighlightNode = Template.bind({});
HighlightNode.args = {
    highlight: 'node',
};
