// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { formatEther } from '@ethersproject/units';
import { Alert, Breadcrumb, Button, Descriptions, Spin } from 'antd';
import { useBalance, useAccount, NULL_ADDRESS } from '../../services/eth';
import { useProxyManager } from '../../services/proxyManager';
import Layout from '../../components/Layout';

export default () => {
    const router = useRouter();
    let { address } = router.query;
    address = address as string;
    const account = useAccount(0);

    const {
        owner,
        error,
        loading,
        submitting,
        claimProxy,
        releaseProxy,
    } = useProxyManager(address);

    // make balance depend on owner, so if it changes we update the balance
    const balance = useBalance(address, [owner]);

    return (
        <Layout>
            <Head>
                <title>Nodes</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link href="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href="/nodes">Nodes</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{address}</Breadcrumb.Item>
            </Breadcrumb>
            {error && <Alert key="error" message={error} type="error" />}
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
                    {owner === NULL_ADDRESS ? <i>&lt;none&gt;</i> : owner}{' '}
                    {owner === account && owner !== NULL_ADDRESS && (
                        <i>(you)</i>
                    )}
                </Descriptions.Item>
            </Descriptions>
            {account && owner === NULL_ADDRESS && (
                <Button
                    onClick={claimProxy}
                    type="primary"
                    style={{ marginTop: '16px' }}
                    loading={submitting}
                >
                    Claim node
                </Button>
            )}
            {account && owner === account && (
                <Button
                    onClick={releaseProxy}
                    type="primary"
                    style={{ marginTop: '16px' }}
                    loading={submitting}
                >
                    Release node
                </Button>
            )}
        </Layout>
    );
};
