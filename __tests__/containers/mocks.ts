import { mock } from 'jest-mock-extended';
import { useUserNodes } from '../../src/graphql/hooks/useNodes';
import useStakingPools from '../../src/graphql/hooks/useStakingPools';
import { NodesData, StakingPoolsData } from '../../src/graphql/models';
import { useCartesiToken } from '../../src/services/token';
import { toBigNumber } from '../../src/utils/numberParser';
import { ReturnOf } from '../test-utilities';

type UseUserNodesReturn = ReturnOf<typeof useUserNodes>;
type UseStakingPoolsReturn = ReturnOf<typeof useStakingPools>;
type UseCartesiTokenReturn = ReturnOf<typeof useCartesiToken>;

const buildMockUseUserNodeRet = () => mock<UseUserNodesReturn>();
const buildMockUseStakingPoolsRet = () => mock<UseStakingPoolsReturn>();
const buildMockUseCartesiTokenRet = () => mock<UseCartesiTokenReturn>();

function buildUseCartesiTokenReturn() {
    const mock = buildMockUseCartesiTokenRet();
    mock.balance = toBigNumber('50000');
    return mock;
}

function buildUseStakingPoolsReturn() {
    const mock = buildMockUseStakingPoolsRet();
    mock.loading = false;
    mock.data = null;
    return mock;
}

function buildUseUserNodesReturn() {
    const mock = buildMockUseUserNodeRet();
    mock.loading = false;
    mock.data = null;
    return mock;
}

const generateNodeData = (): { data: NodesData } => ({
    data: {
        nodes: [
            {
                id: '0x68a42decd906f86a893ec91d04468bc2a869e56c',
                owner: {
                    balance: '3400000000000000000000',
                    id: '0xe584cd6dd071f532e9598e96589663e69330731b',
                    maturingBalance: '400000000000000000000',
                    maturingTimestamp: 1663547928,
                    releasingBalance: '0',
                    releasingTimestamp: 1663548684,
                    stakedBalance: '3000000000000000000000',
                    totalBlocks: 0,
                    totalReward: '0',
                },
                status: 'Owned',
                retirementTimestamp: null,
                timestamp: 1656483324,
                totalBlocks: 1,
                totalReward: '10000000000000000000',
            },
        ],
    },
});

const generateStakingPoolsData = (): { data: StakingPoolsData } => ({
    data: {
        stakingPools: [
            {
                amount: '0',
                commissionPercentage: null,
                fee: {
                    commission: 1000,
                    created: 1656483252,
                    gas: null,
                    id: '0x204ed6fc592c6e57f4f0b0c764b6da8547cd019b',
                    lastUpdated: 1656483252,
                },
                id: '0xe584cd6dd071f532e9598e96589663e69330731b',
                manager: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                paused: false,
                shares: '0',
                timestamp: 1656483252,
                totalCommission: '0',
                totalUsers: 0,
                user: {
                    balance: '0',
                    id: '0xe584cd6dd071f532e9598e96589663e69330731b',
                    maturingBalance: '0',
                    maturingTimestamp: 0,
                    releasingBalance: '0',
                    releasingTimestamp: 0,
                    stakedBalance: '0',
                    totalBlocks: 0,
                    totalReward: '0',
                },
            },
            {
                amount: '0',
                commissionPercentage: null,
                fee: {
                    commission: 30,
                    created: 1651717003,
                    gas: null,
                    id: '0x874c99e9fc70ef9fd98647598c0273d80ebdb647',
                    lastUpdated: 1651717003,
                },
                id: '0xe656584736b1efc14b4b6c785aa9c23bac8f41aa',
                manager: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                paused: false,
                shares: '0',
                timestamp: 1651717003,
                totalCommission: '0',
                totalUsers: 0,
                user: {
                    balance: '0',
                    id: '0xe656584736b1efc14b4b6c785aa9c23bac8f41aa',
                    maturingBalance: '0',
                    maturingTimestamp: 0,
                    releasingBalance: '0',
                    releasingTimestamp: 0,
                    stakedBalance: '0',
                    totalBlocks: 0,
                    totalReward: '0',
                },
            },
        ],
    },
});

const nodeRetiredHistoryData = (): { data: NodesData } => ({
    data: {
        nodes: [
            {
                id: '0x43551627aafca2f871d4b23d438257b8fcf741d6',
                owner: {
                    balance: '6000000000000000000000',
                    id: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
                    maturingBalance: '4000000000000000000000',
                    maturingTimestamp: 1670819220,
                    releasingBalance: '0',
                    releasingTimestamp: 0,
                    stakedBalance: '2000000000000000000000',
                    totalBlocks: 0,
                    totalReward: '0',
                },
                status: 'Retired',
                timestamp: 1670477832,
                retirementTimestamp: 1670485824,
                totalBlocks: 0,
                totalReward: '0',
            },
        ],
    },
});

export {
    buildUseUserNodesReturn,
    buildUseStakingPoolsReturn,
    buildUseCartesiTokenReturn,
    generateNodeData,
    generateStakingPoolsData,
    nodeRetiredHistoryData,
};
