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
import { AppstoreOutlined, ThunderboltOutlined } from '@ant-design/icons';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

export interface SidebarProps {
}

const Sidebar = (props: SidebarProps) => {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const items = [
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
    ];

    // XXX: use router to figure out the active item
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className={styles.logo}></div>
            <Menu theme="dark" defaultSelectedKeys={[items[0].key]}>
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
