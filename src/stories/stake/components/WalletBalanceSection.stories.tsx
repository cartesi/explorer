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
import { WalletBalanceSection } from '../../../components/stake/components/WalletBalanceSection';
import { WalletConnectionContext } from '../../../components/wallet';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/WalletBalanceSection',
    component: WalletBalanceSection,
    argTypes: {},
} as Meta<typeof WalletBalanceSection>;

type Story = StoryObj<typeof WalletBalanceSection>;

const Template: Story = {
    render: (args) => <WalletBalanceSection {...args} />,
};

export const Default: Story = {
    args: {
        userCTSIBalance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(defaultValue),
    },
    ...Template,
};

export const ZeroETHBalance: Story = {
    args: {
        userCTSIBalance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(0),
    },
    ...Template,
};

export const ZeroETHBalanceWhenUsingGnosisSafe: Story = {
    args: {
        userCTSIBalance: BigNumber.from(defaultValue),
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
    ...Template,
};
