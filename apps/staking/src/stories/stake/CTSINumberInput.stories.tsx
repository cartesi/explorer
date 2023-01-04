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
import { CTSINumberInput } from '../../components/stake/CTSINumberInput';

export default {
    title: 'Stake/CTSINumberInput',
    component: CTSINumberInput,
    argTypes: {},
} as ComponentMeta<typeof CTSINumberInput>;

const Template: ComponentStory<typeof CTSINumberInput> = (args) => (
    <CTSINumberInput {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithValue = Template.bind({});
WithValue.args = {
    ...Default.args,
    value: 1000,
};

export const WithMinValue = Template.bind({});
WithMinValue.args = {
    ...Default.args,
    value: 1000,
    min: 1000,
};

export const WithMaxValue = Template.bind({});
WithMaxValue.args = {
    ...Default.args,
    value: 1000,
    max: 1000,
};

export const WithMaxPrecision = Template.bind({});
WithMaxPrecision.args = {
    ...Default.args,
    value: 1000.55,
    maxPrecision: 2,
};
