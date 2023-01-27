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
import { UnsupportedNetworkError } from '@explorer/wallet';
import { ConnectWallet } from '../../components';

const defaultWallet = {
    active: false,
    activate: () => Promise.resolve(),
    deactivate: () => Promise.resolve(),
};

export default {
    title: 'Header/ConnectWallet',
    component: ConnectWallet,
    argTypes: {},
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = (args) => (
    <ConnectWallet {...args} />
);

export const ConnectToWallet = Template.bind({});
ConnectToWallet.args = {
    wallet: defaultWallet,
};

export const UnsupportedNetwork = Template.bind({});
UnsupportedNetwork.args = {
    wallet: {
        ...defaultWallet,
        error: new UnsupportedNetworkError(1),
    },
};
