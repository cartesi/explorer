// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import {
    Box,
    Heading,
    Input,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';

import Layout, { PageHeader, PagePanel, PageBody } from '../components/Layout';

const Home = () => {
    return (
        <Layout>
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <Box w="100%">
                    <Heading>Page Title</Heading>
                </Box>
            </PageHeader>
            <PagePanel>
                <Box w="100%" h={100}>
                    <Heading>Header Panel</Heading>
                </Box>
            </PagePanel>
            <PageBody>
                <Heading>Subtitle</Heading>
                <Input></Input>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Column 1</Th>
                            <Th>Column 2</Th>
                            <Th>Column 3</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Value 1</Td>
                            <Td>Value 2</Td>
                            <Td>Value 3</Td>
                        </Tr>
                        <Tr>
                            <Td>Value 1</Td>
                            <Td>Value 2</Td>
                            <Td>Value 3</Td>
                        </Tr>
                        <Tr>
                            <Td>Value 1</Td>
                            <Td>Value 2</Td>
                            <Td>Value 3</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </PageBody>
        </Layout>
    );
};

export default Home;
