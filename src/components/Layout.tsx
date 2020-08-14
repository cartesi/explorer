// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';

import { Layout } from 'antd';
import Sidebar from './Sidebar';
import SelectedChain from './SelectedChain';
import styles from './Layout.module.css';

const { Content, Footer, Header } = Layout;

export default ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Header>
                    <SelectedChain />
                </Header>
                <Content className={styles.layoutContent}>{children}</Content>
                <Footer>Copyright (C) 2020 Cartesi Pte. Ltd.</Footer>
            </Layout>
        </Layout>
    );
};
