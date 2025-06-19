// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    BoxProps,
    Flex,
    HStack,
    Icon,
    IconButton,
    Link,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { useWallet } from '../wallet';
import { Account } from './Account';
import AccountMobile from './AccountMobile';
import { TbMoonFilled, TbSun, TbX, TbMenu2 } from 'react-icons/tb';
import { ConnectWallet } from './ConnectWallet';
import { Logo } from './Logo';
import { SelectedChain } from './SelectedChain';
import { useColorModeValue, useColorMode } from '../ui/color-mode';

export interface NavLinkProps {
    href: string;
    children: ReactNode;
}

export const NavLink: FC<NavLinkProps> = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    const bg = useColorModeValue('dark.secondary', 'dark.primary');
    const pseudoProps = {
        content: '""',
        bottom: '-5px',
        transform: 'translateX(-50%)',
        left: '50%',
        position: 'absolute',
        width: 'calc(100% - 16px)',
        height: '0.3125rem',
        bg,
    };

    return (
        <Link
            asChild
            position="relative"
            px={2}
            py={1}
            width="fit-content"
            aria-current={isActive ? 'page' : undefined}
            color="white"
            _hover={{
                textDecoration: 'none',
                _after: pseudoProps,
            }}
            _after={isActive ? pseudoProps : undefined}
        >
            <NextLink href={href}>{children}</NextLink>
        </Link>
    );
};

export interface HeaderLink {
    key: string;
    label: string;
    href: string;
}

export interface NavBarProps extends BoxProps {
    links: HeaderLink[];
}

export const NavBar: FC<NavBarProps> = ({ links, ...props }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const wallet = useWallet();
    const { open, onOpen, onClose } = useDisclosure();

    return (
        <Box
            bg="dark.gray.tertiary"
            color="white"
            px="6vw"
            position="fixed"
            {...props}
        >
            <Flex h="100px" alignItems="center" justifyContent="space-between">
                <HStack
                    gap={8}
                    alignItems="center"
                    data-testid="links-container"
                >
                    <Logo mr={{ base: 0, sm: 2 }} mt={2} />
                    <SelectedChain display={{ base: 'none', md: 'flex' }} />
                    <HStack
                        as="nav"
                        gap={{ base: '4', md: '6' }}
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
                        rounded="full"
                        mx={2}
                        h={8}
                        w={8}
                        _hover={{ bg: 'gray.800' }}
                        aria-label="Toggle dark mode"
                        data-testid="theme-toggle-button"
                        onClick={toggleColorMode}
                    >
                        {colorMode === 'light' ? (
                            <Icon as={TbMoonFilled} />
                        ) : (
                            <Icon as={TbSun} color="white" />
                        )}
                    </IconButton>

                    <ConnectWallet
                        display={{ base: 'none', md: 'flex' }}
                        wallet={wallet}
                    />

                    <IconButton
                        size="md"
                        bg="transparent"
                        aria-label="Open Menu"
                        data-testid="menu-button"
                        display={{ md: 'none' }}
                        h={10}
                        w={10}
                        onClick={open ? onClose : onOpen}
                        _hover={{ bg: 'gray.800' }}
                    >
                        {open ? (
                            <TbX color="white" />
                        ) : (
                            <TbMenu2 color="white" />
                        )}
                    </IconButton>
                    <Box display={{ base: 'none', md: 'flex' }}>
                        <Account />
                    </Box>
                </Flex>
            </Flex>

            {open && (
                <Box pb={5} display={{ md: 'none' }} data-testid="mobile-menu">
                    <Stack as="nav" gap={4}>
                        {links.map(({ label, key, href }) => (
                            <NavLink key={key} href={href}>
                                {label}
                            </NavLink>
                        ))}
                        <AccountMobile />

                        <ConnectWallet
                            wallet={wallet}
                            onClick={open ? onClose : onOpen}
                        />
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
