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

export default {
    title: 'Pools/Setting',
    component: PoolSetting,
    argTypes: {},
} as ComponentMeta<typeof PoolSetting>;

const Template: ComponentStory<typeof PoolSetting> = (args) => (
    <PoolSetting {...args} />
);

import { PoolSetting } from '../../pages/node/[node]/PoolSetting';

export const Default = Template.bind({});
Default.args = {};
