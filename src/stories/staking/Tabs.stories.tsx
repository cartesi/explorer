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
import Tabs from '../../components/staking/Tabs';

export default {
    title: 'Staking/Tabs',
    component: Tabs,
    argTypes: {},
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

const props = {
    Stake: <p>This is the Stake slot.</p>,
    Unstake: <p>This is the Unstake slot.</p>,
};

export const Default = Template.bind({});
Default.args = {
    ...props,
};
