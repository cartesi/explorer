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
import { StakingDepositModal } from '../../../components/stake/modals/StakingDepositModal';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

export default {
    title: 'Stake/Modals/StakingDepositModal',
    component: StakingDepositModal,
    argTypes: {},
} as ComponentMeta<typeof StakingDepositModal>;

const Template: ComponentStory<typeof StakingDepositModal> = (args) => (
    <StakingDepositModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
    allowance: BigNumber.from(defaultValue),
    balance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => {
            console.log('disclosure::onClose::');
        },
    },
    isOpen: true,
    onClose: () => {
        console.log('onClose::');
    },
    onSave: () => {
        console.log('onSave::');
    },
};

export const ZeroAllowance = Template.bind({});
ZeroAllowance.args = {
    ...Default.args,
    allowance: BigNumber.from(0),
};
