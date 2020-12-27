// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from '../components/Layout';

import useBlocks from '../graphql/hooks/useBlocks';
import useNodes from '../graphql/hooks/useNodes';
import useSummary from '../graphql/hooks/useSummary';

import { MarketInformation, useMarketInformation } from '../services/market';
import { useCartesiToken } from '../services/token';
import { useBlockNumber } from '../services/eth';
import { useStaking } from '../services/staking';
import BlockCard from '../components/BlockCard';
import { tinyString } from '../utils/stringUtils';
import { getRewardRate } from '../utils/reward';
import { formatCTSI } from '../utils/token';
import { FixedNumber } from 'ethers';
import Link from 'next/link';
import { Block, Summary } from '../graphql/models';
import EtherscanLink from '../components/EtherscanLink';

interface HeaderProps {
    market: MarketInformation;
}
const Header = (props: HeaderProps) => {
    const marketInformation = props.market;
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();
    const { balance } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking();
    return (
        <div className="page-header row">
            {marketInformation && (
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
                        <div className="caption white-text">Circ. Supply</div>
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
                            {`${account ? formatCTSI(balance, 2) : 'N/A'}  `}
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
                                account ? formatCTSI(stakedBalance, 2) : 'N/A'
                            }`}
                            <span className="caption"> CTSI</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

interface StatsProps {
    market: MarketInformation;
    summary: Summary;
    blocks: Block[];
}
const Stats = (props: StatsProps) => {
    const { blocks, market, summary } = props;

    let participationRateLabel = '-';
    let aprLabel = '-';
    if (blocks && blocks.length > 0 && market?.circulatingSupply) {
        const { participationRate, yearReturn } = getRewardRate(
            blocks,
            market.circulatingSupply
        );

        // build label
        participationRateLabel =
            participationRate
                .mulUnsafe(FixedNumber.from(100))
                .round(1)
                .toString() + ' %';

        aprLabel =
            yearReturn > FixedNumber.from(3)
                ? '> 300%'
                : yearReturn
                      .mulUnsafe(FixedNumber.from(100))
                      .round(1)
                      .toString() + '%';
    }

    return (
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
                    <div className="sub-title-1">Projected Annual Earnings</div>
                    <div className="info-text-bg">{aprLabel}</div>
                </div>
                <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
                    <div className="sub-title-1">Participation Rate</div>
                    <div className="info-text-bg">{participationRateLabel}</div>
                </div>
            </div>
        </div>
    );
};

interface BlocksProps {
    blocks: Block[];
}
const Blocks = (props: BlocksProps) => {
    const { blocks } = props;
    return (
        <div className="landing-blocks">
            <Link href="/blocks">
                <a className="landing-link">
                    <h5 className="landing-sub-title">Blocks</h5>
                </a>
            </Link>

            <div className="landing-blocks-list">
                {blocks.slice(0, 4).map((block) => (
                    <Link href={'/blocks/'} key={block.id}>
                        <a className="landing-link flex-fill">
                            <BlockCard block={block} key={block.id} />
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
};

interface NodesProps {
    summary: Summary;
}
const Nodes = (props: NodesProps) => {
    const { summary } = props;
    const {
        nodes,
        nodesPerPage,
        pageNumber,
        filter,
        loading,
        loadNodes,
        updateFilter,
    } = useNodes();
    const totalNodePages =
        summary && (!filter.id || filter.id === '')
            ? Math.ceil(summary.totalNodes / nodesPerPage)
            : 1;

    return (
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
                        value={filter.id}
                        onChange={(e) =>
                            updateFilter(
                                e.target.value !== ''
                                    ? { id: e.target.value }
                                    : {}
                            )
                        }
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
                            <th className="table-header-text">Total Staked</th>
                            <th className="table-header-text">Total Rewards</th>
                            <th className="table-header-text">
                                Total Uptime Days
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading || !nodes ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <span
                                        className="spinner-border spinner-border-sm my-1"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                </td>
                            </tr>
                        ) : (
                            nodes.map((node) => {
                                const now = new Date();
                                const uptimeDays = Math.ceil(
                                    (now.getTime() / 1000 - node.timestamp) /
                                        60 /
                                        60 /
                                        24
                                );
                                return (
                                    <tr key={node.id} className="body-text-2">
                                        <td>
                                            <EtherscanLink
                                                type="address"
                                                id={node.id}
                                            >
                                                {tinyString(node.id)}
                                            </EtherscanLink>
                                        </td>
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
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="landing-noether-pagination body-text-2">
                <button
                    className="btn"
                    type="button"
                    disabled={pageNumber <= 0}
                    onClick={() => loadNodes(pageNumber - 1)}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                Page {pageNumber + 1} of {totalNodePages}
                <button
                    className="btn"
                    type="button"
                    disabled={pageNumber + 1 >= totalNodePages}
                    onClick={() => loadNodes(pageNumber + 1)}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

const Home = () => {
    const { marketInformation } = useMarketInformation();
    const summary = useSummary();
    const { data } = useBlocks();
    const blocks = data?.blocks || [];

    return (
        <Layout className="landing">
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header market={marketInformation} />
            <Stats
                blocks={blocks}
                summary={summary}
                market={marketInformation}
            />
            <Blocks blocks={blocks} />
            <Nodes summary={summary} />
        </Layout>
    );
};

export default Home;
