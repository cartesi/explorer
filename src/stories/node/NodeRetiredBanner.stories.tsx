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

import { NodeRetiredBanner } from '../../components/node/NodeRetiredBanner';

export default {
    title: 'Node/NodeRetiredBanner',
    component: NodeRetiredBanner,
    argTypes: {},
} as Meta<typeof NodeRetiredBanner>;

type Story = StoryObj<typeof NodeRetiredBanner>;

const Template: Story = {
    render: (args) => <NodeRetiredBanner {...args} />,
};

export const Basic: Story = {
    ...Template,
};
