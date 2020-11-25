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
import Link from 'next/link';
// import ReactBootstrapSlider from 'react-bootstrap-slider';
import Layout from '../../components/Layout';
import { useMarketInformation } from '../../services/market';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BigNumber, constants, FixedNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useCartesiToken } from '../../services/token';

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
    const { formatCTSI, parseCTSI } = useCartesiToken();

    // total staked simulation
    const [totalStaked, setTotalStaked] = useState<number>(-1);

    // get latest block
    const { blocks } = useBlocks();

    // bail out if not loaded
    const loaded =
        marketInformation.circulatingSupply && blocks && blocks.length > 0;
    if (!loaded) {
        return <div />;
    }

    const latestBlock = blocks[0];
    const latestPrize = constants.Zero.add(latestBlock.userPrize).add(
        latestBlock.beneficiaryPrize
    );

    const difficulty = BigNumber.from(latestBlock.difficulty);
    const desiredDrawTimeInterval = BigNumber.from(600); // XXX: Would be good to get this value from lottery contract
    const activeStake = difficulty.div(desiredDrawTimeInterval);
    const blackBarPosition =
        (parseFloat(formatUnits(activeStake, 18)) /
            marketInformation.circulatingSupply) *
        100;

    if (totalStaked < 0) {
        setTotalStaked(parseInt(formatUnits(activeStake, 18)));
    }

    const circulatingSupply = BigNumber.from(
        marketInformation.circulatingSupply
    ).mul(constants.WeiPerEther);

    // user stake share
    const stakePercentage = FixedNumber.fromValue(stake).divUnsafe(
        FixedNumber.fromValue(
            constants.One.mul(totalStaked).mul(constants.WeiPerEther).add(stake)
        )
    );

    // investment period in seconds
    const periodSeconds = BigNumber.from(period).mul(24).mul(60).mul(60);

    // number of block drawn in that period
    const totalBlocks = periodSeconds.div(desiredDrawTimeInterval);

    // number of block claimed by the user (statistically)
    const blocksClaimed = stakePercentage.mulUnsafe(
        FixedNumber.fromValue(totalBlocks)
    );

    // total reward
    const reward = latestPrize.mul(blocksClaimed.floor().toUnsafeFloat());

    // APR
    const yearSeconds = constants.One.mul(365).mul(24).mul(60).mul(60);
    const yearBlocks = yearSeconds.div(desiredDrawTimeInterval);

    const yearClaimed = stakePercentage.mulUnsafe(
        FixedNumber.fromValue(yearBlocks)
    );

    const yearReward = latestPrize.mul(yearClaimed.floor().toUnsafeFloat());
    const apr = FixedNumber.fromValue(yearReward).divUnsafe(
        FixedNumber.fromValue(stake)
    );

    return (
        <Layout className="calculator">
            <Head>
                <title>Staking Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
                            value={parseInt(formatUnits(stake, 18))}
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
                    Current Block Reward: {formatCTSI(latestPrize)}{' '}
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
                        onChange={(e) => setTotalStaked(e.target.valueAsNumber)}
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

                    <div className="calculator-result-rewards">
                        <div className="calculator-result-reward mr-4">
                            <span className="body-text-2 mb-1">
                                Absolute Reward
                            </span>
                            <span className="info-text-md">
                                {formatCTSI(BigNumber.from(reward))}{' '}
                                <span className="small-text">CTSI</span>
                            </span>
                        </div>
                        <div className="calculator-result-reward">
                            <span className="body-text-2 mb-1">
                                Estimated Annual Reward
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
            </form>
        </Layout>
    );
};

export default Calculator;
