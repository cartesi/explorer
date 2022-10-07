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

import Address from '../components/Address';
import { StakePlusIcon } from '../components/Icons';

export default {
    title: 'Address',
    component: Address,
    argTypes: {},
} as ComponentMeta<typeof Address>;

const Template: ComponentStory<typeof Address> = (args) => (
    <Address {...args} address="0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D" />
);

export const Basic = Template.bind({});
Basic.args = {};

export const Truncated = Template.bind({});
Truncated.args = { truncated: true };

export const HiddenActions = Template.bind({});
HiddenActions.args = { hideActions: true };

export const Responsive = Template.bind({});
Responsive.args = { responsive: true };

export const TokenLink = Template.bind({});
TokenLink.args = { type: 'token' };

export const Goerli = Template.bind({});
Goerli.args = { chainId: 5 };

export const WithName = Template.bind({});
WithName.args = { name: 'Pool Factory' };

export const WithCustomFallbackAvatar = Template.bind({});
WithCustomFallbackAvatar.args = {
    shouldDisplayFallbackAvatar: true,
    fallbackAvatar: StakePlusIcon,
};
