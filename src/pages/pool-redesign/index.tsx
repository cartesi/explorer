// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';

import Layout from '../../components/Layout';
import { Box, Stack, VStack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import AddressText from '../../components/AddressText';
import { StakingGuide } from '../../components/poolRedesign/StakingGuide';
import { StakingTabNavigation } from '../../components/poolRedesign/StakingTabNavigation';
import { StakingWalletConnect } from '../../components/poolRedesign/StakingWalletConnect';
import { useColorModeValue } from '@chakra-ui/react';
import { StakingActivity } from '../../components/poolRedesign/StakingActivity';
import { Staking } from '../../components/poolRedesign/Staking';
import { StakingDashboard } from '../../components/poolRedesign/StakingDashboard';

const poolRedesign = () => {
    const bg = useColorModeValue('gray.50', 'header');

    const [isConnected, setIsConnected] = useState(false);

    const onConnect = (value) => {
        console.log('onConnect', value);
        setIsConnected(true);
    };

    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={5}
            >
                <Stack
                    justify="space-between"
                    alignItems={{ base: 'flex-start', lg: 'flex-end' }}
                    direction={{ base: 'column', lg: 'row' }}
                >
                    <VStack alignItems="flex-start" pb="5">
                        <Button
                            href="/pools"
                            as="a"
                            leftIcon={<ArrowBackIcon />}
                            variant="text"
                            size="sm"
                            pl="0"
                        >
                            Staking pool
                        </Button>

                        <AddressText
                            address="0xaf921c4ac53354b2a915ff5b3b9771ed01a7e5ec"
                            chainId={1}
                            // icon={FaUsers}
                            fontSize={['xl', '3xl']}
                        />
                    </VStack>

                    <StakingTabNavigation />
                </Stack>
            </Box>

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                {isConnected ? <StakingDashboard /> : <StakingGuide />}
            </Box>

            <Box
                bg={bg}
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                {isConnected ? (
                    <Staking />
                ) : (
                    <StakingWalletConnect onConnect={onConnect} />
                )}
            </Box>

            {isConnected && (
                <Box
                    px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                    py={{ base: 8, sm: 12, lg: 16 }}
                >
                    <StakingActivity />
                </Box>
            )}
        </Layout>
    );
};

export default poolRedesign;
