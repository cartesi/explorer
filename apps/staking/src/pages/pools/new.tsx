// Copyright (C) 2022 Cartesi Pte. Ltd.

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
    Heading,
    Stack,
    HStack,
    Text,
    useColorModeValue,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { AiOutlineLeft } from 'react-icons/ai';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { StepGroup } from '../../components/StepGroup';
import CommissionModel from '../../components/pools/steps/CommissionModel';
import CustomizeEthereumNode from '../../components/pools/steps/CustomizeEthereumNode';
import SetUpNode from '../../components/pools/steps/SetUpNode';
import HireNode from '../../components/pools/steps/HireNode';
import EthereumNameServer from '../../components/pools/steps/ENS';
import PageHead from '../../components/PageHead';

const NewNode: FC = () => {
    const bg = useColorModeValue('gray.80', 'gray.800');
    const linkColor = useColorModeValue('gray', 'gray.100');
    return (
        <Layout>
            <PageHead title="Create a Cartesi staking pool" />

            <HStack
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <Link href="/node-runners" passHref>
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
                bg={bg}
                px={{ base: 0, md: '12vw', xl: '18vw' }}
                pb={{ base: 0, sm: '5vw' }}
            >
                <Stack
                    py={4}
                    direction="column"
                    alignItems="stretch"
                    display={{ base: 'none', md: 'flex' }}
                >
                    <ChakraLink
                        // TODO: Replace with new upcoming tutorial
                        href="https://medium.com/cartesi/staking-delegation-guide-pool-management-3cfe357a66c2"
                        target="_blank"
                        color={linkColor}
                        fontWeight="medium"
                        textDecorationLine="underline"
                        fontSize="sm"
                        alignSelf="flex-end"
                    >
                        Learn from tutorial
                    </ChakraLink>
                </Stack>
                <StepGroup
                    mobileHeaderProps={{ top: '100px' }}
                    steps={[
                        CustomizeEthereumNode,
                        SetUpNode,
                        CommissionModel,
                        HireNode,
                        EthereumNameServer,
                    ]}
                />
            </Box>
        </Layout>
    );
};

export default NewNode;
