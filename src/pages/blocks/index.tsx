import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Breadcrumb, Table } from 'antd';
import _ from 'lodash';

import { ALL_LOTTERY_TICKETS, LotteryTicket } from '../../graphql/lottery';

import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

const Blocks = () => {
    const { loading, error, data, fetchMore, networkStatus } = useQuery(
        ALL_LOTTERY_TICKETS,
        {
            variables: {
                first: 10,
                filter: { roundCount_gt: 0 },
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const [tickets, setTickets] = useState<Array<LotteryTicket>>([]);

    const loadMoreTickets = async (continueLoading = true) => {
        const { data } = await fetchMore({
            variables: {
                lastIndex: continueLoading
                    ? {
                          roundCount_lt: tickets[tickets.length - 1].roundCount,
                      }
                    : {},
            },
        });

        data.lotteryTickets.forEach((ticket) => (ticket.key = ticket.id));

        const newTickets = _.unionBy(data.lotteryTickets, tickets, 'key');

        setTickets(newTickets);
    };

    useEffect(() => {
        if (fetchMore && tickets.length) {
            const interval = setInterval(() => {
                loadMoreTickets(false);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, tickets]);

    useEffect(() => {
        if (!loading && !error && data) {
            const newTickets = data.lotteryTickets.map((ticket) => {
                return {
                    ...ticket,
                    key: ticket.id,
                };
            });

            setTickets(newTickets);
        }
    }, [loading, error, data, fetchMore, networkStatus]);

    const columns = [
        {
            title: 'No',
            dataIndex: 'roundCount',
            key: 'roundCount',
        },
        {
            title: 'Winner',
            dataIndex: 'winner',
            key: 'winner',
        },
        {
            title: 'Transaction Hash',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
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

            <Table
                columns={columns}
                dataSource={tickets}
                bordered
                pagination={false}
            />
        </Layout>
    );
};

export default Blocks;
