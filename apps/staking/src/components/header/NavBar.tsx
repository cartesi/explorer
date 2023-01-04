// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, ReactNode } from 'react';
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    FlexProps,
    HStack,
    IconButton,
    Link,
    Stack,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useWallet } from '../../contexts/wallet';
import Account from './Account';
import AccountMobile from './AccountMobile';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';
import SelectedChain from './SelectedChain';

export const buildLinks = () => [
    {
        key: 'home',
        label: 'Home',
        href: '/',
    },
    {
        key: 'stake',
        label: 'Stake',
        href: '/stake',
    },
    {
        key: 'runners',
        label: 'Node Runners',
        href: '/node-runners',
    },
    {
        key: 'blocks',
        label: 'Blocks',
        href: '/blocks',
    },
    {
        key: 'rollups',
        label: 'Rollups',
        href: '/rollups',
    },
];

export interface NavLinkProps {
    href: string;
    children: ReactNode;
}

export const NavLink: FC<NavLinkProps> = ({ href, children }) => (
    <NextLink href={href} passHref>
        <Link
            px={2}
            py={1}
            _hover={{
                textDecoration: 'none',
                bg: 'gray.800',
            }}
        >
            {children}
        </Link>
    </NextLink>
);

const NavBar: FC<FlexProps> = (props) => {
    // color mode switcher
    const { colorMode, toggleColorMode } = useColorMode();
    const links = buildLinks();
    const wallet = useWallet();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box bg="gray.900" color="white" px="6vw" position="fixed" {...props}>
            <Flex h="100px" alignItems="center" justifyContent="space-between">
                <HStack
                    spacing={8}
                    alignItems="center"
                    data-testid="links-container"
                >
                    <Logo mr={{ base: 0, sm: 2 }} />
                    <SelectedChain display={{ base: 'none', md: 'flex' }} />
                    <HStack
                        as="nav"
                        spacing={{ base: '4', md: '6' }}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {links.map(({ key, label, href }) => (
                            <NavLink key={key} href={href}>
                                {label}
                            </NavLink>
                        ))}
                    </HStack>
                </HStack>

                <Flex alignItems="center">
                    <IconButton
                        size="sm"
                        bg="transparent"
                        borderRadius="full"
                        mx={2}
                        _hover={{ bg: 'gray.800' }}
                        aria-label="Toggle dark mode"
                        data-testid="theme-toggle-button"
                        icon={
                            colorMode === 'light' ? <MoonIcon /> : <SunIcon />
                        }
                        onClick={toggleColorMode}
                    />

                    <ConnectWallet
                        display={{ base: 'none', md: 'flex' }}
                        wallet={wallet}
                    />

                    <IconButton
                        size="md"
                        bg="transparent"
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label="Open Menu"
                        data-testid="menu-button"
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                        _hover={{ bg: 'gray.800' }}
                    />
                    <Box display={{ base: 'none', md: 'flex' }}>
                        <Account />
                    </Box>
                </Flex>
            </Flex>

            {isOpen && (
                <Box pb={5} display={{ md: 'none' }} data-testid="mobile-menu">
                    <Stack as="nav" spacing={4}>
                        {links.map(({ label, key, href }) => (
                            <NavLink key={key} href={href}>
                                {label}
                            </NavLink>
                        ))}
                        <AccountMobile />

                        <ConnectWallet
                            wallet={wallet}
                            onClick={isOpen ? onClose : onOpen}
                        />
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default NavBar;
