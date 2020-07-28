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
import { Breadcrumb } from 'antd';
import Layout from '../../components/Layout';

export interface NodesProps {
    localNode: string;
    nodes: string[];
}

export default (props: NodesProps) => {
    const { localNode, nodes } = props;
    const router = useRouter();
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
            <h1>Local node</h1>
            <ul>
                <li key={localNode}>
                    <Link href={`/nodes/${localNode}`}>
                        <a>{localNode}</a>
                    </Link>
                </li>
            </ul>
            <h1>Cartesi PaaS nodes</h1>
            <ul>
                {nodes.map((address) => (
                    <li key={address}>
                        <Link href={`/nodes/${address}`}>
                            <a>{address}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export const getServerSideProps = async () => {
    // XXX: query PaaS API to get free nodes
    const nodes = [
        '0xD9C0550FC812bf53F6952d48FB2039DEed6f941D',
        '0x5B0132541eB13e2Df4F0816E4a47ccF3ac516AE5',
        '0x33D8888065a149349Cf65f3cd192d4A3C89ca3Ba'
    ];

    // XXX: query local node to get its address
    const localNode = '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0';

    return { props: { localNode, nodes } };
};
