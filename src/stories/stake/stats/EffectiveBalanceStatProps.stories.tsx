// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import EffectiveBalanceStat from '../../../components/stake/stats/EffectiveBalanceStat';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Stats/EffectiveBalanceStat',
    component: EffectiveBalanceStat,
    argTypes: {},
} as Meta<typeof EffectiveBalanceStat>;

type Story = StoryObj<typeof EffectiveBalanceStat>;

const Template: Story = {
    render: (args) => <EffectiveBalanceStat {...args} />,
};

export const Default: Story = {
    args: {
        stake: BigNumber.from(defaultValue),
        unstake: BigNumber.from(defaultValue),
        withdraw: BigNumber.from(defaultValue),
        stakingMature: BigNumber.from(defaultValue),
        stakingMaturing: BigNumber.from(defaultValue),
        stakingReleasing: BigNumber.from(defaultValue),
        stakingReleased: BigNumber.from(defaultValue),
        stakingMaturingTimestamp: new Date(),
        stakingReleasingTimestamp: new Date(),
        onRebalance: () => undefined,
    },
    ...Template,
};

export const NeedRebalance: Story = {
    args: {
        ...Default.args,
        stake: BigNumber.from(0),
        unstake: BigNumber.from(0),
        withdraw: BigNumber.from(0),
    },
    ...Template,
};
