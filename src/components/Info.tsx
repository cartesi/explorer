// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useBalance, useProxyManager, useAccount } from '../utils/ethereum';

export interface InfoProps {
    address: string;
}

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const Info = (props: InfoProps) => {
    const balance = useBalance(props.address);
    const account = useAccount(0);

    const [error, setError] = useState<string>('');
    const proxyManager = useProxyManager();
    const [owner, setOwner] = useState<string>('');

    useEffect(() => {
        if (proxyManager) {
            proxyManager.methods.getOwner(props.address).call().then(setOwner);
        }
    }, [props.address, proxyManager]);

    const claimProxy = () => {
        if (proxyManager && account) {
            const value = 100000000;
            proxyManager.methods
                .claimProxy(props.address, [])
                .send({ from: account, gas: 200000000, gasPrice: 30000 })
                .then(tr => {
                    // query owner again
                    proxyManager.methods.getOwner(props.address).call().then(setOwner);
                })
                .catch(e => {
                    setError(e.message);
                    console.error(e);
                });
        }
    };

    return (
        <div>
            <h1>Proxy information</h1>
            {error && <Alert key="error" variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            <Table striped bordered>
                <tbody>
                    <tr>
                        <th>Address</th>
                        <td>{props.address}</td>
                    </tr>
                    <tr>
                        <th>Balance</th>
                        <td>{balance}</td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td>
                            {owner === NULL_ADDRESS ? <i>&lt;none&gt;</i> : owner}
                        </td>
                    </tr>
                </tbody>
            </Table>
            {proxyManager && account && owner === NULL_ADDRESS && (
                <Button onClick={claimProxy}>Claim proxy</Button>
            )}
        </div>
    );
};
