'use client';

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
                                chainId={chainId as number}
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
                        chainId={chainId as number}
                        search={userSearch}
                        totalItems={summary?.totalUsers}
                    />
                </Box>
            </Box>
        </Layout>
    );
};

export default Home;
