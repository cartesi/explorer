// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import {
    AppstoreOutlined,
    ThunderboltOutlined,
    WalletOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

export interface SidebarProps {}

const Sidebar = (props: SidebarProps) => {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const items = [
        {
            key: 'staking',
            label: 'Staking',
            href: '/staking',
            icon: <WalletOutlined />,
        },
        {
            key: 'nodes',
            label: 'Nodes',
            href: '/nodes',
            icon: <AppstoreOutlined />,
        },
        {
            key: 'descartes',
            label: 'Descartes',
            href: '/descartes',
            icon: <ThunderboltOutlined />,
        },
        {
            key: 'blocks',
            label: 'Blocks',
            href: '/blocks',
            icon: <DatabaseOutlined />,
        },
    ];

    // use router to figure out the active item
    const selectedKeys = items
        .filter((item) => router.route.startsWith(item.href))
        .map((item) => item.key);

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="md"
        >
            <div className={styles.logo}></div>
            <Menu theme="dark" selectedKeys={selectedKeys}>
                {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link href={item.href}>
                            <a>{item.label}</a>
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default Sidebar;
