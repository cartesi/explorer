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

import {
    DashboardIcon,
    DelegateIcon,
    PencilIcon,
    PencilIconWhite,
    CheckCircleIcon,
    PoolBalanceIcon,
    PoolAllowenceIcon,
    AllowanceIcon,
    WalletIcon,
    TimerIcon,
    TimeIcon,
    StakeIcon,
    StakedBalanceIcon,
    EffectiveBalanceIcon,
    PoolUsersIcon,
    PoolProductionIntervalIcon,
    PoolCommisionIcon,
    DisconnectIcon,
    SwitchIcon,
    PaginationIcon,
    ArrowsUpDownIcon,
    CopyIcon,
    PoolPerformanceIcon,
    EyeIcon,
    FilterIcon,
    CloseIcon,
    ViewMoreIcon,
    PoolsTimer,
    StakePlusIcon,
    StakeCircledIcon,
    ChartIcon,
    MarketCapICon,
    CircleSupplyIcon,
    ActiveNodeIcon,
    PrizeIcon,
    GridIcon,
    TotalStakedIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    StakeCircledOutlinedIcon,
    PoolBalanceHexIcon,
    EmptyTransactionIcon,
    RebalanceIcon,
    MyStakeIcon,
    MyPoolsIcon,
    PoolsIcon,
    SimpleChartIcon,
    SettingsIcon,
} from '../components';

const Icons = () => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: '50px 50px 50px 50px 50px 50px',
            gridGap: 20,
        }}
    >
        <div title="DashboardIcon">
            <DashboardIcon width={10} height={10} />
        </div>

        <div title="DelegateIcon">
            <DelegateIcon width={10} height={10} />
        </div>

        <div title="PencilIcon">
            <PencilIcon width={10} height={10} />
        </div>

        <div title="PencilIconWhite">
            <PencilIconWhite width={10} height={10} />
        </div>

        <div title="CheckCircleIcon">
            <CheckCircleIcon width={10} height={10} />
        </div>

        <div title="PoolBalanceIcon">
            <PoolBalanceIcon width={10} height={10} />
        </div>

        <div title="PoolAllowenceIcon">
            <PoolAllowenceIcon width={10} height={10} />
        </div>

        <div title="AllowanceIcon">
            <AllowanceIcon width={10} height={10} />
        </div>

        <div title="WalletIcon">
            <WalletIcon width={10} height={10} />
        </div>

        <div title="TimerIcon">
            <TimerIcon width={10} height={10} />
        </div>

        <div title="TimeIcon">
            <TimeIcon width={10} height={10} />
        </div>

        <div title="StakeIcon">
            <StakeIcon width={10} height={10} />
        </div>

        <div title="StakedBalanceIcon">
            <StakedBalanceIcon width={10} height={10} />
        </div>

        <div title="EffectiveBalanceIcon">
            <EffectiveBalanceIcon width={10} height={10} />
        </div>

        <div title="PoolUsersIcon">
            <PoolUsersIcon width={10} height={10} />
        </div>

        <div title="PoolProductionIntervalIcon">
            <PoolProductionIntervalIcon width={10} height={10} />
        </div>

        <div title="DelegateIcon">
            <DelegateIcon width={10} height={10} />
        </div>

        <div title="PoolCommisionIcon">
            <PoolCommisionIcon width={10} height={10} />
        </div>

        <div title="DisconnectIcon">
            <DisconnectIcon width={10} height={10} />
        </div>

        <div title="SwitchIcon">
            <SwitchIcon width={10} height={10} />
        </div>

        <div title="PaginationIcon">
            <PaginationIcon width={10} height={10} />
        </div>

        <div title="ArrowsUpDownIcon">
            <ArrowsUpDownIcon width={10} height={10} />
        </div>

        <div title="ArrowsUpDownIcon">
            <CopyIcon width={10} height={10} />
        </div>

        <div title="PoolPerformanceIcon">
            <PoolPerformanceIcon width={10} height={10} />
        </div>

        <div title="EyeIcon">
            <EyeIcon width={10} height={10} />
        </div>

        <div title="FilterIcon">
            <FilterIcon width={10} height={10} />
        </div>

        <div title="CloseIcon">
            <CloseIcon width={10} height={10} />
        </div>

        <div title="ViewMoreIcon">
            <ViewMoreIcon width={10} height={10} />
        </div>

        <div title="PoolsTimer">
            <PoolsTimer width={10} height={10} />
        </div>

        <div title="StakePlusIcon">
            <StakePlusIcon width={10} height={10} />
        </div>

        <div title="StakeCircledIcon">
            <StakeCircledIcon width={10} height={10} />
        </div>

        <div title="ChartIcon">
            <ChartIcon width={10} height={10} />
        </div>

        <div title="MarketCapICon">
            <MarketCapICon width={10} height={10} />
        </div>

        <div title="CircleSupplyIcon">
            <CircleSupplyIcon width={10} height={10} />
        </div>

        <div title="ActiveNodeIcon">
            <ActiveNodeIcon width={10} height={10} />
        </div>

        <div title="PrizeIcon">
            <PrizeIcon width={10} height={10} />
        </div>

        <div title="GridIcon">
            <GridIcon width={10} height={10} />
        </div>

        <div title="TotalStakedIcon">
            <TotalStakedIcon width={10} height={10} />
        </div>

        <div title="ChevronRightIcon">
            <ChevronRightIcon width={10} height={10} />
        </div>

        <div title="ChevronLeftIcon">
            <ChevronLeftIcon width={10} height={10} />
        </div>

        <div title="StakeCircledOutlinedIcon">
            <StakeCircledOutlinedIcon width={10} height={10} />
        </div>

        <div title="PoolBalanceHexIcon">
            <PoolBalanceHexIcon width={10} height={10} />
        </div>

        <div title="EmptyTransactionIcon">
            <EmptyTransactionIcon width={10} height={10} />
        </div>

        <div title="RebalanceIcon">
            <RebalanceIcon width={10} height={10} />
        </div>

        <div title="MyStakeIcon">
            <MyStakeIcon width={10} height={10} />
        </div>

        <div title="MyPoolsIcon">
            <MyPoolsIcon width={10} height={10} />
        </div>

        <div title="PoolsIcon">
            <PoolsIcon width={10} height={10} />
        </div>

        <div title="SimpleChartIcon">
            <SimpleChartIcon width={10} height={10} />
        </div>

        <div title="SettingsIcon">
            <SettingsIcon width={10} height={10} />
        </div>
    </div>
);

export default {
    title: 'Icons',
    component: Icons,
    argTypes: {},
} as ComponentMeta<typeof Icons>;

const Template: ComponentStory<typeof Icons> = (args: object) => (
    <Icons {...args} />
);

export const Default = Template.bind({});
Default.args = {};
