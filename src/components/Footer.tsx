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
            <div className="my-3">
                CTSI Token:
                <Address className="ml-2" type="address" id={token.address}>
                    {token.address}
                </Address>
                <br />
                PoS:
                <Address className="ml-2" type="address" id={pos.address}>
                    {pos.address}
                </Address>
                <br />
                Staking:
                <Address className="ml-2" type="address" id={staking.address}>
                    {staking.address}
                </Address>
                <br />
                Worker Manager:
                <Address
                    className="ml-2"
                    type="address"
                    id={workerManager.address}
                >
                    {workerManager.address}
                </Address>
            </div>
        </div>
    );
};

export default Footer;
