// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { formatEther } from '@ethersproject/units';
import { Alert, Breadcrumb, Button, Descriptions, Spin } from 'antd';
import { useBalance, useAccount, NULL_ADDRESS } from '../../services/eth';
import { useWorkerManager } from '../../services/workerManager';
import Layout from '../../components/Layout';
import WaitingConfirmations from '../../components/WaitingConfirmations';

import { DataContext } from '../../components/DataContext';

const Node = () => {
    const router = useRouter();
    let { address } = router.query;
    address = address as string;
    const account = useAccount(0);
    
    const [waiting, setWaiting] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    const {
        user,
        available,
        pending,
        owned,
        retired,
        loading,
        hire,
        cancelHire,
        retire,
    } = useWorkerManager(address);

    const {
        submitting,
        error: txError,
    } = useContext(DataContext);

    useEffect(() => {
        setWaiting(submitting);
        setError(txError);
    }, [submitting, txError]);

    // make balance depend on owner, so if it changes we update the balance
    const balance = useBalance(address, [user]);

    return (
        <Layout>
            <Head>
                <title>Nodes</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href="/nodes">
                        <a>Nodes</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{address}</Breadcrumb.Item>
            </Breadcrumb>
            {error && (
                <Alert
                    key="error"
                    message={error}
                    type="error"
                    style={{ marginBottom: '16px' }}
                />
            )}

            {waiting &&
                <WaitingConfirmations />
            }

            <Descriptions
                bordered
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label="Address">{address}</Descriptions.Item>
                <Descriptions.Item label="Balance">
                    {formatEther(balance)} ETH
                </Descriptions.Item>
                <Descriptions.Item label="Owner">
                    {loading && <Spin />}
                    {user === NULL_ADDRESS ? <i>&lt;none&gt;</i> : user}{' '}
                    {pending && <i>(pending)</i>}
                    {retired && <i>(retired)</i>}
                </Descriptions.Item>
            </Descriptions>
            {account && available && (
                <Button
                    onClick={hire}
                    type="primary"
                    style={{ marginTop: '16px' }}
                    loading={submitting}
                >
                    Hire node
                </Button>
            )}
            {account && pending && (
                <Button
                    onClick={cancelHire}
                    type="primary"
                    style={{ marginTop: '16px' }}
                    loading={submitting}
                >
                    Cancel hire
                </Button>
            )}
            {account && owned && (
                <Button
                    onClick={retire}
                    type="primary"
                    style={{ marginTop: '16px' }}
                    loading={submitting}
                >
                    Retire node
                </Button>
            )}
        </Layout>
    );
};

export default Node;
