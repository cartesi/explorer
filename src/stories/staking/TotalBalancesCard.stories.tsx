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
import TotalBalancesCard from '../../components/staking/TotalBalancesCard';

export default {
    title: 'Staking/TotalBalancesCard',
    component: TotalBalancesCard,
    argTypes: {},
} as ComponentMeta<typeof TotalBalancesCard>;

const Template: ComponentStory<typeof TotalBalancesCard> = (args) => (
    <TotalBalancesCard {...args} />
);

const props = {
    title: 'Total Rewards',
    tooltip: 'Lorem ipsum dolor sit amet',
    balance: '100000000000000000000000',
};

export const Default = Template.bind({});
Default.args = {
    ...props,
};

export const InContractBalance = Template.bind({});
InContractBalance.args = {
    ...props,
    title: 'In-contract Balance',
    tooltip:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    balance: 0,
};
