// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@chakra-ui/react';

import {
    ActiveNodeIcon,
    AllowanceIcon,
    ArrowsUpDownIcon,
    ChartIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CircleSupplyIcon,
    CloseIcon,
    CopyIcon,
    DashboardIcon,
    DelegateIcon,
    DisconnectIcon,
    EffectiveBalanceIcon,
    EmptyTransactionIcon,
    EyeIcon,
    FilterIcon,
    GridIcon,
    MarketCapICon,
    MyPoolsIcon,
    MyStakeIcon,
    PaginationIcon,
    PencilIcon,
    PencilIconWhite,
    PoolAllowenceIcon,
    PoolBalanceHexIcon,
    PoolBalanceIcon,
    PoolCommisionIcon,
    PoolPerformanceIcon,
    PoolProductionIntervalIcon,
    PoolUsersIcon,
    PoolsIcon,
    PoolsTimer,
    PrizeIcon,
    RebalanceIcon,
    SettingsIcon,
    SimpleChartIcon,
    StakeCircledIcon,
    StakeCircledOutlinedIcon,
    StakeIcon,
    StakePlusIcon,
    StakedBalanceIcon,
    SwitchIcon,
    TimeIcon,
    TimerIcon,
    TotalStakedIcon,
    ViewMoreIcon,
    WalletIcon,
} from '../components/Icons';

const Icons = () => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: '50px 50px 50px 50px 50px 50px',
            gridGap: 20,
        }}
    >
        <div title="DashboardIcon">
            <Icon as={DashboardIcon} width={10} height={10} />
        </div>

        <div title="DelegateIcon">
            <Icon as={DelegateIcon} width={10} height={10} />
        </div>

        <div title="PencilIcon">
            <Icon as={PencilIcon} width={10} height={10} />
        </div>

        <div title="PencilIconWhite">
            <Icon as={PencilIconWhite} width={10} height={10} />
        </div>

        <div title="CheckCircleIcon">
            <Icon as={CheckCircleIcon} width={10} height={10} />
        </div>

        <div title="PoolBalanceIcon">
            <Icon as={PoolBalanceIcon} width={10} height={10} />
        </div>

        <div title="PoolAllowenceIcon">
            <Icon as={PoolAllowenceIcon} width={10} height={10} />
        </div>

        <div title="AllowanceIcon">
            <Icon as={AllowanceIcon} width={10} height={10} />
        </div>

        <div title="WalletIcon">
            <Icon as={WalletIcon} width={10} height={10} />
        </div>

        <div title="TimerIcon">
            <Icon as={TimerIcon} width={10} height={10} />
        </div>

        <div title="TimeIcon">
            <Icon as={TimeIcon} width={10} height={10} />
        </div>

        <div title="StakeIcon">
            <Icon as={StakeIcon} width={10} height={10} />
        </div>

        <div title="StakedBalanceIcon">
            <Icon as={StakedBalanceIcon} width={10} height={10} />
        </div>

        <div title="EffectiveBalanceIcon">
            <Icon as={EffectiveBalanceIcon} width={10} height={10} />
        </div>

        <div title="PoolUsersIcon">
            <Icon as={PoolUsersIcon} width={10} height={10} />
        </div>

        <div title="PoolProductionIntervalIcon">
            <Icon as={PoolProductionIntervalIcon} width={10} height={10} />
        </div>

        <div title="DelegateIcon">
            <Icon as={DelegateIcon} width={10} height={10} />
        </div>

        <div title="PoolCommisionIcon">
            <Icon as={PoolCommisionIcon} width={10} height={10} />
        </div>

        <div title="DisconnectIcon">
            <Icon as={DisconnectIcon} width={10} height={10} />
        </div>

        <div title="SwitchIcon">
            <Icon as={SwitchIcon} width={10} height={10} />
        </div>

        <div title="PaginationIcon">
            <Icon as={PaginationIcon} width={10} height={10} />
        </div>

        <div title="ArrowsUpDownIcon">
            <Icon as={ArrowsUpDownIcon} width={10} height={10} />
        </div>

        <div title="ArrowsUpDownIcon">
            <Icon as={CopyIcon} width={10} height={10} />
        </div>

        <div title="PoolPerformanceIcon">
            <Icon as={PoolPerformanceIcon} width={10} height={10} />
        </div>

        <div title="EyeIcon">
            <Icon as={EyeIcon} width={10} height={10} />
        </div>

        <div title="FilterIcon">
            <Icon as={FilterIcon} width={10} height={10} />
        </div>

        <div title="CloseIcon">
            <Icon as={CloseIcon} width={10} height={10} />
        </div>

        <div title="ViewMoreIcon">
            <Icon as={ViewMoreIcon} width={10} height={10} />
        </div>

        <div title="PoolsTimer">
            <Icon as={PoolsTimer} width={10} height={10} />
        </div>

        <div title="StakePlusIcon">
            <Icon as={StakePlusIcon} width={10} height={10} />
        </div>

        <div title="StakeCircledIcon">
            <Icon as={StakeCircledIcon} width={10} height={10} />
        </div>

        <div title="ChartIcon">
            <Icon as={ChartIcon} width={10} height={10} />
        </div>

        <div title="MarketCapICon">
            <Icon as={MarketCapICon} width={10} height={10} />
        </div>

        <div title="CircleSupplyIcon">
            <Icon as={CircleSupplyIcon} width={10} height={10} />
        </div>

        <div title="ActiveNodeIcon">
            <Icon as={ActiveNodeIcon} width={10} height={10} />
        </div>

        <div title="PrizeIcon">
            <Icon as={PrizeIcon} width={10} height={10} />
        </div>

        <div title="GridIcon">
            <Icon as={GridIcon} width={10} height={10} />
        </div>

        <div title="TotalStakedIcon">
            <Icon as={TotalStakedIcon} width={10} height={10} />
        </div>

        <div title="ChevronRightIcon">
            <Icon as={ChevronRightIcon} width={10} height={10} />
        </div>

        <div title="ChevronLeftIcon">
            <Icon as={ChevronLeftIcon} width={10} height={10} />
        </div>

        <div title="StakeCircledOutlinedIcon">
            <Icon as={StakeCircledOutlinedIcon} width={10} height={10} />
        </div>

        <div title="PoolBalanceHexIcon">
            <Icon as={PoolBalanceHexIcon} width={10} height={10} />
        </div>

        <div title="EmptyTransactionIcon">
            <Icon
                as={EmptyTransactionIcon}
                width={10}
                height={10}
                fill="#F0F7F9"
                stroke="#008DA5"
            />
        </div>

        <div title="RebalanceIcon">
            <Icon as={RebalanceIcon} width={10} height={10} />
        </div>

        <div title="MyStakeIcon">
            <Icon as={MyStakeIcon} width={10} height={10} />
        </div>

        <div title="MyPoolsIcon">
            <Icon as={MyPoolsIcon} width={10} height={10} />
        </div>

        <div title="PoolsIcon">
            <Icon as={PoolsIcon} width={10} height={10} />
        </div>

        <div title="SimpleChartIcon">
            <Icon as={SimpleChartIcon} width={10} height={10} />
        </div>

        <div title="SettingsIcon">
            <Icon as={SettingsIcon} width={10} height={10} />
        </div>
    </div>
);

export default {
    title: 'Icons',
    component: Icons,
    argTypes: {},
} as Meta<typeof Icons>;

type Story = StoryObj<typeof Icons>;

const Template: Story = {
    render: () => <Icons />,
};

export const Default = {
    ...Template,
};
