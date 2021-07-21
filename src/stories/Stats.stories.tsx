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

import Stats from '../components/Stats';

export default {
    title: 'Stats',
    component: Stats,
    argTypes: {},
} as ComponentMeta<typeof Stats>;

const Template: ComponentStory<typeof Stats> = (args) => <Stats {...args} />;

export const Nodes = Template.bind({});
Nodes.args = {
    label: '# Active Nodes',
    value: 274,
};

export const TotalStaked = Template.bind({});
TotalStaked.args = {
    label: 'TotalStaked',
    value: 86283342,
    fractionDigits: 2,
    help: 'Total amount of CTSI locked in the staking contract, currently  in the status "staked"',
};

export const APR = Template.bind({});
APR.args = {
    label: 'Projected Annual Earnings',
    value: 0.616329,
    unit: 'percent',
    fractionDigits: 1,
};

export const ParticipationRate = Template.bind({});
ParticipationRate.args = {
    label: 'Participation Rate',
    value: 0.2277428,
    unit: 'percent',
    fractionDigits: 1,
};

export const NoValue = Template.bind({});
NoValue.args = {
    label: 'Participation Rate',
    value: undefined,
};
