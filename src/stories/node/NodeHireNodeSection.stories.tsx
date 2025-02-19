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

import { NodeHireNodeSection } from '../../components/node/NodeHireNodeSection';

export default {
    title: 'Node/NodeHireNodeSection',
    component: NodeHireNodeSection,
    argTypes: {},
} as ComponentMeta<typeof NodeHireNodeSection>;

const Template: ComponentStory<typeof NodeHireNodeSection> = (args) => (
    <NodeHireNodeSection {...args} />
);

export const Basic = Template.bind({});
