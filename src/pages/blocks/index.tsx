import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Breadcrumb, Card, Timeline } from 'antd';
import _ from 'lodash';

import { ALL_LOTTERY_TICKETS } from '../../graphql/queries/lottery';
import { LotteryTicket } from '../../graphql/models';

import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

const Blocks = () => {
    const { loading, error, data, fetchMore, networkStatus } = useQuery(
        ALL_LOTTERY_TICKETS,
        {
            variables: {
                first: 10,
                filter: { round_gt: 0 },
                orderBy: 'round',
                orderDirection: 'desc',
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const [tickets, setTickets] = useState<Array<LotteryTicket>>([]);

    const loadMoreTickets = async (continueLoading = true) => {
        let { data: any } = await fetchMore({
            variables: {
                lastIndex: continueLoading
                    ? {
                          round_lt: tickets[tickets.length - 1].round,
                      }
                    : {},
            },
        });

        if (data) {
            const newTickets = _.unionBy(
                data.lotteryTickets.map((ticket) => ({
                    ...ticket,
                    key: ticket.id,
                })),
                tickets,
                'key'
            );

            setTickets(newTickets.sort((a, b) => a.round - b.round));
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

            setTickets(newTickets.sort((a, b) => a.round - b.round));
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
                            <Timeline.Item
                                key={ticket.id}
                                label={new Date(
                                    ticket.time * 1000
                                ).toLocaleString()}
                            >
                                <Card title={'Round: ' + ticket.round}>
                                    <Card.Grid
                                        style={{ width: '100%' }}
                                        hoverable={false}
                                    >
                                        <h3>Transaction Hash:</h3> {ticket.id}
                                        <h3>Worker:</h3> {ticket.worker}
                                    </Card.Grid>

                                    <Card.Grid
                                        style={{ width: '100%' }}
                                        hoverable={false}
                                    >
                                        <h3>Winner:</h3>

                                        <Card.Grid
                                            style={{ width: '100%' }}
                                            hoverable={false}
                                            key={i}
                                        >
                                            <p>Address: {ticket.user}</p>
                                            <p>Prize: {ticket.userPrize}</p>
                                        </Card.Grid>

                                        {ticket.beneficiary && (
                                            <>
                                                <h3>Beneficiary:</h3>

                                                <Card.Grid
                                                    style={{ width: '100%' }}
                                                    hoverable={false}
                                                    key={i}
                                                >
                                                    <p>
                                                        Address:{' '}
                                                        {ticket.beneficiary}
                                                    </p>
                                                    <p>
                                                        Prize:{' '}
                                                        {
                                                            ticket.beneficiaryPrize
                                                        }
                                                    </p>
                                                </Card.Grid>
                                            </>
                                        )}
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
