export type NodeStatus = 'Hired' | 'Not Hired';

export interface NodeInfo {
    id: string;
    totalStaked: string;
    totalRewards: string;
    blocksProduced: number;
    nodeStatus?: NodeStatus;
}

export interface PoolInfo extends NodeInfo {
    totalUsers: number;
    totalRewards: string;
    commission: string;
    poolBalance?: string;
}
