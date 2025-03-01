// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Account } from '../../components/header/Account';
import { WalletConnectionContext } from '../../components/wallet';

export default {
    title: 'Header/Account',
    component: Account,
    argTypes: {},
} as ComponentMeta<typeof Account>;

const initialContextState = {
    active: true,
    activate: async () => Promise.resolve(),
    deactivate: () => Promise.resolve(),
    account: '0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D',
    chainId: 1,
};

const Template: ComponentStory<typeof Account> = (args) => (
    <WalletConnectionContext.Provider value={initialContextState}>
        <Account {...args} />
    </WalletConnectionContext.Provider>
);

export const Default = Template.bind({});
Default.args = {
    onApprove: () => undefined,
};
