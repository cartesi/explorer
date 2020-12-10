// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { formatEther, parseEther } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import { useNode } from '../services/node';
import { tinyString } from '../utils/stringUtils';
import useNodes from '../graphql/hooks/useNodes';

interface NodeProps {}

const Node = (props: NodeProps) => {
    const { account, chainId } = useWeb3React<Web3Provider>();
    const [address, setAddress] = useState<string>('');
    const node = useNode(address);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [deposit, setDeposit] = useState<BigNumber>(parseEther('0.1'));
    const [transfer, setTransfer] = useState<BigNumber>(constants.Zero);

    const { nodes, updateFilter } = useNodes();

    const notMine = node.address && !node.available && node.user != account;
    const mine = node.user == account;
    const ready = node.user == account && node.owned && node.authorized;

    const debug = chainId == 313371;

    let status = '';

    useEffect(() => {
        if (account) {
            updateFilter({ owner: account.toLowerCase() });
        }
    }, [account]);

    useEffect(() => {
        if (nodes && nodes.length > 0) {
            setAddress(nodes[0].id);
        }
    }, [nodes]);

    if (node.available) {
        status = 'Available';
    } else if (node.owned && node.authorized && node.user == account) {
        status = 'Ready';
    } else if (node.owned && node.authorized) {
        status = `Owned by ${node.user}`;
    } else if (node.owned && !node.authorized) {
        status = `Owned by ${node.user}, pending authorization`;
    } else if (node.pending) {
        status = `Hired by ${node.user}, pending confirmation`;
    } else if (node.retired) {
        status = 'Retired';
    }

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
                    {notMine && (
                        <span className="col-12 col-sm-auto mx-2 staking-hire-content-error">
                            node owned by other account
                        </span>
                    )}
                    {node.balance && (
                        <span className="col-12 col-sm-auto mx-2 staking-hire-content-balance">
                            {formatEther(node.balance)}{' '}
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
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control :invalid"
                                    id="address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                />
                            </div>
                            <div className="invalid-feedback">
                                Invalid address.
                            </div>
                        </div>

                        {node.address && node.available && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Deposit
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="deposit"
                                        defaultValue={formatEther(deposit)}
                                        onBlur={(e) => {
                                            const value = parseEther(
                                                e.target.value
                                            );
                                            setDeposit(value);
                                            e.target.value = formatEther(value);
                                        }}
                                    />
                                    <span className="input-group-addon addon-inline input-source-observer small-text">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        )}

                        {node.address &&
                            debug &&
                            node.user != constants.AddressZero && (
                                <div className="form-group">
                                    <label className="body-text-2 text-secondary">
                                        Owner
                                    </label>
                                    <div className="sub-title-1">
                                        {node.user}
                                    </div>
                                </div>
                            )}

                        {node.address && debug && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Status
                                </label>
                                <div className="sub-title-1">{status}</div>
                            </div>
                        )}

                        {ready && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Add Funds
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="transfer"
                                        disabled={node.transfering}
                                        defaultValue={formatEther(transfer)}
                                        onBlur={(e) => {
                                            const value = parseEther(
                                                e.target.value
                                            );
                                            setTransfer(value);
                                            e.target.value = formatEther(value);
                                        }}
                                    />
                                    <span className="input-group-addon addon-inline input-source-observer small-text">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        )}

                        {node.address && node.available && (
                            <div className="staking-hire-node-buttons">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={node.hiring}
                                    className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => node.hire(deposit)}
                                >
                                    {node.hiring && (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    )}
                                    Hire Node
                                </button>
                            </div>
                        )}

                        {mine && node.pending && (
                            <div className="staking-hire-node-buttons">
                                <button
                                    type="button"
                                    disabled={node.hiring}
                                    className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => node.cancelHire()}
                                >
                                    {node.hiring && (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    )}
                                    Cancel Hire
                                </button>
                            </div>
                        )}

                        {ready && (
                            <div className="staking-hire-node-buttons">
                                <button
                                    type="button"
                                    className="btn btn-link px-0 py-0 m-2 button-text flex-fill text-left"
                                    onClick={() => node.retire()}
                                >
                                    Retire
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={node.transfering}
                                    className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => node.transfer(transfer)}
                                >
                                    {node.transfering && (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    )}
                                    Add Funds
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Node;
