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
import Link from 'next/link';

import { FixedNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import ReactTooltip from 'react-tooltip';

import Layout from '../components/Layout';
import BlockCard from '../components/BlockCard';
import Users from '../components/Users';

import useBlocks from '../graphql/hooks/useBlocks';
import useSummary from '../graphql/hooks/useSummary';
import { Block, Summary } from '../graphql/models';

import { MarketInformation, useMarketInformation } from '../services/market';
import { useCartesiToken } from '../services/token';
import { useBlockNumber } from '../services/eth';
import { useStaking } from '../services/staking';

import { getRewardRate } from '../utils/reward';
import { formatCTSI } from '../utils/token';
import labels from '../utils/labels';

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
            yearReturn.toUnsafeFloat() > 3
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
                    <div className="sub-title-1">
                        Projected Annual Earnings{' '}
                        <img
                            data-tip={labels.projectedAnnualEarnings}
                            src="/images/question.png"
                        />
                    </div>
                    <div className="info-text-bg">{aprLabel}</div>
                </div>
                <div className="col col-12 col-md-6 col-lg-3 landing-dashboard-content-item">
                    <div className="sub-title-1">
                        Participation Rate{' '}
                        <img
                            data-tip={labels.participationRate}
                            src="/images/question.png"
                        />
                    </div>
                    <div className="info-text-bg">{participationRateLabel}</div>
                </div>
            </div>
            <ReactTooltip />
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
            <Users summary={summary} />
        </Layout>
    );
};

export default Home;
