// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';
import { DepositSection } from '../../../components/stake/components/DepositSection';
import { WalletConnectionContext } from '../../../components/wallet';

const defaultValue = BigNumber.from('10000000000000000000000000000');

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
        userWalletBalance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(defaultValue),
        onDepositClick: () => undefined,
    },
    ...Template,
};

export const ZeroUserWalletBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: BigNumber.from(0),
        userETHBalance: BigNumber.from(defaultValue),
    },
    ...Template,
};

export const ZeroUserETHBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(0),
    },
    ...Template,
};

export const ZeroUserWalletBalanceAndZeroUserETHBalance: Story = {
    args: {
        ...Default.args,
        userWalletBalance: BigNumber.from(0),
        userETHBalance: BigNumber.from(0),
    },
    ...Template,
};

export const ZeroUserEthBalanceAndUsingGnosisSafe: Story = {
    args: {
        ...Default.args,
        userWalletBalance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(0),
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
