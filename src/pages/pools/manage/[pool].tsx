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
import { useRouter } from 'next/router';

import { useStakingPool } from '../../../services/pool';

import Layout from '../../../components/Layout';
import ConfirmationIndicator from '../../../components/ConfirmationIndicator';
import Node from '../../../components/Node';

const ManagePool = () => {
    const router = useRouter();
    const { pool } = router.query;

    const [poolName, setPoolName] = useState('');
    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);
    const [nodeError, setNodeError] = useState<string>();

    const {
        setName,
        lock,
        unlock,
        hire,
        cancelHire,
        retire,
        isLocked,
        waiting: poolWaiting,
        error: poolError,
    } = useStakingPool(pool as string);

    const waiting = poolWaiting || nodeWaiting;
    const error = poolError || nodeError;

    return (
        <Layout className="pools">
            <Head>
                <title>Cartesi - Manage Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white d-flex flex-row">
                    Manage Pool
                    <ConfirmationIndicator loading={waiting} error={error} />
                </div>
            </div>

            <div className="manage-pool">
                <Node
                    account={pool as string}
                    setWaiting={setNodeWaiting}
                    setError={setNodeError}
                />

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Pool Name
                    </span>

                    <input
                        className="addon-inline form-control manage-pool-item-input"
                        id="poolName"
                        value={poolName}
                        onChange={(e) => setPoolName(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => setName(poolName)}
                    >
                        Set Name
                    </button>
                </div>

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Pool is currently {isLocked ? 'locked' : 'unlocked'}
                    </span>

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => (isLocked ? unlock() : lock())}
                    >
                        {isLocked ? 'Unlock' : 'Lock'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePool;
