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
import { Breadcrumb, Divider, List, Typography, Table } from 'antd';
import Layout from '../../components/Layout';
import { Node, getLocalNode, getPaaSNodes } from '../../services/node';
import { IChainData } from '../../services/chain';

export interface NodesProps {
    localNode: Node;
    nodes: Node[];
}

export default (props: NodesProps) => {
    const { localNode, nodes } = props;
    
    const addressRender = (address: string) => (
        <List.Item>
            <Link href={`/nodes/${address}`}>
                <a>{address}</a>
            </Link>
        </List.Item>
    );

    const networkRender = (network: IChainData) =>
        network.name == 'Unknown'
            ? `${network.name} (${network.chainId})`
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
                    <Link href="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Nodes</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                dataSource={localNodeDS}
                pagination={false}
                columns={columns}
                bordered
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
                        Cartesi PaaS nodes
                    </Typography.Title>
                )}
                dataSource={nodesDS}
            />
        </Layout>
    );
};

export const getServerSideProps = async () => {
    // XXX: query PaaS API to get free nodes
    const nodes = await getPaaSNodes();

    // const localNode = { address: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0', chainId: 30137 };
    const localNode = await getLocalNode();

    return { props: { localNode, nodes } };
};
