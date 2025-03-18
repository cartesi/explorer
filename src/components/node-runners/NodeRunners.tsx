'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Layout from '../Layout';
import PageHead from '../PageHead';
import { useWallet } from '../wallet';
import { NodeRunnersContainer } from '../../containers/node-runners/NodeRunnerContainer';

const NodeRunners: FC = () => {
    const wallet = useWallet();
    const router = useRouter();

    return (
        <Layout>
            <PageHead
                title="Node Runners - Get started with Cartesi staking"
                description="Node Runners - Get started with Cartesi staking"
            />
            <NodeRunnersContainer wallet={wallet} router={router} />
        </Layout>
    );
};

export default NodeRunners;
