// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Link as ChakraLink,
    HStack,
    Heading,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';
import Layout from '../../components/Layout';
import PageHead from '../../components/PageHead';
import { StepGroup } from '../../components/StepGroup';
import CustomizeEthereumNode from '../../components/node/steps/CustomizeEthereumNode';
import HireNode from '../../components/node/steps/HireNode';
import SetAllowance from '../../components/node/steps/SetAllowance';
import SetUpNode from '../../components/node/steps/SetUpNode';

const NewNode: FC = () => {
    const bgSection = useColorModeValue('teal.light', 'dark.gray.primary');
    const linkColor = useColorModeValue('black', 'white');
    return (
        <Layout>
            <PageHead
                title="Create a Cartesi node"
                description="Create a Cartesi node"
            />

            <HStack
                bg={'dark.gray.tertiary'}
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
                bg={'dark.gray.tertiary'}
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={0}
                pb={5}
            >
                <Stack alignItems={'flex-start'} direction={'row'}>
                    <Heading as="h1" fontSize={{ base: '4xl', xl: '5xl' }}>
                        Create a Node
                    </Heading>
                </Stack>
            </Box>
            <Box
                bg={bgSection}
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
                        href="https://medium.com/cartesi/running-a-node-and-staking-42523863970e"
                        target="_blank"
                        color={linkColor}
                        fontWeight="medium"
                        textDecorationLine="underline"
                        fontSize="sm"
                        alignSelf="flex-end"
                        _hover={{
                            color: 'teal.secondary',
                        }}
                    >
                        Learn from tutorial
                    </ChakraLink>
                </Stack>
                <StepGroup
                    mobileHeaderProps={{ top: '100px' }}
                    steps={[
                        CustomizeEthereumNode,
                        SetUpNode,
                        HireNode,
                        SetAllowance,
                    ]}
                />
            </Box>
        </Layout>
    );
};

export default NewNode;
