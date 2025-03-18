'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Layout from '../../components/Layout';
import PageHead from '../../components/PageHead';
import { useWallet } from '../../components/wallet';
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
