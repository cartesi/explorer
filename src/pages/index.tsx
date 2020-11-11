// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import _ from 'lodash';

import Layout from '../components/Layout';
import { ALL_LOTTERY_TICKETS } from '../graphql/lottery';
import { LotteryTicket } from '../graphql/models';

import { useMarketInformation } from '../services/market';

const Home = () => {
    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();

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
        <Layout className="landing">
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="landing-header row">
                {!marketInfomationError && (
                    <>
                        <div className="col col-12 col-md-4 col-lg-2">
                            <div className="caption white-text">CTSI Price</div>
                            <div className="info-text-sm dark-white-text">
                                {`$${marketInformation.price}`}
                                <span className="caption">&nbsp;&nbsp;USD</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-4 col-lg-2">
                            <div className="caption white-text">
                                CTSI Market Cap
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {`$${marketInformation.marketCap}`}
                                <span className="caption"> USD</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-4 col-lg-2">
                            <div className="caption white-text">
                                Circ. Supply
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {marketInformation.circulatingSupply}
                                <span className="caption"> CTSI</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="sub-title-2 white-text">
                                <img src="/images/wallet.png" />
                                &nbsp; Wallet Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`1,000,000.12 `}
                                <span className="caption">CTSI</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="sub-title-2 white-text">
                                <img src="/images/staked.png" />
                                &nbsp; Staked Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`994,000 `}
                                <span className="caption">CTSI</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="landing-dashboard">
                <div className="landing-dashboard-content row">
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Nodes</div>
                        <div className="info-text-bg">22,000</div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Stakers</div>
                        <div className="info-text-bg">100,000</div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Annual Yield</div>
                        <div className="info-text-bg">8.3%</div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Participation Rate</div>
                        <div className="info-text-bg">23.2%</div>
                    </div>
                </div>
            </div>

            <div className="landing-lottery">
                <h5>|&ensp;Lottery</h5>

                <div className="landing-lottery-tickets">
                    <button type="button" className="btn btn-link">
                        <img src="/images/refresh.svg" />
                    </button>
                    {tickets.map((ticket) => {
                        return (
                            <div className="landing-lottery-ticket">
                                <div className="body-text-2">
                                    Ticket #{ticket.round}
                                </div>
                                <div className="body-text-2">
                                    Claimer {ticket.user.id}
                                </div>
                                <div className="body-text-2">
                                    Node {ticket.worker.id}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="landing-noether">
                <h5>|&ensp;Noether Node Runners</h5>
            </div>
        </Layout>
    );
};

export default Home;
