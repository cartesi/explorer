// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export type StakingPoolSort = 'totalUsers' | 'amount' | 'commissionPercentage';
export type StakingPoolSortExtended =
    | StakingPoolSort
    | 'weekPerformance'
    | 'monthPerformance';

export type UserSort =
    | 'stakedBalance'
    | 'maturingBalance'
    | 'maturingTimestamp'
    | 'releasingBalance'
    | 'releasingTimestamp'
    | 'balance'
    | 'totalReward'
    | 'totalBlocks';
export type PoolBalanceSort = 'shares' | 'released';
export type PoolShareValueSort = 'timestamp';
export type OrderDirection = 'desc' | 'asc';

interface Nodes<T> {
    nodes: T[];
}

export type Summary = {
    id: string;
    totalUsers: number;
    totalPools: number;
    totalStakers: number;
    totalNodes: number;
    totalStaked: string;
    totalBlocks: number;
    totalReward: string;
    totalProtocols: number;
    totalChains: number;
};

export interface SummaryData {
    summary: Summary;
}

export interface SummaryVars {
    id: string;
}

export type User = {
    id: string;
    stakedBalance: string;
    maturingBalance: string;
    maturingTimestamp: number;
    releasingBalance: string;
    releasingTimestamp: number;
    balance: string;
    totalBlocks: number;
    totalReward: string;
    pool?: StakingPool;
};

export interface UsersData {
    users: User[];
}

export interface UsersVars {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection: string;
}

type Performance = {
    id: string;
    performance: string;
    timestamp: number;
};

export type StakingPool = {
    id: string;
    manager: string;
    user: User;
    fee: StakingPoolFee;
    amount: string;
    shares: string;
    totalUsers: number;
    totalCommission: string;
    commissionPercentage: number;
    paused: boolean;
    timestamp: number;
    weeklyPerformance: Performance[];
    monthlyPerformance: Performance[];
};

export type StakingPoolFlat = {
    id: string;
    manager: string;
    amount: string;
    shares: string;
    totalUsers: number;
    totalCommission: string;
    commissionPercentage: number;
    paused: boolean;
    timestamp: number;
    feeId: string;
    feeCommission: number;
    feeGas: number;
    feeCreated: string;
    feeLastUpdated: string;
    userStakedBalance: string;
    userMaturingBalance: string;
    userMaturingTimestamp: string;
    userReleasingBalance: string;
    userReleasingTimestamp: string;
    userBalance: string;
    userTotalBlocks: number;
    userTotalReward: string;
    shareValue: number;
    weekShareValue: number;
    weekShareTimestamp: string;
    monthShareValue: number;
    monthShareTimestamp: string;
    performance: number;
    weekPerformance: number;
    monthPerformance: number;
};

export type StakingPoolFee = {
    id: string;
    commission: number;
    gas: number;
    created: number;
    lastUpdated: number;
};

export enum StakingPoolFeeType {
    GAS_TAX = 'GAS_TAX_COMMISSION',
    FLAT_RATE = 'FLAT_RATE_COMMISSION',
}

export type StakingPoolFeeHistory = {
    id: string;
    pool: StakingPool;
    newValue: number;
    change: number;
    timestamp: number;
    feeType: StakingPoolFeeType;
};

export interface StakingPoolData {
    stakingPool: StakingPool;
}

export interface PoolActivity {
    type: ActivityType;
    id: string;
    user: string;
    amount: string;
    timestamp: string;
}

export interface PoolActivitiesData {
    poolActivities: PoolActivity[];
}

export enum ActivityType {
    DEPOSIT = 'DEPOSIT',
    STAKE = 'STAKE',
    UNSTAKE = 'UNSTAKE',
    WITHDRAW = 'WITHDRAW',
}
export interface PoolActivityFilter {
    user?: string;
    pool?: string;
    timestamp_lt?: number;
    timestamp_gte?: number;
    timestamp_lte?: number;
    type?: ActivityType;
    type_in?: ActivityType[];
}
export interface PoolActivitiesVars {
    where: PoolActivityFilter;
    orderBy: string;
    orderDirection: 'desc' | 'asc';
    first: number;
}

export interface StakingPoolVars {
    id: string;
}

export interface StakingPoolsData {
    stakingPools: StakingPool[];
}

export interface StakingPoolsExtendedData {
    allStakingPools: Nodes<StakingPoolFlat>;
}

export interface StakingPoolsExtendedVars {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection?: OrderDirection;
}

type PerformanceSort = 'timestamp';

type PerformanceFilter = {
    timestamp_gte?: number;
    performance_not?: number;
};
export interface StakingPoolsVars {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection?: OrderDirection;
    firstWeeklyPerf: number;
    monthlyOrderBy: PerformanceSort;
    monthlyOrderDirection: OrderDirection;
    firstMonthlyPerf: number;
    weeklyOrderBy: PerformanceSort;
    weeklyOrderDirection: OrderDirection;
    whereWeekly: PerformanceFilter;
    whereMonthly: PerformanceFilter;
}

export type PoolUser = {
    id: string;
};

export type PoolBalance = {
    id: string;
    pool: StakingPool;
    user: PoolUser;
    shares: string;
    balance: string;
    stakeTimestamp: number;
};

export interface PoolBalanceWithAccumulatedShares extends PoolBalance {
    sharesPercent: number;
    accumulatedSharesPercent: number;
}

export type PoolBalancesData = {
    poolBalances: PoolBalance[];
};

export type PoolBalancesVars = {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection: string;
};

export type PoolShareValue = {
    id: string;
    pool?: StakingPool;
    timestamp: number;
    value: string;
};

export type PoolShareInfoExtended = {
    id: string;
    weekPerformance: number;
    monthPerformance: number;
    shareValue: number;
};

export type PoolShareInfoExtendedData = {
    allStakingPools: Nodes<PoolShareInfoExtended>;
};

export type PoolShareValuesData = {
    poolShareValues: PoolShareValue[];
};

export type PoolShareValuesVars = {
    first: number;
    where: any;
    orderBy: string;
    orderDirection: string;
};

export type Node = {
    id: string;
    owner: User;
    timestamp: number;
    retirementTimestamp: number;
    status: string;
    totalBlocks: number;
    totalReward: string;
};

export interface NodesData {
    nodes: Node[];
}

export interface NodesVars {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection: string;
}

export type Protocol = {
    id: string;
    version: number;
    address: string;
    timestamp: number;
    totalChains: number;
};

export type Chain = {
    id: string;
    protocol: Protocol;
    number: number;
    totalBlocks: number;
    totalReward: string;
    start: string;
    targetInterval: number;
};

export type Block = {
    id: string;
    chain: Chain;
    number: number;
    timestamp: number;
    producer: User;
    node: Node;
    reward: string;
    commission: string;
    difficulty: string;
    gasPrice: number;
    gasLimit: number;
};

export type _Block_ = {
    hash: string;
    number: number;
};

export type _Meta_ = {
    block: _Block_;
    deployment: string;
    hasIndexingErrors: boolean;
};

export interface BlocksData {
    blocks: Block[];
}

export interface BlocksWhere {
    producer?: string;
    node?: string;
}

export interface BlocksVars {
    where: BlocksWhere;
    count: number;
    skip: number;
}

export interface BlockData {
    block: Block;
}

export interface BlockVars {
    id: string;
}

export interface UserData {
    user: User;
}

export interface UserVars {
    id: string;
}

export interface MetaData {
    _meta: _Meta_;
}

export enum StakingPoolUserHistoryAction {
    JOIN = 'JOIN',
    LEAVE = 'LEAVE',
}

export interface StakingPoolUserHistory {
    id: string;
    timestamp: number;
    pool?: StakingPool;
    user: PoolUser;
    totalUsers: number;
    action: StakingPoolUserHistoryAction;
}

// ENS definitions
type ResolvedAddress = {
    id: string;
};

export type Domain = {
    id: string;
    name: string;
    labelName: string;
    createdAt: number;
    resolvedAddress: ResolvedAddress;
};
