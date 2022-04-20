// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import {
    Box,
    Heading,
    VStack,
    Stack,
    Text,
    useColorModeValue,
    Alert,
    Icon,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import Layout from '../../components/Layout';
import { WalletIcon, AllowanceIcon } from '../../components/Icons';
import { Card } from '../../components/Card';
import { SlideInOut } from '../../components/animation/SlideInOut';
import { useWallet } from '../../contexts/wallet';

const CustomText = ({ firstLine, secondLine }) => (
    <Stack
        direction={{ base: 'row', md: 'column' }}
        alignContent="center"
        spacing={{ base: 1, md: 0 }}
    >
        <Text textTransform="uppercase">{firstLine}</Text>
        <Text textTransform="uppercase" ml={[0, 3]}>
            {secondLine}
        </Text>
    </Stack>
);

const NewStaking: FC = () => {
    const bg = useColorModeValue('gray.80', 'header');
    const { active } = useWallet();

    return (
        <Layout>
            <Head>
                <title>Cartesi - New Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                py={5}
            >
                <Stack alignItems={'flex-start'} direction={'row'}>
                    <Heading as="h1" fontSize={['4xl', '5xl']}>
                        Node Runners
                    </Heading>
                </Stack>
            </Box>

            <Box
                bg={bg}
                px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 8, sm: '3vw' }}
                pb={{ base: 8, sm: '5vw' }}
            >
                <VStack align="stretch" px={{ base: '3vw', md: '9vw' }}>
                    <Heading fontSize={{ base: 'lg', md: '2xl' }} mb="3vw">
                        Create a node or pool in steps
                    </Heading>
                    <Stack
                        spacing={8}
                        direction={{ base: 'column', md: 'row' }}
                        alignItems={{ base: 'flex-start', md: 'center' }}
                        justifyContent={['flex-start', 'center']}
                    >
                        <Card
                            id="private-node-creation-card"
                            title="Run a private node"
                            subtitle="explanation UI copy"
                            iconBg="yellow.100"
                            icon={<WalletIcon color="yellow.500" w={6} h={6} />}
                            buttonText={
                                <CustomText
                                    firstLine={'create my'}
                                    secondLine={'node'}
                                />
                            }
                            onButtonClick={() => {
                                console.log('new-private-node');
                            }}
                        />

                        <Card
                            id="pool-creation-card"
                            title="Create a public pool"
                            subtitle="explanation UI copy"
                            iconBg="yellow.100"
                            icon={
                                <AllowanceIcon color="yellow.500" w={6} h={6} />
                            }
                            buttonText={
                                <CustomText
                                    firstLine={'create'}
                                    secondLine={'public pool'}
                                />
                            }
                            onButtonClick={() => {
                                console.log('new-public-pool');
                            }}
                        />
                    </Stack>
                    <SlideInOut display={!active}>
                        <Alert bg="transparent" px={0} py={6}>
                            <Icon
                                as={AiOutlineExclamationCircle}
                                h={5}
                                w={5}
                                mr={2}
                            />
                            Please connect your wallet if you have created your
                            own node and pool already
                        </Alert>
                    </SlideInOut>
                </VStack>
            </Box>
        </Layout>
    );
};

export default NewStaking;
