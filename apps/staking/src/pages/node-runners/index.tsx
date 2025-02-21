// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useRouter } from 'next/router';
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
