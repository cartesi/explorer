// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import {
    useCartesiTokenContract,
    usePoSContract,
    useStakingContract,
    useWorkerManagerContract,
} from '../services/contract';
import Address from './Address';

const Footer = () => {
    const pos = usePoSContract();
    const token = useCartesiTokenContract();
    const staking = useStakingContract();
    const workerManager = useWorkerManagerContract();

    return (
        <div className="layout-footer pt-3">
            Copyright (C) 2020 Cartesi Pte. Ltd.
            <div className="my-3 layout-footer__contracts">
                <div className="d-flex flex-row align-start my-1">
                    CTSI Token:
                    <Address type="address" id={token?.address} rawLink={true}>
                        {token?.address}
                    </Address>
                </div>

                <div className="d-flex flex-row align-start my-1">
                    PoS:
                    <Address type="address" id={pos?.address} rawLink={true}>
                        {pos?.address}
                    </Address>
                </div>

                <div className="d-flex flex-row align-start my-1">
                    Staking:
                    <Address
                        type="address"
                        id={staking?.address}
                        rawLink={true}
                    >
                        {staking?.address}
                    </Address>
                </div>

                <div className="d-flex flex-row align-start my-1">
                    Worker Manager:
                    <Address
                        type="address"
                        id={workerManager?.address}
                        rawLink={true}
                    >
                        {workerManager?.address}
                    </Address>
                </div>
            </div>
        </div>
    );
};

export default Footer;
