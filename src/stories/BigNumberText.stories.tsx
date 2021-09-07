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
import { FaCoins, FaPercentage, FaUsers, FaWallet } from 'react-icons/fa';
import { ImClock, ImPriceTag } from 'react-icons/im';
import BigNumberText from '../components/BigNumberText';
import { Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

export default {
    title: 'BigNumber Text',
    component: BigNumberText,
    argTypes: {},
} as ComponentMeta<typeof BigNumberText>;

export const Number = () => (
    <BigNumberText value={13} icon={FaUsers}>
        <Text>Users</Text>
    </BigNumberText>
);

export const Zero = () => (
    <BigNumberText value={0} icon={FaUsers}>
        <Text>Users</Text>
    </BigNumberText>
);

export const Percentage = () => (
    <BigNumberText value={0.34} icon={FaPercentage} unit="percent">
        <Text>Commission</Text>
    </BigNumberText>
);

export const CTSI = () => (
    <BigNumberText
        value={ethers.utils.parseUnits('10000', 18)}
        icon={FaCoins}
        unit="ctsi"
    >
        <Text>Staked Balance</Text>
    </BigNumberText>
);

export const Ether = () => (
    <BigNumberText
        value={ethers.utils.parseUnits('43.96328', 18)}
        icon={FaWallet}
        unit="eth"
    >
        <Text>Wallet Balance</Text>
    </BigNumberText>
);

export const Price = () => (
    <BigNumberText
        value={0.4396328}
        icon={ImPriceTag}
        unit="usd"
        options={{
            maximumFractionDigits: 2,
        }}
    >
        <Text>Price</Text>
    </BigNumberText>
);

export const LongDuration = () => (
    <BigNumberText
        value={1000 * 60 * 60 * 24 * 3} // 3 days
        icon={ImClock}
        unit="duration"
    >
        <Text>Production Rate</Text>
    </BigNumberText>
);

export const ShortDuration = () => (
    <BigNumberText
        value={1000 * 60 * 27 + 25000} // 27 minutes
        icon={ImClock}
        unit="duration"
    >
        <Text>Production Rate</Text>
    </BigNumberText>
);
