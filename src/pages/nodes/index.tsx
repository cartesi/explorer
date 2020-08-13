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
import { Breadcrumb, Divider, List, Typography } from 'antd';
import Layout from '../../components/Layout';
import { Node, getLocalNode } from '../../services/node';

export interface NodesProps {
    localNode: Node;
    nodes: Node[];
}

export default (props: NodesProps) => {
    const { localNode, nodes } = props;
    const nodeRender = (item: Node) => (
        <List.Item>
            <Link href={`/nodes/${item.address}`}>
                <a>{item.address}</a>
            </Link>
        </List.Item>
    );

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
            <List
                header={
                    <Typography.Title level={4}>Local node</Typography.Title>
                }
                dataSource={localNode ? [localNode] : []}
                renderItem={nodeRender}
            />
            <Divider />
            <List
                header={
                    <Typography.Title level={4}>
                        Cartesi PaaS nodes
                    </Typography.Title>
                }
                dataSource={nodes}
                renderItem={nodeRender}
            />
        </Layout>
    );
};

export const getServerSideProps = async () => {
    // XXX: query PaaS API to get free nodes
    const nodes = [
        '0xD9C0550FC812bf53F6952d48FB2039DEed6f941D',
        '0x5B0132541eB13e2Df4F0816E4a47ccF3ac516AE5',
        '0x33D8888065a149349Cf65f3cd192d4A3C89ca3Ba',
    ].map(address => ({ address, chainId: 30137 }));

    // XXX: query local node to get its address
    // const localNode = { address: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0', chainId: 30137 };
    const localNode = await getLocalNode();

    return { props: { localNode, nodes } };
};
