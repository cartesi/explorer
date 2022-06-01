// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useWallet } from '../../contexts/wallet';
import { NodeRunnersContainer } from '../../containers/node-runners/NodeRunnerContainer';

const NewStaking: FC = () => {
    const wallet = useWallet();
    const router = useRouter();

    return (
        <Layout>
            <Head>
                <title>Cartesi - New Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NodeRunnersContainer wallet={wallet} router={router} />
        </Layout>
    );
};

export default NewStaking;
