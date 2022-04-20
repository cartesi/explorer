// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, Heading, Stack, HStack, Text } from '@chakra-ui/react';
import { AiOutlineLeft } from 'react-icons/ai';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';

const NewNode: FC = () => {
    return (
        <Layout>
            <Head>
                <title>Cartesi - New Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <Link href="/newStaking" passHref>
                    <Box as="a" display="flex" alignItems="center">
                        <Box as={AiOutlineLeft} mr={1} />
                        <Text>Back</Text>
                    </Box>
                </Link>
            </HStack>
            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={0}
                pb={5}
            >
                <Stack alignItems={'flex-start'} direction={'row'}>
                    <Heading as="h1" fontSize={{ base: '4xl', xl: '5xl' }}>
                        Create a Pool
                    </Heading>
                </Stack>
            </Box>
            <Box
                px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 8, sm: '3vw' }}
                pb={{ base: 8, sm: '5vw' }}
            >
                <Heading as="h1" py="10%">
                    New Pool Wizzard Goes Here
                </Heading>
            </Box>
        </Layout>
    );
};

export default NewNode;
