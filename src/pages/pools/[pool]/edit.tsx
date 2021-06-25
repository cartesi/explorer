// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import {
    useFlatRateCommission,
    useGasTaxCommission,
    useStakingPool,
} from '../../../services/pool';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';

import Layout from '../../../components/Layout';
import ConfirmationIndicator from '../../../components/ConfirmationIndicator';
import PoolNode from '../../../components/PoolNode';
import { useENS } from '../../../services/ens';
import { tinyString } from '../../../utils/stringUtils';

const ManagePool = () => {
    const router = useRouter();
    const { pool } = router.query;
    // resolve address to name (if possible)
    const ensEntry = useENS(pool as string);

    const [poolName, setPoolName] = useState('');
    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);
    const [nodeError, setNodeError] = useState<string>();

    const {
        setName,
        pause,
        unpause,
        paused,
        waiting: poolWaiting,
        error: poolError,
    } = useStakingPool(pool as string);

    const stakingPool = useStakingPoolQuery(pool as string);
    const [commission, setCommission] = useState(0);

    const {
        setRate,
        waiting: rateWaiting,
        error: rateError,
    } = useFlatRateCommission(pool as string);

    const {
        setGas,
        waiting: gasWaiting,
        error: gasError,
    } = useGasTaxCommission(pool as string);

    const initialCommission =
        stakingPool?.fee?.commission / 100 || stakingPool?.fee?.gas;

    useEffect(() => {
        if (stakingPool?.fee) {
            setCommission(initialCommission);
        }
    }, [stakingPool?.fee]);

    const waiting = poolWaiting || nodeWaiting || rateWaiting || gasWaiting;
    const error = poolError || nodeError || rateError || gasError;

    const updateCommission = (newCommission: number) => {
        if (!stakingPool?.fee) return;
        if (initialCommission == newCommission) return;

        if (stakingPool?.fee?.commission) {
            setRate(Math.ceil(newCommission * 100));
        } else {
            setGas(Math.ceil(newCommission));
        }
    };

    return (
        <Layout className="pools">
            <Head>
                <title>Cartesi - Edit Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white d-flex flex-row">
                    Edit Pool: {ensEntry.name || tinyString(ensEntry.address)}
                    <ConfirmationIndicator loading={waiting} error={error} />
                </div>
            </div>

            <div className="manage-pool">
                <PoolNode
                    poolAddress={pool as string}
                    setWaiting={setNodeWaiting}
                    setError={setNodeError}
                />

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Current Fee Model:
                    </span>
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        {!stakingPool?.fee
                            ? ''
                            : stakingPool.fee.commission
                            ? `${
                                  stakingPool?.fee?.commission / 100
                              }% Flat Rate Commission`
                            : `${stakingPool?.fee?.gas} Gas Tax Commission`}
                    </span>
                </div>

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Set Commission
                    </span>

                    <div className="input-group manage-pool-item-input">
                        <input
                            className="addon-inline form-control"
                            id="commission"
                            value={commission}
                            type="number"
                            onChange={(e) =>
                                setCommission(parseFloat(e.target.value))
                            }
                        />

                        <span
                            className={`input-group-addon addon-inline input-source-observer small-text`}
                        >
                            {stakingPool?.fee?.commission ? '%' : 'gas'}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => updateCommission(commission)}
                        disabled={
                            !stakingPool?.fee || commission > initialCommission
                        }
                    >
                        Set Commission
                    </button>

                    {commission > initialCommission && (
                        <span className="manage-pool-item-input-error">
                            New commission must be smaller than the current one
                        </span>
                    )}
                </div>

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
                        Pool is currently {paused ? 'paused' : 'unpaused'}
                    </span>

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => (paused ? unpause() : pause())}
                    >
                        {paused ? 'Unpause' : 'Pause'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePool;
