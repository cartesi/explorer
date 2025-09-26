// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const labels = {
    commission: 'The commission of the pool',
    effectiveTotalStake:
        'The effective total stake is calculated from the current network difficulty. This number differs from the total staked because of producers running dysfunctional nodes or nodes that are (intermittently or permanently) offline.',
    estimatedValuesInfo:
        'Estimated values can be highly variable, depending directly on the current amount of actively staked CTSI.',
    inContractBalance:
        'This is the sum of all maturing, staked, released/releasing balances',
    effectiveStake:
        'This is the amount of pool tokens actually mature in the Staking contract',
    totalStakedPool: 'This is the total staked balance of this pool',
    participationRate: 'Total Staked / Circ. Supply',
    projectedAnnualEarnings:
        'Total annual CTSI distributed in the network divided by the effective total stake',
    totalRewards:
        'Total of CTSI rewards related to all blocks produced by this node',
    totalRewardsPool:
        'Total of CTSI rewards related to all blocks produced by this pool',
    totalStaked:
        'Total amount of CTSI locked in the staking contract, currently  in the status "staked"',
    flatRateCommission:
        'This pool charges a flat rate CTSI commission over every block reward',
};

export default labels;
