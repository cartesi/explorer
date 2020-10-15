import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Breadcrumb, Table } from 'antd';
import _ from 'lodash';

import { ALL_PRIZES, Prize } from '../../graphql/prizes';

import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

const Blocks = () => {
    const { loading, error, data, fetchMore, networkStatus } = useQuery(
        ALL_PRIZES,
        {
            variables: {
                first: 10,
                lastTime: 0,
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const [allPrizes, setAllPrizes] = useState<Array<Prize>>([]);

    // TODO: Need to determine how to implement pagination with the new lotteries coming in
    const loadMorePrizes = async (continueLoading = true) => {
        const { data } = await fetchMore({
            variables: {
                lastTime: continueLoading
                    ? parseInt(allPrizes[allPrizes.length - 1].time)
                    : 0,
            },
        });

        data.prizes.forEach((prize) => (prize.key = prize.id));

        const newPrizes = _.unionBy(data.prizes, allPrizes, 'key');

        setAllPrizes(newPrizes);
    };

    useEffect(() => {
        if (fetchMore && allPrizes.length) {
            const interval = setInterval(() => {
                loadMorePrizes(false);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, allPrizes]);

    useEffect(() => {
        if (!loading && !error && data) {
            const newPrizes = data.prizes.map((prize) => {
                return {
                    ...prize,
                    key: prize.id,
                };
            });

            setAllPrizes(newPrizes);
        }
    }, [loading, error, data, fetchMore, networkStatus]);

    const columns = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Winner',
            dataIndex: 'winner',
            key: 'winner',
        },
        {
            title: 'Prize',
            dataIndex: 'prize',
            key: 'prize',
        },
    ];

    return (
        <Layout>
            <Head>
                <title>Blocks</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Blocks</Breadcrumb.Item>
            </Breadcrumb>

            <Table columns={columns} dataSource={allPrizes} bordered />
        </Layout>
    );
};

export default Blocks;
