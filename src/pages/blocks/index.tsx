import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Breadcrumb, Card, Timeline } from 'antd';
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
                orderBy: 'roundCount',
                orderDirection: 'desc',
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const [tickets, setTickets] = useState<Array<LotteryTicket>>([]);

    const loadMoreTickets = async (continueLoading = true) => {
        const { data: any } = await fetchMore({
            variables: {
                lastIndex: continueLoading
                    ? {
                          roundCount_lt: tickets[tickets.length - 1].roundCount,
                      }
                    : {},
            },
        });

        if (data) {
            data.lotteryTickets.forEach((ticket) => (ticket.key = ticket.id));

            const newTickets = _.unionBy(data.lotteryTickets, tickets, 'key');

            setTickets(newTickets.sort((a, b) => a.roundCount - b.roundCount));
        }
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

            setTickets(newTickets.sort((a, b) => a.roundCount - b.roundCount));
        }
    }, [loading, error, data, fetchMore, networkStatus]);

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

            <div style={{ marginTop: '50px' }}>
                <Timeline
                    pending="Waiting for the next ticket..."
                    reverse={true}
                >
                    {tickets.map((ticket, i) => {
                        return (
                            <Timeline.Item key={ticket.id}>
                                <Card title={'Round: ' + ticket.roundCount}>
                                    <Card.Grid
                                        style={{ width: '100%' }}
                                        hoverable={false}
                                    >
                                        <h3>Transaction Hash:</h3> {ticket.id}
                                    </Card.Grid>

                                    <Card.Grid
                                        style={{ width: '100%' }}
                                        hoverable={false}
                                    >
                                        <h3>Winners:</h3>

                                        {ticket.winners.map((winner, i) => {
                                            return (
                                                <Card.Grid
                                                    style={{ width: '100%' }}
                                                    hoverable={false}
                                                    key={i}
                                                >
                                                    <p>
                                                        Address: {winner.winner}
                                                    </p>
                                                    <p>Prize: {winner.prize}</p>
                                                    <p>
                                                        Time:{' '}
                                                        {new Date(
                                                            winner.time * 1000
                                                        ).toLocaleString()}
                                                    </p>
                                                </Card.Grid>
                                            );
                                        })}
                                    </Card.Grid>
                                </Card>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </div>
        </Layout>
    );
};

export default Blocks;
