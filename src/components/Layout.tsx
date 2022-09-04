// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
    VStack,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import SyncStatus from './SyncStatus';

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

export const PageHeader: FC = ({ children }) => (
    <Box w="100%" bg="gray.900" color="white" px="6vw" py={5}>
        {children}
    </Box>
);

export const PagePanel: FC = ({ children, ...restProps }) => {
    const bg = useColorModeValue('white', 'gray.700');
    const bgHeader = useColorModeValue('white', 'gray.800');
    return (
        <Center
            bgGradient={`linear(to-b, gray.900 0%, gray.900 50%, ${bgHeader} 50%, ${bgHeader} 100%)`}
            {...restProps}
        >
            <Box bg={bg} w="100%" shadow="lg">
                {children}
            </Box>
        </Center>
    );
};

export const PageBody: FC = ({ children }) => (
    <VStack px="6vw" py={5} align="stretch" spacing={5}>
        {children}
    </VStack>
);

const Layout = ({ children }) => {
    return (
        <Flex direction="column" align="center" m="0 auto">
            <Header />
            <Box width="100%" paddingTop="100px">
                <SyncStatus />
                {children}
            </Box>
            <Footer />
        </Flex>
    );
};

export default Layout;
