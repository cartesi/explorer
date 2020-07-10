// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { useBalance, useProxyManager } from '../utils/ethereum';
import { ethers } from 'ethers';
import Alert from 'react-bootstrap/Alert';

export interface InfoProps {
    address: string;
}

export const Info = (props: InfoProps) => {
    const balance = useBalance(props.address);

    const proxyManager = useProxyManager();
    const [owner, setOwner] = useState<string>('');

    useEffect(() => {
        if (proxyManager) {
            proxyManager.getOwner(props.address).then(setOwner);
        }
    }, [props.address, proxyManager]);

    return <div>
        <p>Address: {props.address}</p>
        <p>Balance: {balance && ethers.utils.formatEther(balance)} ETH</p>
        <p>Owner: {owner}</p>
    </div>;
};
