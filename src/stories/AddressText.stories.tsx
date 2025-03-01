// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Text } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import AddressText from '../components/AddressText';
import data from './mock/poolsExtended.json';

export default {
    title: 'Address Text',
    component: AddressText,
    argTypes: {},
} as Meta<typeof AddressText>;

type Story = StoryObj<typeof AddressText>;

const Template: Story = {
    render: (args) => (
        <AddressText {...args}>
            <Text>Staking Pool</Text>
        </AddressText>
    ),
};

export const Default: Story = {
    args: {
        address: data.data.allStakingPools.nodes[0].id,
        chainId: 5,
        color: 'black',
    },
    ...Template,
};
