// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { formatEther, parseEther } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import { useWorkerManager } from '../services/workerManager';
import { tinyString } from '../utils/stringUtils';
import { confirmations } from '../utils/networks';

interface NodeProps {}

const Node = (props: NodeProps) => {
    const { library, account, chainId } = useWeb3React<Web3Provider>();
    const [address, setAddress] = useState('');
    const node = useWorkerManager(address);
    const [showDetails, setShowDetails] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [deposit, setDeposit] = useState<BigNumber>(constants.One);
    const [transfer, setTransfer] = useState<BigNumber>(constants.Zero);
    const [hiring, setHiring] = useState(false);
    const [transfering, setTransfering] = useState(false);

    const isNew = address === '';
    const notMine = node.user && node.user != account;
    const mine = node.user && node.user == account;
    const ready = node.user == account && node.owned && node.authorized;

    const doHire = () => {
        setAddress(addressInput);
        setShowDetails(!showDetails);
    };

    const doAddFunds = () => {
        if (library && chainId && address) {
            setTransfering(true);
            const signer = library.getSigner();
            signer
                .sendTransaction({ to: address, value: transfer })
                .then((tx) => {
                    tx.wait(confirmations[chainId]).then((receipt) => {
                        setTransfer(constants.Zero);
                        setTransfering(false);
                    });
                });
        }
    };

    const doRetire = () => {
        setAddress('');
        setAddressInput('');
        setShowDetails(!showDetails);
    };

    return (
        <>
            <div className="staking-hire">
                <div className="staking-hire-content row">
                    <span className="col-12 col-sm-auto body-text-1 mx-2">
                        Node
                    </span>
                    <span
                        className={`col-12 col-sm-auto info-text-md staking-hire-content-address mx-2 flex-grow-1 ${
                            address !== '' ? 'active' : 'inactive'
                        }`}
                    >
                        {address ? tinyString(address) : 'Click to hire node'}
                    </span>
                    {mine && node.balance && (
                        <span
                            className="col-12 col-sm-auto mx-2 staking-hire-content-balance"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {formatEther(node.balance)}{' '}
                            <span className="small-text">ETH</span>
                        </span>
                    )}
                    {notMine && (
                        <span className="col-12 col-sm-auto mx-2 staking-hire-content-error">
                            node owned by other account
                        </span>
                    )}
                </div>
            </div>

            {showDetails && (
                <div className="staking-hire-node d-flex align-items-center justify-content-center">
                    <div className="staking-hire-node-content">
                        <div className="form-group">
                            <label className="body-text-2 text-secondary">
                                Node Address
                            </label>
                            {!isNew ? (
                                <div className="sub-title-1">{address}</div>
                            ) : (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nodeAddress"
                                        value={addressInput}
                                        onChange={(event) =>
                                            setAddressInput(event.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="body-text-2 text-secondary">
                                Balance
                            </label>
                            {!isNew && node.balance ? (
                                <div className="sub-title-1">
                                    {formatEther(node.balance)}{' '}
                                    <span className="small-text text-secondary">
                                        ETH
                                    </span>
                                </div>
                            ) : (
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="deposit"
                                        value={formatEther(deposit)}
                                        onChange={(event) =>
                                            setDeposit(
                                                parseEther(event.target.value)
                                            )
                                        }
                                    />
                                    <span className="input-group-addon addon-inline input-source-observer small-text">
                                        ETH
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="body-text-2 text-secondary">
                                Owner
                            </label>
                            <div className="sub-title-1">{node.user}</div>
                        </div>

                        {mine && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Add Funds
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="transfer"
                                        disabled={transfering}
                                        value={formatEther(transfer)}
                                        onChange={(event) =>
                                            setTransfer(
                                                parseEther(event.target.value)
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
                            {isNew ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                        onClick={doHire}
                                    >
                                        Hire Node
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-link px-0 py-0 m-2 button-text flex-fill text-left"
                                        onClick={doRetire}
                                    >
                                        Retire
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={transfering}
                                        className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                        onClick={doAddFunds}
                                    >
                                        {transfering && (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        )}
                                        Add Funds
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Node;
