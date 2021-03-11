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
    user: User;
    commission: number;
    totalUsers: number;
    timestamp: number;
};

export interface StakingPoolsData {
    pools: StakingPool[];
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
    stakedBalance: number;
    totalStaked: number;
    totalUnstaked: number;
    totalWithdraw: number;
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
