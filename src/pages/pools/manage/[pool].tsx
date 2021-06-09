// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';

import Layout from '../../../components/Layout';

const ManagePool = () => {
    const [poolName, setPoolName] = useState('');

    return (
        <Layout className="pools">
            <Head>
                <title>Cartesi - Manage Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white">Manage Pool</div>
            </div>

            <div className="manage-pool">
                <div className="manage-pool-section">
                    <div className="form-group mt-3">
                        <div className="form-check">
                            <label className="body-text-2 text-secondary">
                                Pool Name
                            </label>
                        </div>

                        <div className="input-group">
                            <input
                                className="addon-inline form-control"
                                id="poolName"
                                value={poolName}
                                onChange={(e) => setPoolName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePool;
