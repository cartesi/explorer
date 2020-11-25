import { BigNumber } from 'ethers';

export type Summary = {
    id: string;
    totalUsers: number;
    totalNodes: number;
    totalStaked: BigNumber;
    totalBlocks: number;
    totalReward: BigNumber;
    totalChains: number;
};

export type User = {
    id: string;
    stakedBalance: BigNumber;
    totalBlocks: number;
    totalReward: BigNumber;
};

export type Node = {
    id: string;
    owner: User;
    timestamp: number;
    status: string;
    totalBlocks: number;
    totalReward: BigNumber;
};

export type Chain = {
    id: string;
    totalBlocks: number;
    totalReward: BigNumber;
    start: BigNumber;
    targetInterval: number;
};

export type Block = {
    id: string;
    chain: Chain;
    number: number;
    timestamp: number;
    producer: User;
    node: Node;
    reward: BigNumber;
    difficulty: BigNumber;
};
