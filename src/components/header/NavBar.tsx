// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, ReactNode } from 'react';
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
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useFlag } from '@unleash/proxy-client-react';

import Logo from './Logo';
import SelectedChain from './SelectedChain';
import ConnectMetamask from './ConnectMetamask';
import ConnectWallet from './ConnectWallet';
import Account from './Account';
import { useWallet } from '../../contexts/wallet';

const Links = [
    {
        key: 'home',
        label: 'Home',
        href: '/',
    },
    {
        key: 'staking',
        label: 'Node Runners',
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
];

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: 'gray.800',
        }}
        href={href}
    >
        {children}
    </Link>
);

const NavBar: FC<FlexProps> = (props) => {
    // color mode switcher
    const { colorMode, toggleColorMode } = useColorMode();
    const multiWalletEnabled = useFlag('multiWalletEnabled');
    const wallet = useWallet();

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box
            bg="black"
            color="white"
            px="6vw"
            position="fixed"
            opacity={isOpen ? 1 : 0.9}
            {...props}
        >
            <Flex h="100px" alignItems="center" justifyContent="space-between">
                <IconButton
                    size="md"
                    bg="transparent"
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                    _hover={{ bg: 'gray.800' }}
                />
                <HStack spacing={8} alignItems="center">
                    <Logo />
                    <SelectedChain display={{ base: 'none', md: 'flex' }} />
                    <HStack
                        as="nav"
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {Links.map(({ key, label, href }) => (
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
                        mx={2}
                        _hover={{ bg: 'gray.800' }}
                        aria-label="Toggle dark mode"
                        icon={
                            colorMode === 'light' ? <MoonIcon /> : <SunIcon />
                        }
                        onClick={toggleColorMode}
                    />
                    {!multiWalletEnabled && (
                        <ConnectMetamask
                            display={{ base: 'none', md: 'flex' }}
                            wallet={wallet}
                        />
                    )}

                    {multiWalletEnabled && (
                        <ConnectWallet
                            display={{ base: 'none', md: 'flex' }}
                            wallet={wallet}
                        />
                    )}

                    <Account />
                </Flex>
            </Flex>
            {isOpen && (
                <Box pb={5} display={{ md: 'none' }}>
                    <Stack as="nav" spacing={4}>
                        {Links.map(({ label, key, href }) => (
                            <NavLink key={key} href={href}>
                                {label}
                            </NavLink>
                        ))}
                        {!multiWalletEnabled && (
                            <ConnectMetamask wallet={wallet} />
                        )}
                        {multiWalletEnabled && (
                            <ConnectWallet wallet={wallet} />
                        )}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default NavBar;
