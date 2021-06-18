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
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from '../../components/Layout';
import { useStakingPoolFactory } from '../../services/poolFactory';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';
import { useRouter } from 'next/router';

const CreatePool = () => {
    const { account } = useWeb3React<Web3Provider>();

    const [flatRateCommission, setFlatRateCommission] = useState(0);
    const [gasTaxCommission, setGasTaxCommission] = useState(0);
    const [isFlatRateCommission, setIsFlatRateCommission] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();
    const { waiting, error, createFlatRateCommission, createGasTaxCommission } =
        useStakingPoolFactory();

    const createPool = () => {
        if (isFlatRateCommission && flatRateCommission) {
            createFlatRateCommission(flatRateCommission);
            setSubmitted(true);
        } else if (gasTaxCommission) {
            createGasTaxCommission(gasTaxCommission);
            setSubmitted(true);
        }
    };

    useEffect(() => {
        if (!waiting && submitted && !error) {
            router.push('/pools');
        }
    }, [waiting, error]);

    return (
        <Layout className="pools">
            <Head>
                <title>Cartesi - Create Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="col col-12 col-lg-6 info-text-md text-white d-flex flex-row">
                    Create a Staking Pool
                    <ConfirmationIndicator loading={waiting} error={error} />
                </div>
            </div>

            <div className="pool-creation">
                <div className="form-group mt-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="commissionType"
                            id="flatRateCommission"
                            checked={isFlatRateCommission}
                            onChange={(e) =>
                                setIsFlatRateCommission(e.target.checked)
                            }
                        />
                        <label
                            className="body-text-2 text-secondary"
                            onClick={() => setIsFlatRateCommission(true)}
                        >
                            Flat Rate Commission
                        </label>
                    </div>

                    <div className="input-group">
                        <input
                            type="number"
                            className="addon-inline form-control"
                            id="flatRateCommission"
                            value={flatRateCommission}
                            disabled={!isFlatRateCommission}
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
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="commissionType"
                            id="gasTaxCommission"
                            checked={!isFlatRateCommission}
                            onChange={(e) =>
                                setIsFlatRateCommission(!e.target.checked)
                            }
                        />
                        <label
                            className="body-text-2 text-secondary"
                            onClick={() => setIsFlatRateCommission(false)}
                        >
                            Gas Tax Commission
                        </label>
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            className="addon-inline form-control"
                            id="gasTaxCommission"
                            value={gasTaxCommission}
                            disabled={isFlatRateCommission}
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
                    className="btn btn-dark py-0 mt-2 button-text flex-fill"
                    onClick={createPool}
                    disabled={
                        !account ||
                        (isFlatRateCommission && !flatRateCommission) ||
                        (!isFlatRateCommission && !gasTaxCommission)
                    }
                >
                    Create Pool
                </button>
            </div>
        </Layout>
    );
};

export default CreatePool;
