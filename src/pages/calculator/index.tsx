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
import Layout from '../../components/Layout';
import { useMarketInformation } from '../../services/market';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BigNumber, constants, FixedNumber } from 'ethers';
import { useCartesiToken } from '../../services/token';
import { getEstimatedRewardRate } from '../../utils/reward';
import labels from '../../utils/labels';

interface Props {}

const Calculator = (props: Props) => {
    // user statke
    const [stake, setStake] = useState<BigNumber>(
        constants.One.mul(100000).mul(constants.WeiPerEther)
    );

    // investment period
    const [period, setPeriod] = useState<number>(100);

    // get market information (we need circulation supply)
    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();
    const { formatCTSI, parseCTSI, toCTSI } = useCartesiToken();

    // total staked simulation
    const [totalStaked, setTotalStaked] = useState<number>(-1);

    // get latest block
    const { data } = useBlocks();
    const blocks = data?.blocks || [];

    // bail out if not loaded
    const loaded =
        marketInformation.circulatingSupply && blocks && blocks.length > 0;
    if (!loaded) {
        return <div />;
    }

    const { reward, apr, activeStake } = getEstimatedRewardRate(
        blocks,
        stake,
        totalStaked,
        period
    );

    const blackBarPosition = loaded
        ? (toCTSI(activeStake) / marketInformation.circulatingSupply) * 100
        : 0;

    if (totalStaked < 0) {
        setTotalStaked(toCTSI(activeStake));
    }

    const currentReward = blocks[0].reward;

    if (typeof window !== 'undefined') {
        // ! Need to rethink if it's better to use this jquery stuff or separate component for tooltip such as react-tooltip
        const $ = require('jquery');
        $('[data-toggle="tooltip"]').tooltip();
    }

    return (
        <Layout className="calculator">
            <Head>
                <title>Staking Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header row">
                <div className="col col-12 info-text-md text-white">
                    Staking Calculator
                </div>
            </div>

            {loaded ? (
                <form className="calculator-form">
                    <div className="form-group">
                        <label className="body-text-2 text-secondary">
                            Amount to stake
                        </label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="addon-inline form-control"
                                id="stake"
                                value={toCTSI(stake)}
                                onChange={(event) =>
                                    setStake(
                                        parseCTSI(
                                            event.target.value
                                                ? event.target.value
                                                : 1
                                        )
                                    )
                                }
                            />
                            <span className="input-group-addon addon-inline input-source-observer small-text">
                                CTSI
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="body-text-2 text-secondary">
                            Staking period
                        </label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="addon-inline form-control"
                                id="period"
                                value={period}
                                onChange={(event) =>
                                    setPeriod(
                                        event.target.value
                                            ? parseInt(event.target.value)
                                            : 0
                                    )
                                }
                            />
                            <span className="input-group-addon addon-inline input-source-observer small-text">
                                Days
                            </span>
                        </div>
                    </div>

                    <div className="body-text-1">
                        Current Block Reward: {formatCTSI(currentReward, 2)}{' '}
                        <span className="small-text">CTSI</span>
                    </div>

                    <div className="body-text-1">
                        Estimated Total Staked: {totalStaked.toLocaleString()}{' '}
                        <span className="small-text">CTSI</span>
                    </div>

                    <div className="calculator-slider">
                        <h5 className="calculator-sub-title">Total Staked</h5>

                        <div className="calculator-slider-labels">
                            <span className="small-text">0</span>
                            <span className="small-text">
                                {totalStaked.toLocaleString()} CTSI
                            </span>
                            <span className="small-text">
                                {marketInformation.circulatingSupply.toLocaleString()}{' '}
                                CTSI
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={marketInformation.circulatingSupply}
                            value={totalStaked}
                            onChange={(e) =>
                                setTotalStaked(e.target.valueAsNumber)
                            }
                            className="slider"
                            style={{
                                background: `linear-gradient(
                                to right,
                                #000,
                                #000 ${blackBarPosition}%,
                                #fff ${blackBarPosition}%,
                                #fff
                            )`,
                            }}
                        />
                    </div>

                    <div className="calculator-result">
                        <h5 className="calculator-sub-title">Results</h5>

                        <div className="calculator-result-rewards row">
                            <div className="col col-12 col-sm-6">
                                <div className="calculator-result-reward">
                                    <span className="body-text-2 mb-1">
                                        Projected Period Reward
                                    </span>
                                    <span className="info-text-md">
                                        {formatCTSI(reward, 2)}{' '}
                                        <span className="small-text">CTSI</span>
                                    </span>
                                </div>
                            </div>

                            <div className="col col-12 col-sm-6">
                                <div className="calculator-result-reward">
                                    <span className="body-text-2 mb-1">
                                        Projected Annual Earnings{' '}
                                        <img
                                            data-toggle="tooltip"
                                            title={
                                                labels.projectedAnnualEarnings
                                            }
                                            src="/images/question.png"
                                        />
                                    </span>
                                    <span className="info-text-md">
                                        {apr
                                            .mulUnsafe(FixedNumber.from(100))
                                            .round(1)
                                            .toString() + '%'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div />
            )}
        </Layout>
    );
};

export default Calculator;
