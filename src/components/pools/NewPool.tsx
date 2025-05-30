// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import {
    Box,
    Heading,
    HStack,
    Link as ChakraLink,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';
import Layout from '../Layout';
import { StepGroup } from '../StepGroup';
import CommissionModel from './steps/CommissionModel';
import CustomizeEthereumNode from './steps/CustomizeEthereumNode';
import EthereumNameServer from './steps/ENS';
import HireNode from './steps/HireNode';
import SetUpNode from './steps/SetUpNode';

const NewPool: FC = () => {
    const bg = useColorModeValue('gray.80', 'dark.gray.primary');
    const linkColor = useColorModeValue('dark.secondary', 'dark.primary');
    return (
        <Layout>
            <HStack
                color="white"
                bg="dark.gray.tertiary"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <Box
                    as={Link}
                    href="/node-runners"
                    display="flex"
                    alignItems="center"
                >
                    <Box as={AiOutlineLeft} mr={1} />
                    <Text>Back</Text>
                </Box>
            </HStack>
            <Box
                color="white"
                bg="dark.gray.tertiary"
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
                        textDecorationLine="none"
                        fontSize="sm"
                        _hover={{
                            color: linkColor,
                            textDecoration: 'underline',
                        }}
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

export default NewPool;
