import { BigNumber } from 'ethers';

export type Summary = {
    id: string;
    totalStakers: number;
    totalWorkers: number;
    totalStaked: number;
    totalTickets: number;
};

export type Staker = {
    id: string;
    stakedBalance: number;
    maturingBalance: number;
    maturation: number;
    totalTickets: number;
};

export type Worker = {
    id: string;
    owner: Staker;
    timestamp: number;
    status: string;
    totalTickets: number;
    totalReward: number;
};

export type LotteryTicket = {
    id: string;
    round: number;
    winner: string;
    worker: Worker;

    difficulty: BigNumber;
    timestamp: number;

    user: Staker;
    userPrize: number;
    beneficiary: string;
    beneficiaryPrize: string;
};
