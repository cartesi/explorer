// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useStakingPoolFactory } from '../../services/poolFactory';

const CreatePool = () => {
    const [progress, setProgress] = useState(0);
    const [flatRateCommission, setFlatRateCommission] = useState(0);
    const [gasTaxCommission, setGasTaxCommission] = useState(0);
    const { createFlatRateCommission, createGasTaxCommission } =
        useStakingPoolFactory();

    const createPool = () => {
        if (flatRateCommission) {
            createFlatRateCommission(flatRateCommission);
            setProgress(1);
        } else if (gasTaxCommission) {
            createGasTaxCommission(gasTaxCommission);
            setProgress(1);
        }
    };

    return (
        <Layout className="pools">
            <Head>
                <title>Delegation</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white">
                    Create a Staking Pool
                </div>
            </div>

            <div className="col col-12 pl-3 staking-ops my-3">
                <div className="d-flex flex-row">
                    <div
                        className={`staking-ops-tab body-text-1 
                                ${progress == 0 ? 'active' : ''}`}
                        onClick={() => setProgress(0)}
                    >
                        Select Commission Model
                    </div>
                    <div
                        className={`staking-ops-tab body-text-1 
                                ${progress == 1 ? 'active' : ''}`}
                    >
                        Set ENS
                    </div>
                </div>

                <div className="staking-ops-content">
                    {progress == 0 && (
                        <>
                            <div className="form-group mt-3">
                                <label className="body-text-2 text-secondary">
                                    Flat Rate Commission
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="flatRateCommission"
                                        value={flatRateCommission}
                                        onChange={(e) =>
                                            setFlatRateCommission(
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : 0
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-3">
                                <label className="body-text-2 text-secondary">
                                    Gas Tax Commission
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="gasTaxCommission"
                                        value={gasTaxCommission}
                                        onChange={(e) =>
                                            setGasTaxCommission(
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : 0
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-dark py-2 mt-2 button-text flex-fill"
                                onClick={createPool}
                            >
                                Create Pool
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CreatePool;
