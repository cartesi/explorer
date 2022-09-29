// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect } from 'react';
import Head from 'next/head';
import { Box, Heading, Stack, HStack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AiOutlineLeft } from 'react-icons/ai';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useWallet } from '../../../contexts/wallet';
import { PoolManageContainer } from '../../../containers/pool-manage/PoolManageContainer';
import Address from '../../../components/Address';

const PoolNode: FC = () => {
    const { chainId, active } = useWallet();
    const router = useRouter();
    const address = router.query.pool as string;

    useEffect(() => {
        if (!active) router.replace('/newStaking');
    }, [active, router]);

    return (
        <Layout>
            <Head>
                <title>Explorer - Manage Public Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <NextLink href="/newStaking" passHref>
                    <Box as="a" display="flex" alignItems="center">
                        <Box as={AiOutlineLeft} mr={1} />
                        <Text>Back</Text>
                    </Box>
                </NextLink>
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
                        {address && (
                            <Address
                                address={address}
                                chainId={chainId}
                                ens
                                truncated
                                fontSize={'3xl'}
                            />
                        )}
                    </Heading>
                </Stack>
            </Box>

            <PoolManageContainer address={address} />
        </Layout>
    );
};

export default PoolNode;
