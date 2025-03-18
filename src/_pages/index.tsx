// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Heading,
    HStack,
    SimpleGrid,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import BlockMiniCard from '../components/block/BlockMiniCard';
import HomeHeader from '../components/home/Header';
import Stats from '../components/home/Stats';
import Layout from '../components/Layout';
import PageHead from '../components/PageHead';
import SearchInput from '../components/SearchInput';
import Users from '../components/Users';
import { useWallet } from '../components/wallet';
import useBlocks from '../graphql/hooks/useBlocks';
import useSummary from '../graphql/hooks/useSummary';

const Home = () => {
    const { chainId } = useWallet();
    const bg = useColorModeValue('gray.80', 'dark.gray.quaternary');
    const sectionBg = useColorModeValue('white', 'dark.gray.primary');

    // global summary information
    const summary = useSummary();

    // latest 4 produced blocks
    const { data } = useBlocks({}, 4);
    const blocks = data?.blocks || [];

    const [userSearch, setUserSearch] = useState<string>();

    return (
        <Layout>
            <PageHead
                title="Secure the Cartesi network and earn rewards"
                description="Secure the Cartesi network and earn rewards"
                isHome
            />

            <Box bg={bg}>
                <HomeHeader />

                <Stats />

                <Box
                    bg={sectionBg}
                    w="100%"
                    shadow="md"
                    mt={10}
                    py={{ base: 6, md: 10 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <Heading as="h1" fontSize={['1xl', '2xl']} mb={4}>
                        Blocks
                    </Heading>

                    <SimpleGrid columns={{ md: 2, '2xl': 4 }} spacing={6}>
                        {blocks.slice(0, 4).map((block) => (
                            <BlockMiniCard
                                chainId={chainId}
                                block={block}
                                key={block.id}
                            />
                        ))}
                    </SimpleGrid>
                </Box>

                <Box
                    bg={sectionBg}
                    w="100%"
                    shadow="md"
                    mt={10}
                    py={{ base: 6, md: 10 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <HStack justify="space-between" align="center" mb={6}>
                        <Heading as="h1" fontSize={['1xl', '2xl']}>
                            Block Producers
                        </Heading>
                        <SearchInput
                            w={[100, 200, 400, 500]}
                            flex={{ base: 1, md: 'initial' }}
                            placeholder="Search Pool Address..."
                            onSearchChange={(e) =>
                                setUserSearch(e.target.value)
                            }
                        />
                    </HStack>
                    <Users
                        chainId={chainId}
                        search={userSearch}
                        totalItems={summary?.totalUsers}
                    />
                </Box>
            </Box>
        </Layout>
    );
};

export default Home;
