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
import { FixedNumber } from 'ethers';
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
    const { blocks, getRewardRate } = useBlocks();
    const summary = useSummary();

    const [nodePage, setNodePage] = useState<number>(1);
    const [nodeSearch, setNodeSearch] = useState<string>('');

    let participationRateLabel = '-';
    let aprLabel = '-';
    if (blocks && blocks.length > 0 && marketInformation?.circulatingSupply) {
        const { participationRate, yearReturn } = getRewardRate(
            marketInformation.circulatingSupply
        );

        // build label
        participationRateLabel =
            participationRate
                .mulUnsafe(FixedNumber.from(100))
                .round(1)
                .toString() + ' %';

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

            <div className="page-header row">
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
                                {`${
                                    account ? formatCTSI(balance, 2) : 'N/A'
                                }  `}
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
                                    account
                                        ? formatCTSI(stakedBalance, 2)
                                        : 'N/A'
                                }`}
                                <span className="caption"> CTSI</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="landing-dashboard">
                <div className="landing-dashboard-content row">
                    <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Nodes</div>
                        <div className="info-text-bg">
                            {summary ? summary.totalNodes.toLocaleString() : 0}
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
                        <div className="sub-title-1"># Active Stakers</div>
                        <div className="info-text-bg">
                            {summary ? summary.totalUsers.toLocaleString() : 0}
                        </div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
                        <div className="sub-title-1">Annual Rewards</div>
                        <div className="info-text-bg">{aprLabel}</div>
                    </div>
                    <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
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
                    {blocks.slice(0, 4).map((block) => (
                        <Link href={'/blocks/' + block.id} key={block.id}>
                            <a className="landing-link flex-fill">
                                <BlockCard block={block} key={block.id} />
                            </a>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="landing-noether">
                <div className="landing-noether-title">
                    <h5 className="landing-sub-title">Noether Nodes</h5>

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
                                refreshNodes({
                                    timestamp_gt: 0,
                                    id: e.target.value,
                                })
                            )}
                        />
                    </div>
                </div>

                <div className="table-responsive mb-2">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="table-header-text">Node</th>
                                <th className="table-header-text">
                                    #Blocks Produced
                                </th>
                                <th className="table-header-text">
                                    Total Staked
                                </th>
                                <th className="table-header-text">
                                    Total Rewards
                                </th>
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
                                            {formatCTSI(
                                                node.owner.stakedBalance,
                                                2
                                            )}{' '}
                                            CTSI
                                        </td>
                                        <td>
                                            {formatCTSI(node.totalReward, 2)}{' '}
                                            CTSI
                                        </td>
                                        <td>{uptimeDays}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="landing-noether-pagination body-text-2">
                    <button
                        className="btn"
                        type="button"
                        disabled={nodePage <= 1}
                        onClick={() => (
                            setNodePage(nodePage - 1),
                            refreshNodes({
                                timestamp_gt:
                                    nodes && nodes.length > 0
                                        ? nodes[0].timestamp
                                        : 0,
                                id: nodeSearch,
                            })
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
                            refreshNodes({
                                timestamp_lt:
                                    nodes && nodes.length > 0
                                        ? nodes[nodes.length - 1].timestamp
                                        : 0,
                                id: nodeSearch,
                            })
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
