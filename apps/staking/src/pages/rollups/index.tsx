// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { Box, Heading, Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Address from '../../components/Address';
import Layout, { PageBody, PageHeader } from '../../components/Layout';
import { Notification } from '../../components/Notification';
import { DAppFactory } from '../../containers/rollups/DAppFactory';
import GraphQLProvider from '../../containers/rollups/GraphQLProvider';
import { useNetwork } from '../../services/rollups/useNetwork';
import { useRollupsFactory } from '../../services/rollups/useRollupsFactory';

const Home: NextPage = () => {
    const factory = useRollupsFactory();
    const network = useNetwork();

    return (
        <GraphQLProvider chainId={network?.chainId}>
            <Layout>
                <Head>
                    <title>Explorer - Rollups</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <PageHeader>
                    <Box px={{ base: '6vw', xl: '6vw' }}>
                        <Heading fontWeight="normal">Rollups DApps</Heading>
                        {factory && (
                            <Address
                                address={factory.address}
                                chainId={network?.chainId}
                                name="instantiated by"
                                truncated
                            />
                        )}
                    </Box>
                </PageHeader>

                {!factory && (
                    <PageBody>
                        <Notification
                            title="Network not supported!"
                            subtitle="Rollups DApp Factory not deployed to the selected network."
                            status="error"
                        />
                    </PageBody>
                )}

                {factory && network?.chainId && (
                    <DAppFactory
                        chainId={network?.chainId}
                        address={factory.address}
                    />
                )}
            </Layout>
        </GraphQLProvider>
    );
};

export default Home;
