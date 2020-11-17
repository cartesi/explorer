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
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from '../components/Layout';

import useTickets from '../graphql/hooks/useTickets';
import useWorkers from '../graphql/hooks/useWorkers';
import useSummary from '../graphql/hooks/useSummary';

import { useMarketInformation } from '../services/market';
import { useCartesiToken } from '../services/token';
import { useBlockNumber } from '../services/eth';
import { useStaking } from '../services/staking';
import TicketCard from '../components/TicketCard';
import { tinyString } from '../utils/stringUtils';
import { BigNumber, constants, FixedNumber } from 'ethers';

const Home = () => {
    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();
    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const { balance, formatCTSI } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking();

    const { workers, refreshWorkers } = useWorkers();
    const { tickets, refreshTickets } = useTickets();
    const { summary, refreshSummary } = useSummary();

    const [workerPage, setWorkerPage] = useState(1);
    const [workerSearch, setWorkerSearch] = useState('');

    let participationRateLabel = '-';
    let aprLabel = '-';
    if (tickets && tickets.length > 0 && marketInformation?.circulatingSupply) {
        // take average difficulty of all tickets in array
        const difficulty = tickets
            .map((t) => t.difficulty)
            .reduce((sum, d) => sum.add(d), constants.Zero)
            .div(tickets.length);

        // 10 minutes in seconds
        // XXX: Would be good to get this value from lottery contract
        const desiredDrawTimeInterval = BigNumber.from(600);

        // calculate estimated active stake from difficulty
        const activeStake = difficulty.div(desiredDrawTimeInterval);

        // convert circulation supply to BigNumber and multiple by 1e18
        const circulationSupply = BigNumber.from(
            marketInformation.circulatingSupply
        ).mul(constants.WeiPerEther);

        // participation rate is a percentage of circulation supply
        // must use FixedNumber because BigNumber is only for integer
        const participationRate = FixedNumber.fromValue(activeStake).divUnsafe(
            FixedNumber.fromValue(circulationSupply)
        );

        // build label
        participationRateLabel =
            participationRate
                .mulUnsafe(FixedNumber.from(100))
                .round(1)
                .toString() + ' %';

        const yearSeconds = constants.One.mul(60) // minute
            .mul(60) // hour
            .mul(24) // day
            .mul(365); // year

        // calculate average prize
        const prize = tickets
            .map((t) => BigNumber.from(t.userPrize))
            .reduce((sum, p) => sum.add(p), constants.Zero)
            .div(tickets.length);

        // total prize paid in one year
        const yearPrize = yearSeconds.div(desiredDrawTimeInterval).mul(prize);

        // calculate year return
        const yearReturn = FixedNumber.fromValue(yearPrize).divUnsafe(
            FixedNumber.fromValue(activeStake)
        );

        aprLabel =
            yearReturn.mulUnsafe(FixedNumber.from(100)).round(1).toString() +
            '%';
    }

    const totalWorkerPages =
        summary && workerSearch == ''
            ? Math.ceil(summary.totalWorkers / 10)
            : 1;

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
                                {`$${marketInformation.price}  `}
                                <span className="caption">USD</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-4 col-lg-2">
                            <div className="caption white-text">
                                CTSI Market Cap
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {`$${
                                    marketInformation.marketCap
                                        ? marketInformation.marketCap.toLocaleString(
                                              'en'
                                          )
                                        : ''
                                }  `}
                                <span className="caption">USD</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-4 col-lg-2">
                            <div className="caption white-text">
                                Circ. Supply
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {`${
                                    marketInformation.circulatingSupply
                                        ? marketInformation.circulatingSupply.toLocaleString(
                                              'en'
                                          )
                                        : ''
                                }  `}
                                <span className="caption">CTSI</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="sub-title-2 white-text">
                                <img src="/images/wallet.png" />
                                &nbsp; Wallet Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`${account ? formatCTSI(balance) : 'N/A'}  `}
                                <span className="caption">CTSI</span>
                            </div>
                        </div>

                        <div className="col col-12 col-md-6 col-lg-3">
                            <div className="sub-title-2 white-text">
                                <img src="/images/staked.png" />
                                &nbsp; Staked Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`${
                                    account ? formatCTSI(stakedBalance) : 'N/A'
                                }`}
                                <span className="caption"> CTSI</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="landing-dashboard">
                <div className="landing-dashboard-content row">
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Nodes</div>
                        <div className="info-text-bg">
                            {summary
                                ? summary.totalWorkers.toLocaleString()
                                : 0}
                        </div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Stakers</div>
                        <div className="info-text-bg">
                            {summary
                                ? summary.totalStakers.toLocaleString()
                                : 0}
                        </div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Annual Yield</div>
                        <div className="info-text-bg">{aprLabel}</div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Participation Rate</div>
                        <div className="info-text-bg">
                            {participationRateLabel}
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing-lottery">
                <h5>|&ensp;Lottery</h5>

                <div className="landing-lottery-tickets">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => refreshTickets()}
                    >
                        <img src="/images/refresh.svg" />
                    </button>
                    {tickets.slice(0, 4).map((ticket) => (
                        <TicketCard ticket={ticket} key={ticket.id} />
                    ))}
                </div>
            </div>

            <div className="landing-noether">
                <div className="landing-noether-title">
                    <h5>|&ensp;Noether Node Runners</h5>

                    <div className="input-group">
                        <span>
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={workerSearch}
                            onChange={(e) => (
                                setWorkerSearch(e.target.value),
                                setWorkerPage(1),
                                refreshWorkers(-2, e.target.value)
                            )}
                        />
                    </div>
                </div>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="table-header-text">Node</th>
                            <th className="table-header-text">
                                #Tickets Claimed
                            </th>
                            <th className="table-header-text">Total Staked</th>
                            <th className="table-header-text">Total Rewards</th>
                            <th className="table-header-text">
                                Total Uptime Days
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {workers.map((worker) => {
                            const now = new Date();
                            const uptimeDays = Math.ceil(
                                (now.getTime() - worker.timestamp * 1000) /
                                    1000 /
                                    60 /
                                    24
                            );
                            return (
                                <tr key={worker.id} className="body-text-2">
                                    <td>{tinyString(worker.id)}</td>
                                    <td>{worker.totalTickets}</td>
                                    <td>
                                        {formatCTSI(worker.owner.stakedBalance)}{' '}
                                        CTSI
                                    </td>
                                    <td>{formatCTSI(worker.totalReward)}</td>
                                    <td>{uptimeDays}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="landing-noether-pagination body-text-2">
                    <button
                        className="btn"
                        type="button"
                        disabled={workerPage <= 1}
                        onClick={() => (
                            setWorkerPage(workerPage - 1),
                            refreshWorkers(-1, workerSearch)
                        )}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    Page {workerPage} of {totalWorkerPages}
                    <button
                        className="btn"
                        type="button"
                        disabled={workerPage >= totalWorkerPages}
                        onClick={() => (
                            setWorkerPage(workerPage + 1),
                            refreshWorkers(1, workerSearch)
                        )}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
