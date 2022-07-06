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
import { AllowanceSection } from '../../../components/stake/components/AllowanceSection';
import { BigNumber } from 'ethers';

const defaultAllowance = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/AllowanceSection',
    component: AllowanceSection,
    argTypes: {},
} as ComponentMeta<typeof AllowanceSection>;

const Template: ComponentStory<typeof AllowanceSection> = (args) => (
    <AllowanceSection {...args} />
);

export const Default = Template.bind({});
Default.args = {
    allowance: defaultAllowance,
    onAllowanceClick: () => {
        console.log('onAllowanceClick::');
    },
};

export const ZeroAllowance = Template.bind({});
ZeroAllowance.args = {
    allowance: BigNumber.from(0),
};
