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
import Table from 'react-bootstrap/Table';
import {
    useBalance,
    useAccount,
    useUserProxies,
} from '../utils/ethereum';

export interface UserProps {
    address: string;
}

export const User = (props: UserProps) => {
    const account = useAccount(0);
    const userBalance = useBalance(account);

    const proxies = useUserProxies(props.address, account);

    return (
        <div>
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
                    {proxies.length === 0 && (
                        <tr>
                            <td>
                                <i>No proxies</i>
                            </td>
                        </tr>
                    )}
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
