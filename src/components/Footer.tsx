// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWeb3React } from '@web3-react/core';
import React from 'react';
import {
    useCartesiTokenContract,
    useSimpleFaucetContract,
    usePoSContract,
    useStakingContract,
    useStakingPoolFactoryContract,
    useWorkerManagerContract,
} from '../services/contracts';
import Address from './Address';

const Footer = () => {
    const { chainId } = useWeb3React();

    const pos = usePoSContract();
    const token = useCartesiTokenContract();
    const faucet = useSimpleFaucetContract();
    const staking = useStakingContract();
    const workerManager = useWorkerManagerContract();
    const poolFactory = useStakingPoolFactoryContract();

    return (
        <div className="layout-footer">
            <div className="layout-footer__content flex-column flex-lg-row py-4">
                <div className="my-1 d-flex flex-column align-start mb-4 mb-lg-0">
                    <b className="mb-3">Resources</b>
                    <div className="my-1">
                        <a
                            href="https://github.com/cartesi/pos-dlib/raw/develop/Smart%20Contract%20Security%20Audit%20Report%20-%20Staking.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Audit Report
                        </a>
                    </div>
                    <div className="my-1">
                        <a
                            href="https://cartesi.io/en/mine/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CTSI Reserve Mining
                        </a>
                    </div>
                    <div className="my-1">
                        <a
                            href="https://medium.com/cartesi/running-a-node-and-staking-42523863970e"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            How to Run a Node
                        </a>
                    </div>
                    <div className="my-1">
                        <a
                            href="https://github.com/cartesi/noether/wiki/FAQ"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            FAQ
                        </a>
                    </div>
                </div>

                {chainId && (
                    <div className="my-1 d-flex flex-column align-start">
                        <b className="mb-3">Contract Addresses</b>
                        <div className="d-flex flex-row align-start my-1">
                            CTSI Token:
                            <Address
                                type="address"
                                id={token?.address}
                                rawLink={true}
                            />
                        </div>

                        <div className="d-flex flex-row align-start my-1">
                            CTSI Faucet:
                            <Address
                                type="address"
                                id={faucet?.address}
                                rawLink={true}
                            />
                        </div>

                        <div className="d-flex flex-row align-start my-1">
                            PoS:
                            <Address
                                type="address"
                                id={pos?.address}
                                rawLink={true}
                            />
                        </div>

                        <div className="d-flex flex-row align-start my-1">
                            Staking:
                            <Address
                                type="address"
                                id={staking?.address}
                                rawLink={true}
                            />
                        </div>

                        <div className="d-flex flex-row align-start my-1">
                            Worker Manager:
                            <Address
                                type="address"
                                id={workerManager?.address}
                                rawLink={true}
                            />
                        </div>

                        <div className="d-flex flex-row align-start my-1">
                            Pool Factory:
                            <Address
                                type="address"
                                id={poolFactory?.address}
                                rawLink={true}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center w-100 py-4 border-top">
                Copyright (C) 2020 Cartesi Pte. Ltd.
            </div>
        </div>
    );
};

export default Footer;
