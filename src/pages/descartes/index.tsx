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
import { Breadcrumb, Result } from 'antd';
import Layout from '../../components/Layout';

export interface NodesProps {
    localNode: Node;
    nodes: Node[];
}

const Descartes = (props: NodesProps) => {
    const { localNode, nodes } = props;

    return (
        <Layout>
            <Head>
                <title>Descartes</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Descartes</Breadcrumb.Item>
            </Breadcrumb>
            <Result status="warning" title="Under construction" />
        </Layout>
    );
};

export default Descartes;
