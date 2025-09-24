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
    Center,
    Flex,
    FlexProps,
    StackProps,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import {
    useCartesiTokenContract,
    usePoSContract,
    useSimpleFaucetContract,
    useStakingContract,
    useStakingPoolFactoryContract,
    useWorkerManagerContract,
} from '../services/contracts';
import Footer from './Footer';
import { Header } from './header';
import SyncStatus from './SyncStatus';
import { useColorModeValue } from './ui/color-mode';
import type { Route } from 'next';

interface ComponentProps {
    children: React.ReactNode;
}

export const PageHeader: FC<ComponentProps> = ({ children }) => (
    <Box w="100%" bg="dark.gray.tertiary" color="white" px="6vw" py={5}>
        {children}
    </Box>
);

export interface PagePanelProps extends ComponentProps {
    darkModeColor?: string;
}

export const PagePanel: FC<PagePanelProps> = ({
    children,
    darkModeColor = 'gray.700',
    ...restProps
}) => {
    const bg = useColorModeValue('white', darkModeColor);
    const bgHeader = useColorModeValue('white', 'gray.800');
    return (
        <Center
            bgGradient={`linear(to-b, gray.900 0%, gray.900 50%, ${bgHeader} 50%, ${bgHeader} 100%)`}
            {...restProps}
        >
            <Box bg={bg} w="100%" shadow="md">
                {children}
            </Box>
        </Center>
    );
};

export const PageBody: FC<StackProps> = ({ children, ...restProps }) => (
    <VStack px="6vw" py={5} align="stretch" {...restProps}>
        {children}
    </VStack>
);

export const ResponsiveDebug: FC = () => {
    const color = useBreakpointValue(['yellow', 'red', 'green', 'blue']);
    const size = useBreakpointValue(['sm', 'md', 'lg', 'xl']);
    const index = useBreakpointValue([0, 1, 2, 3]);
    return (
        <Center w="100%" minH={50} bg={color}>
            <Text>
                {size} [{index}]
            </Text>
        </Center>
    );
};

interface PageLayoutProps extends FlexProps {
    children: React.ReactNode;
}

interface HeaderLink {
    key: string;
    label: string;
    href: Route;
}

export const headerLinks: HeaderLink[] = [
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
];

export const footerLinks = [
    {
        label: 'Governance & Grants',
        href: 'https://cartesi.io/governance/',
    },
    {
        label: 'Audit Report',
        href: 'https://github.com/cartesi/pos-dlib/raw/develop/Smart%20Contract%20Security%20Audit%20Report%20-%20Staking.pdf',
    },
    {
        label: 'How to Run a Node',
        href: 'https://docs.cartesi.io/earn-ctsi/run-node/',
    },
];

export const footerSupport = [
    {
        label: `What's New`,
        href: 'https://cartesi.io/blog/',
    },
    {
        label: 'Support on Discord',
        href: 'https://discord.com/invite/pfXMwXDDfW',
    },
    {
        label: 'FAQ',
        href: 'https://docs.cartesi.io/earn-ctsi/staking-faq/',
    },
    {
        label: 'Governance Forum',
        href: 'https://governance.cartesi.io/',
    },
];

export const footerGeneral = [
    {
        label: 'About Us',
        href: 'https://cartesi.io/about/',
    },
    {
        label: 'Docs',
        href: 'https://docs.cartesi.io/',
    },
];

const PageLayout: FC<PageLayoutProps> = ({ children, ...restProps }) => {
    const bg = useColorModeValue('white', 'dark.gray.primary');
    const contentBg = useColorModeValue('white', 'dark.gray.quaternary');
    const pos = usePoSContract();
    const token = useCartesiTokenContract();
    const faucet = useSimpleFaucetContract();
    const staking = useStakingContract();
    const workerManager = useWorkerManagerContract();
    const poolFactory = useStakingPoolFactoryContract();

    const footerContracts = [
        {
            name: 'Token',
            address: token?.address,
        },
        {
            name: 'Faucet',
            address: faucet?.address,
        },
        {
            name: 'PoS',
            address: pos?.address,
        },
        {
            name: 'Staking',
            address: staking?.address,
        },
        {
            name: 'Worker Manager',
            address: workerManager?.address,
        },
        {
            name: 'Pool Factory',
            address: poolFactory?.address,
        },
    ];

    return (
        <Flex
            direction="column"
            align="center"
            m="0 auto"
            minHeight="100vh"
            bg={bg}
            {...restProps}
        >
            <Header links={headerLinks} />
            <Box width="100%" paddingTop="100px" bg={contentBg}>
                <>
                    <SyncStatus />
                    {children}
                </>
            </Box>
            <Footer
                links={footerLinks}
                support={footerSupport}
                general={footerGeneral}
                contracts={footerContracts}
            />
        </Flex>
    );
};

export default PageLayout;
