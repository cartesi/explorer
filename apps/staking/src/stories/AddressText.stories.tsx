// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Text } from '@chakra-ui/react';
import { AddressText } from '@explorer/ui';

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

import data from './pools/poolsExtended.json';

export const Default = Template.bind({});
Default.args = {
    address: data.data.allStakingPools.nodes[0].id,
    chainId: 5,
};
