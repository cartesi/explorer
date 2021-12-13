// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import Head from 'next/head';

import Layout, {
    PageBody,
    PageHeader,
    PagePanel,
} from '../../components/Layout';
import { Flex, Heading } from '@chakra-ui/layout';

const StakingUi: FC = () => {
    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <Flex wrap="wrap">
                    <Heading fontWeight="normal">Staking</Heading>
                </Flex>
            </PageHeader>

            <PageBody></PageBody>
        </Layout>
    );
};

export default StakingUi;
