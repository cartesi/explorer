const labels = {
    effectiveTotalStake: `The effective total stake is calculated from the current network difficulty. This number differs from the total staked because of producers running dysfunctional nodes or nodes that are (intermittently or permanently) offline.`,
    estimatedValuesInfo:
        'Estimated values can be highly variable, depending directly on the current amount of actively staked CTSI.',
    inContractBalance:
        'This is the sum of all maturing, staked, released/releasing balances',
    totalStakedPool: 'This is the total staked balance of this pool',
    participationRate: 'Total Staked / Circ. Supply',
    projectedAnnualEarnings:
        'Total annual CTSI distributed in the network divided by the effective total stake',
    totalRewards:
        'Total of CTSI rewards related to all blocks produced by this node',
    totalStaked:
        'Total amount of CTSI locked in the staking contract, currently  in the status "staked"',
};

export default labels;
