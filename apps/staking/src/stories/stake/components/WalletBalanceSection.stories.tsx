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
import { WalletBalanceSection } from '../../../components/stake/components/WalletBalanceSection';
import { BigNumber } from 'ethers';
import { WalletConnectionContext } from '@explorer/wallet';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/WalletBalanceSection',
    component: WalletBalanceSection,
    argTypes: {},
} as ComponentMeta<typeof WalletBalanceSection>;

const Template: ComponentStory<typeof WalletBalanceSection> = (args) => (
    <WalletBalanceSection {...args} />
);

export const Default = Template.bind({});
Default.args = {
    userCTSIBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(defaultValue),
};

export const ZeroETHBalance = Template.bind({});
ZeroETHBalance.args = {
    userCTSIBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(0),
};

export const ZeroETHBalanceWhenUsingGnosisSafe = Template.bind({});
ZeroETHBalanceWhenUsingGnosisSafe.args = {
    userCTSIBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(0),
};
ZeroETHBalanceWhenUsingGnosisSafe.decorators = [
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
];
