// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Text } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { parseUnits } from 'ethers/lib/utils';
import {
    TbHistory,
    TbCoins,
    TbWallet,
    TbPercentage,
    TbUser,
    TbTagFilled,
    TbClock,
} from 'react-icons/tb';
import BigNumberText from '../components/BigNumberText';

export default {
    title: 'BigNumber Text',
    component: BigNumberText,
    argTypes: {},
} as Meta<typeof BigNumberText>;

export const Number = () => (
    <BigNumberText value={13} icon={TbUser}>
        <Text>Users</Text>
    </BigNumberText>
);

export const Zero = () => (
    <BigNumberText value={0} icon={TbUser}>
        <Text>Users</Text>
    </BigNumberText>
);

export const Percentage = () => (
    <BigNumberText value={0.34} icon={TbPercentage} unit="percent">
        <Text>Commission</Text>
    </BigNumberText>
);

export const CTSI = () => (
    <BigNumberText value={parseUnits('10000', 18)} icon={TbCoins} unit="ctsi">
        <Text>Staked Balance</Text>
    </BigNumberText>
);

export const Ether = () => (
    <BigNumberText
        value={parseUnits('43.96328', 18)}
        icon={TbWallet}
        unit="eth"
    >
        <Text>Wallet Balance</Text>
    </BigNumberText>
);

export const Price = () => (
    <BigNumberText
        value={0.4396328}
        icon={TbTagFilled}
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
        icon={TbClock}
        unit="duration"
    >
        <Text>Production Rate</Text>
    </BigNumberText>
);

export const ShortDuration = () => (
    <BigNumberText
        value={1000 * 60 * 27 + 25000} // 27 minutes
        icon={TbClock}
        unit="duration"
    >
        <Text>Production Rate</Text>
    </BigNumberText>
);
export const WithCountdownMaturing = () => (
    <BigNumberText
        value={parseUnits('10000', 18)}
        icon={TbHistory}
        unit="ctsi"
        countdown={{
            timeLeft: '36 minutes, 55 seconds',
            timeLabel: 'Maturing in ',
        }}
    >
        <Text>Maturing Balance</Text>
    </BigNumberText>
);
export const WithCountdownReleasing = () => (
    <BigNumberText
        value={parseUnits('10000', 18)}
        icon={TbHistory}
        unit="ctsi"
        countdown={{
            timeLeft: '16 hours, 55 minutes',
            timeLabel: 'Releasing in ',
        }}
    >
        <Text>Releasing Balance</Text>
    </BigNumberText>
);
