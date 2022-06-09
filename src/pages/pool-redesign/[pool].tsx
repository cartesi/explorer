// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';

import Layout from '../../components/Layout';

import { PoolHeader } from '../../components/poolRedesign/PoolHeader';
import { PoolBreadcrumbs } from '../../components/poolRedesign/PoolBreadcrumbs';
import {
    EffectiveBalanceIcon,
    EyeIcon,
    PoolBalanceIcon,
    PoolCommisionIcon,
    PoolPerformanceIcon,
    PoolProductionIntervalIcon,
    PoolUsersIcon,
    StakedBalanceIcon,
} from '../../components/Icons';
import {
    Collapse,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Button,
    useDisclosure,
    VStack,
    useColorModeValue,
    HStack,
    Heading,
    Tooltip,
    Text,
    StackDivider,
    Box,
    SimpleGrid,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PoolActivity } from '../../components/poolRedesign/PoolActivity';

const poolRedesign = () => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    const bgBlocks = useColorModeValue('blue.50', 'gray.900');
    const bgPageDevider = useColorModeValue('gray.100', 'gray.900');
    const bgDevider = useColorModeValue('gray.100', 'gray.600');
    const titleLeftBorder = useColorModeValue('gray.900', 'white');

    const activity = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        from: '0xf83...0af4',
        since: 'Nov, 2021',
        deposit: '0.00',
    }));

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pool Info</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PoolHeader />
            <PoolBreadcrumbs currentPage="Overview" />
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <HStack
                    spacing={4}
                    align="center"
                    justify="space-between"
                    mb={2}
                    display={{
                        base: 'flex',
                        lg: 'none',
                    }}
                    onClick={onToggle}
                >
                    <Heading
                        size="lg"
                        borderLeftWidth={2}
                        borderLeftColor={titleLeftBorder}
                        pl={4}
                    >
                        Overview
                    </Heading>

                    <Box transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}>
                        <ChevronDownIcon w={6} h={6} />
                    </Box>
                </HStack>

                <Collapse in={isOpen}>
                    <VStack spacing={8}>
                        <SimpleGrid
                            columns={{
                                base: 1,
                                lg: 3,
                            }}
                            w="full"
                            spacing={4}
                        >
                            <VStack
                                align="flex-start"
                                flexBasis={{ base: '100%', lg: '33.33%' }}
                                flexShrink={0}
                            >
                                <HStack spacing={4} align="center" p={4}>
                                    <Box
                                        bg="yellow.100"
                                        w={14}
                                        h={14}
                                        borderRadius="full"
                                        display="grid"
                                        placeContent="center"
                                        flexShrink={0}
                                    >
                                        <StakedBalanceIcon
                                            color="yellow.500"
                                            w={7}
                                            h={7}
                                        />
                                    </Box>
                                    <Box>
                                        <HStack>
                                            <Text>Staked Balance</Text>
                                            <Tooltip
                                                placement="top"
                                                label="Here you can see your current staked balance."
                                                fontSize="small"
                                                bg="black"
                                                color="white"
                                            >
                                                <Icon color="gray.500" />
                                            </Tooltip>
                                        </HStack>
                                        <HStack align="baseline">
                                            <Heading as="h2" m={0} size="lg">
                                                20.6M
                                            </Heading>
                                            <Text
                                                size={'base'}
                                                color="gray.500"
                                            >
                                                CTSI
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </VStack>
                            <VStack
                                align="flex-start"
                                flexBasis={{ base: '100%', lg: '33.33%' }}
                            >
                                <HStack
                                    spacing={4}
                                    align="center"
                                    p={4}
                                    w="full"
                                >
                                    <Box
                                        bg="yellow.100"
                                        w={14}
                                        h={14}
                                        borderRadius="full"
                                        display="grid"
                                        placeContent="center"
                                        flexShrink={0}
                                    >
                                        <EffectiveBalanceIcon
                                            color="yellow.500"
                                            w={7}
                                            h={7}
                                        />
                                    </Box>
                                    <Box>
                                        <HStack>
                                            <Text>Effective Balance</Text>
                                            <Tooltip
                                                placement="top"
                                                label="Here you can see your current Effective Balance."
                                                fontSize="small"
                                                bg="black"
                                                color="white"
                                            >
                                                <Icon color="gray.500" />
                                            </Tooltip>
                                        </HStack>
                                        <HStack align="baseline">
                                            <Heading as="h2" m={0} size="lg">
                                                30.6M
                                            </Heading>
                                            <Text
                                                size={'base'}
                                                color="gray.500"
                                            >
                                                CTSI
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <Box>
                                        <Popover
                                            placement="bottom"
                                            autoFocus={false}
                                        >
                                            <PopoverTrigger>
                                                <Button
                                                    variant="ghost"
                                                    bg="rgba(0, 0, 0, 0.1)"
                                                    rounded="full"
                                                    p={2}
                                                    h="auto"
                                                    w="auto"
                                                    minW="auto"
                                                >
                                                    <EyeIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverBody>
                                                    <VStack
                                                        align="stretch"
                                                        divider={
                                                            <StackDivider
                                                                borderColor={
                                                                    bgDevider
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Box px={4} py={2}>
                                                            <HStack justify="space-between">
                                                                <Text>
                                                                    Maturing
                                                                    Balance
                                                                </Text>
                                                                <Tooltip
                                                                    placement="top"
                                                                    label="Here you can see your Maturing Balance"
                                                                    fontSize="small"
                                                                    bg="black"
                                                                    color="white"
                                                                >
                                                                    <Icon color="gray.500" />
                                                                </Tooltip>
                                                            </HStack>
                                                            <HStack align="baseline">
                                                                <Heading
                                                                    as="h3"
                                                                    m={0}
                                                                    size="md"
                                                                >
                                                                    20.6M
                                                                </Heading>
                                                                <Text
                                                                    size={
                                                                        'base'
                                                                    }
                                                                    color="gray.500"
                                                                >
                                                                    CTSI
                                                                </Text>
                                                            </HStack>
                                                        </Box>
                                                        <Box px={4} py={2}>
                                                            <HStack justify="space-between">
                                                                <Text>
                                                                    Releasing
                                                                    Balance
                                                                </Text>
                                                                <Tooltip
                                                                    placement="top"
                                                                    label="Here you can see your Releasing Balance"
                                                                    fontSize="small"
                                                                    bg="black"
                                                                    color="white"
                                                                >
                                                                    <Icon color="gray.500" />
                                                                </Tooltip>
                                                            </HStack>
                                                            <HStack align="baseline">
                                                                <Heading
                                                                    as="h3"
                                                                    m={0}
                                                                    size="md"
                                                                >
                                                                    20.6M
                                                                </Heading>
                                                                <Text
                                                                    size={
                                                                        'base'
                                                                    }
                                                                    color="gray.500"
                                                                >
                                                                    CTSI
                                                                </Text>
                                                            </HStack>
                                                            <Text
                                                                fontSize="sm"
                                                                color="orange.500"
                                                            >
                                                                Releasing in 1
                                                                day, 14 hours
                                                            </Text>
                                                        </Box>
                                                        <Box px={4} py={2}>
                                                            <HStack justify="space-between">
                                                                <Text>
                                                                    Released
                                                                    Balance
                                                                </Text>
                                                                <Tooltip
                                                                    placement="top"
                                                                    label="Here you can see your Released Balance"
                                                                    fontSize="small"
                                                                    bg="black"
                                                                    color="white"
                                                                    ml="auto"
                                                                >
                                                                    <Icon color="gray.500" />
                                                                </Tooltip>
                                                            </HStack>
                                                            <HStack align="baseline">
                                                                <Heading
                                                                    as="h3"
                                                                    m={0}
                                                                    size="md"
                                                                >
                                                                    317.27K
                                                                </Heading>
                                                                <Text
                                                                    size={
                                                                        'base'
                                                                    }
                                                                    color="gray.500"
                                                                >
                                                                    CTSI
                                                                </Text>
                                                            </HStack>
                                                        </Box>
                                                    </VStack>
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    </Box>
                                </HStack>
                            </VStack>
                            <VStack
                                align="flex-start"
                                flexBasis={{ base: '100%', lg: '33.33%' }}
                            >
                                <HStack spacing={4} align="center" p={4}>
                                    <Box
                                        bg="yellow.100"
                                        w={14}
                                        h={14}
                                        borderRadius="full"
                                        display="grid"
                                        placeContent="center"
                                        flexShrink={0}
                                    >
                                        <PoolBalanceIcon
                                            color="yellow.500"
                                            w={7}
                                            h={7}
                                        />
                                    </Box>
                                    <Box>
                                        <HStack>
                                            <Text>Pool Balance</Text>
                                            <Tooltip
                                                placement="top"
                                                label="Here you can see your current Pool Balance."
                                                fontSize="small"
                                                bg="black"
                                                color="white"
                                            >
                                                <Icon color="gray.500" />
                                            </Tooltip>
                                        </HStack>
                                        <HStack align="baseline">
                                            <Heading m={0} size="lg">
                                                20.6M
                                            </Heading>
                                            <Text
                                                size={'base'}
                                                color="gray.500"
                                            >
                                                CTSI
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </VStack>
                        </SimpleGrid>

                        <SimpleGrid
                            columns={{
                                base: 1,
                                lg: 3,
                            }}
                            w="full"
                            spacing={4}
                        >
                            <NextLink href="#">
                                <Box
                                    flexBasis={{ base: '100%', lg: '33.33%' }}
                                    flexShrink={0}
                                    bgColor={bgBlocks}
                                    borderRadius={4}
                                    cursor="pointer"
                                >
                                    <HStack
                                        spacing={4}
                                        align="center"
                                        p={4}
                                        w="full"
                                    >
                                        <Box
                                            w={14}
                                            h={14}
                                            borderRadius="full"
                                            display="grid"
                                            placeContent="center"
                                            flexShrink={0}
                                        >
                                            <PoolUsersIcon w={7} h={7} />
                                        </Box>
                                        <Box flexGrow="1">
                                            <HStack>
                                                <Text>Users</Text>
                                                <Tooltip
                                                    placement="top"
                                                    label="Here you can see your Users."
                                                    fontSize="small"
                                                    bg="black"
                                                    color="white"
                                                >
                                                    <Icon color="gray.500" />
                                                </Tooltip>
                                            </HStack>
                                            <HStack align="baseline">
                                                <Heading
                                                    as="h2"
                                                    m={0}
                                                    size="lg"
                                                >
                                                    221
                                                </Heading>
                                                <Text
                                                    size={'base'}
                                                    color="gray.500"
                                                >
                                                    CTSI
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <ChevronRightIcon w={5} h={5} />
                                    </HStack>
                                </Box>
                            </NextLink>
                            <NextLink href="#">
                                <Box
                                    flexBasis={{ base: '100%', lg: '33.33%' }}
                                    flexShrink={0}
                                    bgColor={bgBlocks}
                                    borderRadius={4}
                                    cursor="pointer"
                                >
                                    <HStack
                                        spacing={4}
                                        align="center"
                                        p={4}
                                        w="full"
                                    >
                                        <Box
                                            w={14}
                                            h={14}
                                            borderRadius="full"
                                            display="grid"
                                            placeContent="center"
                                            flexShrink={0}
                                        >
                                            <PoolProductionIntervalIcon
                                                w={7}
                                                h={7}
                                            />
                                        </Box>
                                        <Box flexGrow="1">
                                            <HStack>
                                                <Text>Production Interval</Text>
                                                <Tooltip
                                                    placement="top"
                                                    label="Here you can see your Production Interval."
                                                    fontSize="small"
                                                    bg="black"
                                                    color="white"
                                                >
                                                    <Icon color="gray.500" />
                                                </Tooltip>
                                            </HStack>
                                            <HStack align="baseline">
                                                <Heading
                                                    as="h2"
                                                    m={0}
                                                    size="lg"
                                                >
                                                    5
                                                </Heading>
                                                <Text
                                                    size={'base'}
                                                    color="gray.500"
                                                >
                                                    hours
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <ChevronRightIcon w={5} h={5} />
                                    </HStack>
                                </Box>
                            </NextLink>
                            <NextLink href="#">
                                <Box
                                    flexBasis={{ base: '100%', lg: '33.33%' }}
                                    flexShrink={0}
                                    bgColor={bgBlocks}
                                    borderRadius={4}
                                    cursor="pointer"
                                >
                                    <HStack
                                        spacing={4}
                                        align="center"
                                        p={4}
                                        w="full"
                                    >
                                        <Box
                                            w={14}
                                            h={14}
                                            borderRadius="full"
                                            display="grid"
                                            placeContent="center"
                                            flexShrink={0}
                                        >
                                            <PoolCommisionIcon w={7} h={7} />
                                        </Box>
                                        <Box flexGrow="1">
                                            <HStack>
                                                <Text>Commision</Text>
                                                <Tooltip
                                                    placement="top"
                                                    label="Here you can see your Commision."
                                                    fontSize="small"
                                                    bg="black"
                                                    color="white"
                                                >
                                                    <Icon color="gray.500" />
                                                </Tooltip>
                                            </HStack>
                                            <HStack align="baseline">
                                                <Heading
                                                    as="h2"
                                                    m={0}
                                                    size="lg"
                                                >
                                                    3.5
                                                </Heading>
                                                <Text
                                                    size={'base'}
                                                    color="gray.500"
                                                >
                                                    %
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <ChevronRightIcon w={5} h={5} />
                                    </HStack>
                                </Box>
                            </NextLink>
                            <NextLink href="#">
                                <Box
                                    flexBasis={{ base: '100%', lg: '33.33%' }}
                                    flexShrink={0}
                                    bgColor={bgBlocks}
                                    borderRadius={4}
                                    cursor="pointer"
                                >
                                    <HStack
                                        spacing={4}
                                        align="center"
                                        p={4}
                                        w="full"
                                    >
                                        <Box
                                            w={14}
                                            h={14}
                                            borderRadius="full"
                                            display="grid"
                                            placeContent="center"
                                            flexShrink={0}
                                        >
                                            <PoolPerformanceIcon w={7} h={7} />
                                        </Box>
                                        <Box flexGrow="1">
                                            <HStack>
                                                <Text>Pool Performance</Text>
                                                <Tooltip
                                                    placement="top"
                                                    label="Here you can see your Pool Performance."
                                                    fontSize="small"
                                                    bg="black"
                                                    color="white"
                                                >
                                                    <Icon color="gray.500" />
                                                </Tooltip>
                                            </HStack>
                                            <HStack align="baseline">
                                                <Heading
                                                    as="h2"
                                                    m={0}
                                                    size="lg"
                                                >
                                                    89.20
                                                </Heading>
                                                <Text
                                                    size={'base'}
                                                    color="gray.500"
                                                >
                                                    %
                                                </Text>
                                                <Text
                                                    size={'base'}
                                                    color="gray.500"
                                                    paddingLeft={4}
                                                >
                                                    7 Days
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <ChevronRightIcon w={5} h={5} />
                                    </HStack>
                                </Box>
                            </NextLink>
                        </SimpleGrid>
                    </VStack>
                </Collapse>
            </Box>
            <Box
                bg={bgPageDevider}
                as="hr"
                border={0}
                shadow="inner"
                h={6}
                w="full"
            />
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <Heading as="h2" size="lg" mb={4}>
                    Pool Activity
                </Heading>

                <PoolActivity activity={activity} />
            </Box>
        </Layout>
    );
};

export default poolRedesign;
