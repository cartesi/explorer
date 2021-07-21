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
import { Divider } from '@chakra-ui/react';

import StatsPanelComponent from '../../components/home/StatsPanel';
import { Nodes, TotalStaked, APR, ParticipationRate } from '../Stats.stories';

export default {
    title: 'Home/Stats Panel',
    component: StatsPanelComponent,
    argTypes: {},
} as ComponentMeta<typeof StatsPanelComponent>;

export const StatsPanel: ComponentStory<typeof StatsPanelComponent> = (
    args
) => (
    <StatsPanelComponent {...args}>
        <Nodes {...Nodes.args} />
        <Divider orientation="vertical" />
        <TotalStaked {...TotalStaked.args} />
        <Divider orientation="vertical" />
        <APR {...APR.args} />
        <Divider orientation="vertical" />
        <ParticipationRate {...ParticipationRate.args} />
    </StatsPanelComponent>
);
