import React, { useState } from 'react';
import Head from 'next/head';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from '../../components/Layout';

import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import { tinyString } from '../../utils/stringUtils';

const Staking = () => {
    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const { balance, formatCTSI } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking();

    const [nodeAddress, setNodeAddress] = useState('');
    const [initialFunds, setInitialFunds] = useState(0);

    const [nodeAddressInput, setNodeAddressInput] = useState('');
    const [newFunds, setNewFunds] = useState(0);

    const [showNodeDetails, setShowNodeDetails] = useState(false);

    const isNewNode = nodeAddress === '' || nodeAddress !== nodeAddressInput;

    const doHire = () => {
        setNodeAddress(nodeAddressInput);
        setShowNodeDetails(!showNodeDetails);
    };

    const doAddFunds = () => {
        setInitialFunds(initialFunds + newFunds);
        setShowNodeDetails(!showNodeDetails);
    };

    const doRetire = () => {
        setInitialFunds(0);
        setNodeAddress('');
        setNodeAddressInput('');
        setShowNodeDetails(!showNodeDetails);
    };

    return (
        <Layout className="staking">
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header row align-items-center py-3">
                <div className="col col-12 col-lg-6 info-text-md text-white">
                    Staking
                </div>

                <div className="col col-12 col-md-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/wallet.png" />
                        &nbsp; Wallet Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(balance) : 'N/A'}  `}
                        <span className="caption">CTSI</span>
                    </div>
                </div>

                <div className="col col-12 col-md-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/staked.png" />
                        &nbsp; Staked Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(stakedBalance) : 'N/A'}`}
                        <span className="caption"> CTSI</span>
                    </div>
                </div>
            </div>

            <div className="staking-hire">
                <div className="staking-hire-content row">
                    <span className="body-text-1 mr-2">Node</span>
                    <span
                        className={`info-text-md staking-hire-content-address mx-2 flex-grow-1 ${
                            nodeAddress !== '' ? 'active' : 'inactive'
                        }`}
                        onClick={() => setShowNodeDetails(!showNodeDetails)}
                    >
                        {nodeAddress
                            ? tinyString(nodeAddress)
                            : 'Click to hire node'}
                    </span>
                    {nodeAddress !== '' && (
                        <span className="staking-hire-content-balance">
                            {initialFunds}{' '}
                            <span className="small-text">ETH</span>
                        </span>
                    )}
                </div>

                {showNodeDetails && (
                    <div className="staking-hire-node d-flex align-items-center justify-content-center">
                        <div className="staking-hire-node-content">
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Node Address
                                </label>
                                {!isNewNode ? (
                                    <div className="sub-title-1">
                                        {nodeAddressInput}
                                    </div>
                                ) : (
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nodeAddress"
                                            value={nodeAddressInput}
                                            onChange={(event) =>
                                                setNodeAddressInput(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Initial Funds
                                </label>
                                {!isNewNode ? (
                                    <div className="sub-title-1">
                                        {initialFunds}{' '}
                                        <span className="small-text text-secondary">
                                            ETH
                                        </span>
                                    </div>
                                ) : (
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="addon-inline form-control"
                                            id="initialFunds"
                                            value={initialFunds}
                                            onChange={(event) =>
                                                setInitialFunds(
                                                    event.target.value
                                                        ? event.target
                                                              .valueAsNumber
                                                        : 0
                                                )
                                            }
                                        />
                                        <span className="input-group-addon addon-inline input-source-observer small-text">
                                            ETH
                                        </span>
                                    </div>
                                )}
                            </div>

                            {!isNewNode && (
                                <div className="form-group">
                                    <label className="body-text-2 text-secondary">
                                        Add Funds
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="addon-inline form-control"
                                            id="newFunds"
                                            value={newFunds}
                                            onChange={(event) =>
                                                setNewFunds(
                                                    event.target.value
                                                        ? event.target
                                                              .valueAsNumber
                                                        : 0
                                                )
                                            }
                                        />
                                        <span className="input-group-addon addon-inline input-source-observer small-text">
                                            ETH
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="staking-hire-node-buttons">
                                {isNewNode ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark py-0 px-3 button-text flex-fill mr-2"
                                            onClick={() =>
                                                setShowNodeDetails(
                                                    !showNodeDetails
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary py-0 px-3 button-text flex-fill ml-2"
                                            onClick={doHire}
                                        >
                                            Hire Node
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-link px-0 py-0 mr-2 button-text flex-fill text-left"
                                            onClick={doRetire}
                                        >
                                            Retire
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-dark py-0 px-3 button-text flex-fill mr-2"
                                            onClick={() =>
                                                setShowNodeDetails(
                                                    !showNodeDetails
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary py-0 px-3 button-text flex-fill ml-2"
                                            onClick={doAddFunds}
                                        >
                                            Add Funds
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Staking;
