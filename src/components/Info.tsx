// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { formatEther, parseUnits } from '@ethersproject/units';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {
    useBalance,
    useProxyManager,
    useAccount,
    useUserProxies,
} from '../utils/ethereum';

export interface InfoProps {
    address: string;
}

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const Info = (props: InfoProps) => {
    const account = useAccount(0);
    const proxyBalance = useBalance(props.address);
    const userBalance = useBalance(account);

    const [error, setError] = useState<string>('');
    const proxyManager = useProxyManager();
    const [owner, setOwner] = useState<string>('');
    const proxies = useUserProxies(account);

    useEffect(() => {
        if (proxyManager) {
            proxyManager.getUser(props.address).then(setOwner);
        }
    }, [props.address, proxyManager, account]);

    const claimProxy = () => {
        if (proxyManager && account) {
            const value = parseUnits('1', 'finney');
            proxyManager
                .claimProxy(props.address, { value })
                .then((_tr) => {
                    // query owner again
                    proxyManager.getUser(props.address).then(setOwner);
                })
                .catch((e) => {
                    setError(e.message);
                    console.error(e.code, e.message, e.stack);
                });
        }
    };

    const releaseProxy = () => {
        if (proxyManager && account) {
            proxyManager
                .freeProxy(props.address, [])
                .then((_tr) => {
                    // query owner again
                    proxyManager.getUser(props.address).then(setOwner);
                })
                .catch((e) => {
                    setError(e.message);
                    console.error(e);
                });
        }
    };

    return (
        <div>
            <h1>Proxy information</h1>
            {error && (
                <Alert
                    key="error"
                    variant="danger"
                    onClose={() => setError('')}
                    dismissible
                >
                    {error}
                </Alert>
            )}
            <Table striped bordered>
                <tbody>
                    <tr>
                        <th>Address</th>
                        <td>{props.address}</td>
                    </tr>
                    <tr>
                        <th>Balance</th>
                        <td>{formatEther(proxyBalance)} ETH</td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td>
                            {owner === NULL_ADDRESS ? (
                                <i>&lt;none&gt;</i>
                            ) : (
                                owner
                            )}{' '}
                            {owner === account && owner !== NULL_ADDRESS && (
                                <i>(you)</i>
                            )}
                        </td>
                    </tr>
                </tbody>
            </Table>
            {proxyManager && account && owner === NULL_ADDRESS && (
                <Button onClick={claimProxy}>Claim proxy</Button>
            )}
            {proxyManager && account && owner === account && (
                <Button onClick={releaseProxy}>Release proxy</Button>
            )}

            <h1>User information</h1>
            <Table striped bordered>
                <tbody>
                    <tr>
                        <th>Address</th>
                        <td>{account}</td>
                    </tr>
                    <tr>
                        <th>Balance</th>
                        <td>{formatEther(userBalance)} ETH</td>
                    </tr>
                </tbody>
            </Table>

            <h2>Proxies</h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {proxies.map((proxy) => (
                        <tr key={proxy}>
                            <td>
                                {proxy}{' '}
                                {proxy === props.address && <i>(this)</i>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
