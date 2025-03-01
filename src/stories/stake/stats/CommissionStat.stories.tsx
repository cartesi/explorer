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
import CommissionStat from '../../../components/stake/stats/CommissionStat';

const defaultCommissionPercentage = 50;
const defaultFee = {
    id: 1,
    commission: 25,
    gas: 20,
    created: 1657193076608,
    lastUpdated: 1657193076608,
};
const defaultLocation = 'us';

export default {
    title: 'Stake/Stats/CommissionStat',
    component: CommissionStat,
    argTypes: {},
} as ComponentMeta<typeof CommissionStat>;

const Template: ComponentStory<typeof CommissionStat> = (args) => (
    <CommissionStat {...args} />
);

export const Default = Template.bind({});
Default.args = {
    commissionPercentage: defaultCommissionPercentage,
    fee: defaultFee,
    location: defaultLocation,
};

export const ZeroCommissionPercentage = Template.bind({});
ZeroCommissionPercentage.args = {
    ...Default.args,
    commissionPercentage: 0,
};
