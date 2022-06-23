// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import Head from 'next/head';
import { useBlockNumber } from '../../../services/eth';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import NodePoolHeader from '../../../components/poolRedesign/PoolHeader';
import { useWallet } from '../../../contexts/wallet';
import { NodeManageContainer } from '../../../containers/node-manage/NodeManageContainer';

const PoolNode: FC = () => {
    const wallet = useWallet();
    const blockNumber = useBlockNumber();
    const router = useRouter();
    const address = router.query.node as string;

    return (
        <Layout>
            <Head>
                <title>Cartesi - Manage Node</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NodePoolHeader />
            <NodeManageContainer
                wallet={wallet}
                blockNumber={blockNumber}
                address={address}
            />
        </Layout>
    );
};

export default PoolNode;
