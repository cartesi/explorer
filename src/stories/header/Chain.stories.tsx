// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import Chain from '../../components/header/Chain';

export default {
    title: 'Header/Chain',
    component: Chain,
    argTypes: {},
} as ComponentMeta<typeof Chain>;

const Template: ComponentStory<typeof Chain> = (args) => <Chain {...args} />;

export const Mainnet = Template.bind({});
Mainnet.args = { chainId: 1 };

export const ExplicitMainnet = Template.bind({});
ExplicitMainnet.args = { chainId: 1, showMainnet: true };

export const Sepolia = Template.bind({});
Sepolia.args = { chainId: 11155111 };

export const Localhost = Template.bind({});
Localhost.args = { chainId: 31337 };

export const Disconnected = Template.bind({});
Disconnected.args = {};
