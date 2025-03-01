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

import { NodeStakedBalanceSection } from '../../components/node/NodeStakedBalanceSection';
import { ethers } from 'ethers';

export default {
    title: 'Node/NodeStakedBalanceSection',
    component: NodeStakedBalanceSection,
    argTypes: {},
} as ComponentMeta<typeof NodeStakedBalanceSection>;

const Template: ComponentStory<typeof NodeStakedBalanceSection> = (args) => (
    <NodeStakedBalanceSection {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
    stakedBalance: ethers.utils.parseEther('0.0'),
};
