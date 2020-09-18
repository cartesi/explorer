// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Breadcrumb, Divider, Empty, List, Table, Typography } from 'antd';
import Layout from '../../components/Layout';
import { useLocalNode, useCartesiNodes, Node } from '../../services/node';
import { IChainData } from '../../services/chain';

const localNodeUrl = 'http://localhost:8545';

const Nodes = () => {
    const { chainId } = useWeb3React<Web3Provider>();
    const nodes = useCartesiNodes(chainId);
    const localNode = useLocalNode(localNodeUrl);

    const addressRender = (address: string, { network }) => (
        <List.Item>
            {network.chainId == chainId ? (
                <Link href={`/nodes/${address}`}>
                    <a>{address}</a>
                </Link>
            ) : (
                <Typography>{address}</Typography>
            )}
        </List.Item>
    );

    const networkRender = (network: IChainData) =>
        network.name == 'Private'
            ? `${network.name} (chainId ${network.chainId})`
            : network.name;

    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: addressRender,
        },
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
            render: networkRender,
        },
    ];

    const localNodeDS = (localNode ? [localNode] : []).map((node) => ({
        key: node.address,
        address: node.address,
        network: node.chain,
    }));
    const nodesDS = nodes.map((node) => ({
        key: node.address,
        address: node.address,
        network: node.chain,
    }));

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
                <Breadcrumb.Item>Nodes</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                dataSource={localNodeDS}
                pagination={false}
                columns={columns}
                bordered
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={`No local node running at ${localNodeUrl}`}
                        />
                    ),
                }}
                title={() => (
                    <Typography.Title level={4}>Local node</Typography.Title>
                )}
            />
            <Divider />
            <Table
                columns={columns}
                pagination={false}
                bordered
                title={() => (
                    <Typography.Title level={4}>
                        Nodes hosted by Cartesi
                    </Typography.Title>
                )}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={`No nodes available`}
                        />
                    ),
                }}
                dataSource={nodesDS}
            />
        </Layout>
    );
};

export default Nodes;
