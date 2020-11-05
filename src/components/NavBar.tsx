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
import styles from './NavBar.module.scss';

const { Header } = Layout;

export interface NavBarProps {}

const NavBar = (props: NavBarProps) => {
    const router = useRouter();

    const items = [
        {
            key: 'staking',
            label: 'Staking',
            href: '/staking',
        },
        {
            key: 'nodes',
            label: 'Nodes',
            href: '/nodes',
        },
        {
            key: 'descartes',
            label: 'Descartes',
            href: '/descartes',
        },
        {
            key: 'blocks',
            label: 'Blocks',
            href: '/blocks',
        },
    ];

    // use router to figure out the active item
    const selectedKeys = items
        .filter((item) => router.route.startsWith(item.href))
        .map((item) => item.key);

    return (
        <Header className={styles.header}>
            <Link href="/">
                <div className={styles.logo}></div>
            </Link>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={selectedKeys}
                className={styles.navbar}
                style={{ background: 'transparent' }}
            >
                {items.map((item) => (
                    <Link href={item.href} key={item.key}>
                        <a className={styles.navbarItem}>{item.label}</a>
                    </Link>
                ))}
            </Menu>
            <div style={{ width: '200px' }} />
        </Header>
    );
};

export default NavBar;
