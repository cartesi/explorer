// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SelectedChain from './SelectedChain';

const NavBar = () => {
    const router = useRouter();

    const items = [
        {
            key: 'home',
            label: 'Home',
            href: '/',
        },
        {
            key: 'staking',
            label: 'Staking',
            href: '/staking',
        },
        {
            key: 'pools',
            label: 'Pools',
            href: '/pools',
        },
        {
            key: 'blocks',
            label: 'Blocks',
            href: '/blocks',
        },
        {
            key: 'calculator',
            label: 'Calculator',
            href: '/calculator',
        },
    ];

    // use router to figure out the active item
    const selectedKeys = items
        .filter((item) => router.route.startsWith(item.href))
        .map((item) => item.key);

    return (
        <nav className="navbar fixed-top navbar-expand-lg">
            <a className="navbar-brand logo my-3" href="https://cartesi.io"></a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#explorerNavbar"
                aria-controls="explorerNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <img className="navbar-hamburger" src="/images/navbar.png" />
            </button>
            <div
                className="navbar-collapse collapse justify-content-end"
                id="explorerNavbar"
            >
                <ul className="navbar-menu navbar-nav">
                    {items.map((item) => (
                        <li className="nav-item" key={item.key}>
                            <Link href={item.href}>
                                <a className="navbar-menu-item">{item.label}</a>
                            </Link>
                        </li>
                    ))}

                    <li className="nav-item navbar-selected-chain">
                        <SelectedChain />
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
