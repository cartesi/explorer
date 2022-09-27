// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { Box, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Layout, { PageBody, PageHeader } from '../../components/Layout';
import RollupsGraphQLProvider from '../../containers/rollups/RollupsGraphQLProvider';
import { AddInput } from '../../containers/rollups/AddInput';
import { Notices } from '../../containers/rollups/Notices';
import { useWallet } from '../../contexts/wallet';
import AddressText from '../../components/AddressText';
import { DApp } from '../../containers/rollups/DApp';

const Rollups = () => {
    const router = useRouter();
    const wallet = useWallet();
    const { address } = router.query;
    return (
        <Layout>
            <Head>
                <title>Explorer - Rollups</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader>
                <HStack spacing={3} align="flex-start">
                    <Box>
                        <NextLink href="/rollups" passHref>
                            <Link>
                                <IconButton
                                    bg="transparent"
                                    _hover={{ bg: 'gray.800' }}
                                    size="md"
                                    mt={-2}
                                    icon={<ArrowBackIcon />}
                                    aria-label={'Back to rollups'}
                                    title={'Back to rollups'}
                                />
                            </Link>
                        </NextLink>
                    </Box>

                    <AddressText
                        address={address as string}
                        chainId={wallet.chainId}
                        fontSize={['xl', '3xl']}
                    >
                        <Text>Rollups DApp</Text>
                    </AddressText>
                </HStack>
            </PageHeader>
            <RollupsGraphQLProvider
                address={address as string}
                chainId={wallet?.chainId}
            >
                <DApp address={address as string} chainId={wallet?.chainId} />
            </RollupsGraphQLProvider>
        </Layout>
    );
};

export default Rollups;
