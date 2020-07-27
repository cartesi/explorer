// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import styles from './Sidebar.module.css';
const { Sider } = Layout;

export interface SidebarProps {
    // collapsed: boolean;
}

const Sidebar = (props: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className={styles.logo}></div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['proxy']}>
                <Menu.Item key="proxy">Proxies</Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
