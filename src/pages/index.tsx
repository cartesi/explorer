// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from '../components/Layout';

import useBlocks from '../graphql/hooks/useBlocks';
import useNodes from '../graphql/hooks/useNodes';
import useSummary from '../graphql/hooks/useSummary';

import { useMarketInformation } from '../services/market';
import { useCartesiToken } from '../services/token';
import { useBlockNumber } from '../services/eth';
import { useStaking } from '../services/staking';
import BlockCard from '../components/BlockCard';
import { tinyString } from '../utils/stringUtils';
import { BigNumber, constants, FixedNumber } from 'ethers';
import Link from 'next/link';

const Home = () => {
    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();
    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const { balance, formatCTSI } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking();

    const { nodes, refreshNodes } = useNodes();
    const { blocks, loadNewBlocks } = useBlocks();
    const { summary } = useSummary();

    const [nodePage, setNodePage] = useState(1);
    const [nodeSearch, setNodeSearch] = useState('');

    let participationRateLabel = '-';
    let aprLabel = '-';
    if (blocks && blocks.length > 0 && marketInformation?.circulatingSupply) {
        // take average difficulty of all blocks in array
        const difficulty = blocks
            .map((t) => t.difficulty)
            .reduce((sum, d) => sum.add(d), constants.Zero)
            .div(blocks.length);

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
        const prize = blocks
            .map((block) => constants.Zero.add(block.reward))
            .reduce((sum, prize) => sum.add(prize), constants.Zero)
            .div(blocks.length);

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

    const totalNodePages =
        summary && nodeSearch == '' ? Math.ceil(summary.totalNodes / 10) : 1;

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
                            {summary ? summary.totalNodes.toLocaleString() : 0}
                        </div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Stakers</div>
                        <div className="info-text-bg">
                            {summary ? summary.totalUsers.toLocaleString() : 0}
                        </div>
                    </div>
                    <div className="col-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Annual Rewards</div>
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
                <Link href="/blocks">
                    <a className="landing-link">
                        <h5 className="landing-sub-title">Blocks</h5>
                    </a>
                </Link>

                <div className="landing-lottery-blocks">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => loadNewBlocks()}
                    >
                        <img src="/images/refresh.svg" />
                    </button>
                    {blocks.slice(0, 4).map((block) => (
                        <Link href={'/blocks/' + block.id} key={block.id}>
                            <a className="landing-link">
                                <BlockCard block={block} key={block.id} />
                            </a>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="landing-noether">
                <div className="landing-noether-title">
                    <h5 className="landing-sub-title">Noether Node Runners</h5>

                    <div className="input-with-icon input-group">
                        <span>
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={nodeSearch}
                            onChange={(e) => (
                                setNodeSearch(e.target.value),
                                setNodePage(1),
                                refreshNodes(-2, e.target.value)
                            )}
                        />
                    </div>
                </div>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="table-header-text">Node</th>
                            <th className="table-header-text">
                                #Blocks Produced
                            </th>
                            <th className="table-header-text">Total Staked</th>
                            <th className="table-header-text">Total Rewards</th>
                            <th className="table-header-text">
                                Total Uptime Days
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {nodes.map((node) => {
                            const now = new Date();
                            const uptimeDays = Math.ceil(
                                (now.getTime() / 1000 - node.timestamp) /
                                    60 /
                                    60 /
                                    24
                            );
                            return (
                                <tr key={node.id} className="body-text-2">
                                    <td>{tinyString(node.id)}</td>
                                    <td>{node.totalBlocks}</td>
                                    <td>
                                        {formatCTSI(node.owner.stakedBalance)}{' '}
                                        CTSI
                                    </td>
                                    <td>{formatCTSI(node.totalReward)}</td>
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
                        disabled={nodePage <= 1}
                        onClick={() => (
                            setNodePage(nodePage - 1),
                            refreshNodes(-1, nodeSearch)
                        )}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    Page {nodePage} of {totalNodePages}
                    <button
                        className="btn"
                        type="button"
                        disabled={nodePage >= totalNodePages}
                        onClick={() => (
                            setNodePage(nodePage + 1),
                            refreshNodes(1, nodeSearch)
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
