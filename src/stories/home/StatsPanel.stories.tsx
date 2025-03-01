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

import StatsPanelComponent from '../../components/home/StatsPanel';
import { Nodes, TotalStaked, APR, ParticipationRate } from '../Stats.stories';
import Stats from '../../components/Stats';

export default {
    title: 'Home/Stats Panel',
    component: StatsPanelComponent,
    argTypes: {},
} as Meta<typeof StatsPanelComponent>;

type Story = StoryObj<typeof StatsPanelComponent>;

export const StatsPanel: Story = {
    render: (args) => (
        <StatsPanelComponent {...args}>
            <Stats {...Nodes.args} label="Stats" />
            <Stats {...TotalStaked.args} label="Total Staked" />
            <Stats {...APR.args} label="APR" />
            <Stats {...ParticipationRate.args} label="Participation Rate" />
        </StatsPanelComponent>
    ),
};
