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
import TotalBalances from '../../components/staking/TotalBalances';

export default {
    title: 'Staking/TotalBalances',
    component: TotalBalances,
    argTypes: {},
} as ComponentMeta<typeof TotalBalances>;

const Template: ComponentStory<typeof TotalBalances> = (args) => (
    <TotalBalances {...args} />
);

const props = {
    user: { totalReward: 1000 },
    totalBalance: '100000000000000000000000',
};

export const Default = Template.bind({});
Default.args = {
    ...props,
};
