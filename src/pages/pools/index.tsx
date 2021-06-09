// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';

import Layout from '../../components/Layout';
import PoolsTable from '../../components/Pools';
import useSummary from '../../graphql/hooks/useSummary';

const Pools = () => {
    const summary = useSummary();

    return (
        <Layout className="pools">
            <Head>
                <title>Cartesi - Pools</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white">Staking Pools</div>
            </div>

            <PoolsTable summary={summary} />
        </Layout>
    );
};

export default Pools;
