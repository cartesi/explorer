// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export type StakingPoolSort = 'totalUsers' | 'amount' | 'totalCommission';
export type UserSort = 'stakedBalance' | 'totalReward' | 'totalBlocks';
export type PoolBalanceSort = 'shares' | 'released';

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

export type StakingPool = {
    id: string;
    manager: string;
    user: User;
    fee: StakingPoolFee;
    amount: string;
    shares: string;
    totalUsers: number;
    totalCommission: string;
    paused: boolean;
    timestamp: number;
};

export type StakingPoolFee = {
    id: string;
    commission: number;
    gas: number;
    created: number;
    lastUpdated: number;
};

export interface StakingPoolData {
    stakingPool: StakingPool;
}

export interface StakingPoolVars {
    id: string;
}

export interface StakingPoolsData {
    stakingPools: StakingPool[];
}

export interface StakingPoolsVars {
    first: number;
    skip: number;
    where: any;
    orderBy: string;
    orderDirection: string;
}

export type PoolUser = {
    id: string;
};

export type PoolBalance = {
    id: string;
    pool: StakingPool;
    user: PoolUser;
    shares: number;
    released: number;
    unstakeTimestamp: number;
};

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

export type Node = {
    id: string;
    owner: User;
    timestamp: number;
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

export interface BlocksVars {
    where: any;
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
