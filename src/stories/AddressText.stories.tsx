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

import AddressText from '../components/AddressText';
import { Text } from '@chakra-ui/react';

export default {
    title: 'Address Text',
    component: AddressText,
    argTypes: {},
} as ComponentMeta<typeof AddressText>;

const Template: ComponentStory<typeof AddressText> = (args) => (
    <AddressText {...args}>
        <Text>Staking Pool</Text>
    </AddressText>
);

import data from './pools/pools.json';

export const Default = Template.bind({});
Default.args = {
    address: data.data.allStakingPools.nodes[0].id,
    chainId: 5,
};
