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
import { FaCoins, FaWallet } from 'react-icons/fa';

import CTSIText from '../components/CTSIText';
import { Text } from '@chakra-ui/react';

export default {
    title: 'CTSI Text',
    component: CTSIText,
    argTypes: {},
} as ComponentMeta<typeof CTSIText>;

const Template: ComponentStory<typeof CTSIText> = (args) => (
    <CTSIText value="5000100000000000000000000" {...args}>
        <Text>Wallet Balance</Text>
    </CTSIText>
);

export const Vertical = Template.bind({});
Vertical.args = {};

export const WithIcon = Template.bind({});
WithIcon.args = {
    label: 'Staked Balance',
    icon: FaCoins,
};

export const Horizontal = Template.bind({});
Horizontal.args = {
    icon: FaWallet,
    direction: 'row',
};

export const FractionalAmount = Template.bind({});
FractionalAmount.args = {
    value: '1000000000000000',
};
