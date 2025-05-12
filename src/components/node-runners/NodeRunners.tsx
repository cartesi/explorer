'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Layout from '../Layout';
import { useWallet } from '../wallet';
import { NodeRunnersContainer } from '../../containers/node-runners/NodeRunnerContainer';

const NodeRunners: FC = () => {
    const wallet = useWallet();
    const router = useRouter();

    return (
        <Layout>
            <NodeRunnersContainer wallet={wallet} router={router} />
        </Layout>
    );
};

export default NodeRunners;
