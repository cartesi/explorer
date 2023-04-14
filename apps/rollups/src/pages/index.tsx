// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { Box, Heading } from '@chakra-ui/react';
import { Notification } from '@explorer/ui';
import { Network } from '@explorer/utils';
import Head from 'next/head';
import { PageBody, PageHeader, PageLayout } from '../components/Layout';
import { Dapps } from '../containers/rollups/Dapps';
import { LocalDAppList } from '../containers/rollups/LocalDApps';
import { useNetwork } from '../services/useNetwork';
import { useRollupsFactory } from '../services/useRollupsFactory';

const Home = () => {
    const factory = useRollupsFactory();
    const network = useNetwork();
    const localDevEnabled = process.env.NEXT_PUBLIC_DAPP_LOCAL_DEV === 'true';
    const isUsingLocalBlockchain = network?.chainId === Network.LOCAL;

    return (
        <PageLayout>
            <Head>
                <title>Explorer - Rollups</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader>
                <Box px={{ base: '6vw', xl: '6vw' }}>
                    <Heading fontWeight="normal">Rollups DApps</Heading>
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

            {localDevEnabled && isUsingLocalBlockchain ? (
                <LocalDAppList chainId={network?.chainId} />
            ) : factory && network?.chainId ? (
                <Dapps chainId={network?.chainId} address={factory.address} />
            ) : null}
        </PageLayout>
    );
};

export default Home;
