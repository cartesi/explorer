// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { GiPieChart } from 'react-icons/gi';
import CommissionText from '../components/CommissionText';
import { Text } from '@chakra-ui/react';

export default {
    title: 'Commission Text',
    component: CommissionText,
    argTypes: {},
} as ComponentMeta<typeof CommissionText>;

export const FlatRate = () => (
    <CommissionText
        value={{
            id: '',
            commission: 1250,
            gas: undefined,
            created: Date.now(),
            lastUpdated: Date.now(),
        }}
        icon={GiPieChart}
    >
        <Text>Commission</Text>
    </CommissionText>
);

export const GasBased = () => (
    <CommissionText
        value={{
            id: '',
            commission: undefined,
            gas: 240000,
            created: Date.now(),
            lastUpdated: Date.now(),
        }}
        icon={GiPieChart}
    >
        <Text>Commission</Text>
    </CommissionText>
);

export const Null = () => (
    <CommissionText value={undefined} icon={GiPieChart}>
        <Text>Commission</Text>
    </CommissionText>
);
