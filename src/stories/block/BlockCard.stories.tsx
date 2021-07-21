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
    title: 'Block/Card',
    component: BlockCard,
    argTypes: {},
} as ComponentMeta<typeof BlockCard>;

const Template: ComponentStory<typeof BlockCard> = (args) => (
    <BlockCard {...args} />
);

const block = {
    id: '0x8e052b09ff27fa13f2e0e2423123cce07fc7559e3183c14af247dc6a7714559e',
    chain: {
        id: '0x20516624de3cbe267a514fe91c31477369524fce-0',
        number: 1,
        protocol: {
            version: 2,
        },
    },
    number: 4325,
    timestamp: '1626736784',
    difficulty: '10417102654650140659703',
    node: {
        id: '0xa7e460269706cb42bbb3413d07d1576536b30188',
    },
    producer: {
        id: '0xe6eb0a6687a658c3af15a26879ce2c9f1385dcf6',
    },
    reward: '2900000000000000000000',
};

export const Complete = Template.bind({});
Complete.args = {
    block,
};

export const NoProtocol = Template.bind({});
NoProtocol.args = {
    block,
    showProtocol: false,
};

export const OnlyNumber = Template.bind({});
OnlyNumber.args = {
    block,
    showChain: false,
    showProtocol: false,
};
