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

import { NodeMaturingSection } from '../../components/node/NodeMaturingSection';
import { ethers } from 'ethers';

export default {
    title: 'Node/NodeMaturingSection',
    component: NodeMaturingSection,
    argTypes: {},
} as Meta<typeof NodeMaturingSection>;

type Story = StoryObj<typeof NodeMaturingSection>;

const Template: Story = {
    render: (args) => <NodeMaturingSection {...args} />,
};

export const Basic: Story = {
    args: {
        maturingBalance: ethers.utils.parseEther('2.345'),
    },
    ...Template,
};

export const NoBalance: Story = {
    args: {
        maturingBalance: ethers.utils.parseEther('0'),
    },
    ...Template,
};
