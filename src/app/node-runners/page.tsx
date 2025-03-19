import NodeRunners from '../../components/node-runners/NodeRunners';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Node Runners - Get started with Cartesi staking',
    description: 'Node Runners - Get started with Cartesi staking',
};

export default function NodeRunnersPage() {
    return <NodeRunners />;
}
