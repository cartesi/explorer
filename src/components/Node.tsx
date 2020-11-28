// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { formatEther } from '@ethersproject/units';
import { AddressZero } from '@ethersproject/constants';
import { useBalance } from '../services/eth';
import { useWorkerManagerContract } from '../services/contract';
import { tinyString } from '../utils/stringUtils';

interface NodeProps {}

const Node = (props: NodeProps) => {
    const workerManager = useWorkerManagerContract();
    const [address, setAddress] = useState('');
    const [user, setUser] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [initialFunds, setInitialFunds] = useState(0);
    const [addressInput, setAddressInput] = useState('');
    const [newFunds, setNewFunds] = useState(0);

    // make balance depend on owner, so if it changes we update the balance
    // const balance = useBalance(address, [user]);
    const isNew = address === '';

    const doHire = () => {
        setAddress(addressInput);
        setShowDetails(!showDetails);
    };

    const doAddFunds = () => {
        setInitialFunds(initialFunds + newFunds);
        setShowDetails(!showDetails);
    };

    const doRetire = () => {
        setInitialFunds(0);
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
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {address ? tinyString(address) : 'Click to hire node'}
                    </span>
                    {address !== '' && (
                        <span className="col-12 col-sm-auto mx-2 staking-hire-content-balance">
                            {initialFunds}{' '}
                            <span className="small-text">ETH</span>
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
                                <div className="sub-title-1">
                                    {addressInput}
                                </div>
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
                                Initial Funds
                            </label>
                            {!isNew ? (
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
                                                    ? event.target.valueAsNumber
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

                        {!isNew && (
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
                                                    ? event.target.valueAsNumber
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
                                        className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
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
        </>
    );
};

export default Node;
