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
import { StakingStakeModal } from '../../../components/stake/modals/StakingStakeModal';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

export default {
    title: 'Stake/Modals/StakingStakeModal',
    component: StakingStakeModal,
    argTypes: {},
} as ComponentMeta<typeof StakingStakeModal>;

const Template: ComponentStory<typeof StakingStakeModal> = (args) => (
    <StakingStakeModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
    balance: BigNumber.from(defaultValue),
    userBalance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => undefined,
    },
    isOpen: true,
    onClose: () => undefined,
    onSave: () => undefined,
};
