// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { formatEther } from '@ethersproject/units';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import {
    useBalance,
    useProxyManager,
    useAccount,
} from '../utils/ethereum';

export interface ProxyProps {
    address: string;
}

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const Proxy = (props: ProxyProps) => {
    const account = useAccount(0);
    const balance = useBalance(props.address);

    const {
        proxyManager,
        owner,
        error,
        loading,
        submitting,
        claimProxy,
        releaseProxy,
    } = useProxyManager(props.address);
    // const proxies: any[] = [];

    return (
        <div>
            <h1>Proxy information</h1>
            {error && (
                <Alert key="error" variant="danger">
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
                        <td>{formatEther(balance)} ETH</td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td>
                            {loading && (
                                <Spinner animation="border" size="sm" />
                            )}
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
                <Button onClick={claimProxy}>
                    {submitting && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                    Claim proxy
                </Button>
            )}
            {proxyManager && account && owner === account && (
                <Button onClick={releaseProxy}>
                    {submitting && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                    Release proxy
                </Button>
            )}
        </div>
    );
};
