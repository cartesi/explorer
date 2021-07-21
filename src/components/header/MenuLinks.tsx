// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import MenuItem from './MenuItem';

export interface MenuLinksProps {
    isOpen: boolean;
}

const MenuLinks: FunctionComponent<MenuLinksProps> = ({ isOpen }) => {
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
    const router = useRouter();
    const selectedKeys = items
        .filter((item) => router.route.startsWith(item.href))
        .map((item) => item.key);

    return (
        <Box
            display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
            flexBasis={{ base: '100%', md: 'auto' }}
        >
            <Stack
                spacing={8}
                align="center"
                justify={['center', 'space-between', 'flex-end', 'flex-end']}
                direction={['column', 'row', 'row', 'row']}
                pt={[4, 4, 0, 0]}
            >
                {items.map(({ href, key, label }) => (
                    <MenuItem
                        to={href}
                        key={key}
                        selected={selectedKeys.includes(key)}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Stack>
        </Box>
    );
};

export default MenuLinks;
