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
import { PoolFilters } from '../../components/stake/PoolFilters';

const defaultFilters = [
    {
        title: 'Default filter',
        type: 'checkbox',
        key: '',
        options: [
            {
                value: 'Some value',
                default: true,
            },
        ],
    },
    {
        title: 'Second filter',
        type: 'radio',
        key: '',
        options: [
            {
                value: 'Some value',
                default: true,
            },
        ],
    },
    {
        title: 'Third filter',
        type: 'checkbox',
        key: '',
        options: [
            {
                value: 'Some value',
                default: true,
            },
        ],
    },
];

export default {
    title: 'Stake/PoolFilters',
    component: PoolFilters,
    argTypes: {},
} as ComponentMeta<typeof PoolFilters>;

const Template: ComponentStory<typeof PoolFilters> = (args) => (
    <PoolFilters {...args} />
);

export const Default = Template.bind({});
Default.args = {
    filters: defaultFilters,
    selectedPeriod: null,
    selectedTypes: [],
    onSelectedPeriodChange: () => undefined,
    onSelectedTypesChange: () => undefined,
};
