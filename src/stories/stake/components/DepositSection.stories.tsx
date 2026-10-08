// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DepositSection } from '../../../components/stake/components/DepositSection';
import { WalletConnectionContext } from '../../../components/wallet';

const defaultValue = 10000000000000000000000000000n;

export default {
    title: 'Stake/Components/DepositSection',
    component: DepositSection,
    argTypes: {},
} as Meta<typeof DepositSection>;

type Story = StoryObj<typeof DepositSection>;

const Template: Story = {
    render: (args) => <DepositSection {...args} />,
};

export const Default: Story = {
    args: {
        userWalletBalance: defaultValue,
        userETHBalance: defaultValue,
        onDepositClick: () => undefined,
    },
    ...Template,
};

export const ZeroUserWalletBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: 0n,
        userETHBalance: defaultValue,
    },
    ...Template,
};

export const ZeroUserETHBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: defaultValue,
        userETHBalance: 0n,
    },
    ...Template,
};

export const ZeroUserWalletBalanceAndZeroUserETHBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: 0n,
        userETHBalance: 0n,
    },
    ...Template,
};

export const ZeroUserEthBalanceAndUsingGnosisSafe: Story = {
    args: {
        ...Default.args,
        userWalletBalance: defaultValue,
        userETHBalance: 0n,
    },
    decorators: [
        (Story) => (
            <WalletConnectionContext.Provider
                value={{
                    active: true,
                    activate: () => null,
                    deactivate: () => null,
                    isGnosisSafe: true,
                }}
            >
                <Story />
            </WalletConnectionContext.Provider>
        ),
    ],
};
