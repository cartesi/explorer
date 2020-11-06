export type Staker = {
    id: string;
    stakedBalance: number;
    maturingBalance: number;
    maturation: number;
};

export type Worker = {
    id: string;
    owner: Staker;
    dapp: string;
    time: number;
    status: string;
};

export type LotteryTicket = {
    id: string;
    round: number;
    winner: string;
    worker: Worker;

    difficulty: number;
    time: number;

    user: Staker;
    userPrize: number;
    beneficiary: string;
    beneficiaryPrize: string;
};
