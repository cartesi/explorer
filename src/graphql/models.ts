import { BigNumber } from 'ethers';

export type Summary = {
    id: string;
    totalStakers: number;
    totalWorkers: number;
    totalStaked: BigNumber;
    totalTickets: number;
};

export type Staker = {
    id: string;
    stakedBalance: BigNumber;
    maturingBalance: BigNumber;
    maturation: number;
    totalTickets: number;
};

export type Worker = {
    id: string;
    owner: Staker;
    timestamp: number;
    status: string;
    totalTickets: number;
    totalReward: BigNumber;
};

export type LotteryTicket = {
    id: string;
    round: number;
    winner: string;
    worker: Worker;

    difficulty: BigNumber;
    timestamp: number;

    user: Staker;
    userPrize: BigNumber;
    beneficiary: string;
    beneficiaryPrize: BigNumber;
};
