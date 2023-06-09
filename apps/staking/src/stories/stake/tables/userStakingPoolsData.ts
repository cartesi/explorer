export default [
    {
        __typename: 'PoolBalance',
        id: '0xab725dbdffb40c168e9ded315a7484e042c81b41-0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
        user: {
            __typename: 'PoolUser',
            id: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
        },
        shares: '11000000000000000001000000000',
        balance: '38999999999999999999',
        stakeTimestamp: '1660634112',
        pool: {
            __typename: 'StakingPool',
            id: '0xab725dbdffb40c168e9ded315a7484e042c81b41',
            manager: '0xb8f36979dfe9fe6854833f7936c3987b2408ad32',
            amount: '11000000000000000001',
            shares: '11000000000000000001000000000',
            totalUsers: 1,
            totalCommission: '0',
            commissionPercentage: null,
            paused: false,
            timestamp: '1658488929',
            fee: {
                __typename: 'StakingPoolFee',
                id: '0xa062e3f4589dd474eed2d6edcecad54ca6b89773',
                commission: 3,
                gas: null,
                created: '1658488929',
                lastUpdated: '1658488929',
            },
            user: {
                __typename: 'User',
                id: '0xab725dbdffb40c168e9ded315a7484e042c81b41',
                stakedBalance: '0',
                maturingBalance: '0',
                maturingTimestamp: '0',
                releasingBalance: '0',
                releasingTimestamp: '0',
                balance: '0',
                totalBlocks: 0,
                totalReward: '0',
            },
        },
    },
];
