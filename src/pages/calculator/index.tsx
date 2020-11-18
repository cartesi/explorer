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
import Link from 'next/link';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Layout from '../../components/Layout';
import { useMarketInformation } from '../../services/market';
import useTickets from '../../graphql/hooks/useTickets';
import { BigNumber, constants, FixedNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

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

    // total staked simulation
    const [totalStaked, setTotalStaked] = useState<BigNumber>(constants.Zero);

    // get latest ticket
    const { tickets } = useTickets();

    // bail out if not loaded
    const loaded =
        marketInformation.circulatingSupply && tickets && tickets.length > 0;
    if (!loaded) {
        return <div />;
    }

    const latestTicket = tickets[0];
    const latestPrize = constants.Zero.add(latestTicket.userPrize).add(
        latestTicket.beneficiaryPrize
    );

    const difficulty = BigNumber.from(latestTicket.difficulty);
    const desiredDrawTimeInterval = BigNumber.from(600); // XXX: Would be good to get this value from lottery contract
    const activeStake = difficulty.div(desiredDrawTimeInterval);
    const circulatingSupply = BigNumber.from(
        marketInformation.circulatingSupply
    ).mul(constants.WeiPerEther);

    // user stake share
    const stakePercentage = FixedNumber.fromValue(stake).divUnsafe(
        FixedNumber.fromValue(activeStake.add(stake))
    );

    // investment period in seconds
    const periodSeconds = BigNumber.from(period).mul(24).mul(60).mul(60);

    // number of ticket drawn in that period
    const totalTickets = periodSeconds.div(desiredDrawTimeInterval);
    console.log('totalTickets', totalTickets.toString());

    // number of ticket claimed by the user (statistically)
    const ticketsClaimed = stakePercentage.mulUnsafe(
        FixedNumber.fromValue(totalTickets)
    );
    console.log('ticketsClaimed', ticketsClaimed.toString());

    // total reward
    const reward = latestPrize.mul(ticketsClaimed.floor().toUnsafeFloat());
    console.log('reward', reward.toString());

    // APR
    const yearSeconds = constants.One.mul(365).mul(24).mul(60).mul(60);
    const yearTickets = yearSeconds.div(desiredDrawTimeInterval);
    console.log('yearTickets', yearTickets.toString());
    const yearClaimed = stakePercentage.mulUnsafe(
        FixedNumber.fromValue(yearTickets)
    );
    console.log('yearClaimed', yearClaimed.toString());
    const yearReward = latestPrize.mul(yearClaimed.floor().toUnsafeFloat());
    const apr = FixedNumber.fromValue(yearReward).divUnsafe(
        FixedNumber.fromValue(stake)
    );
    console.log('apr', apr.toString());

    return (
        <Layout>
            <Head>
                <title>Staking Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form>
                <div className="form-group">
                    <label>Amount to stake</label>
                    <input
                        type="text"
                        className="form-control"
                        id="stake"
                        value={formatUnits(stake, 18)}
                        onChange={(event) =>
                            setStake(parseUnits(event.target.value, 18))
                        }
                    />
                </div>
                <div className="form-group">
                    <label>Staking period</label>
                    <input
                        type="text"
                        className="form-control"
                        id="period"
                        value={period}
                        onChange={(event) =>
                            setPeriod(parseInt(event.target.value))
                        }
                    />
                </div>
                <p>Current Ticket Prize: {formatUnits(latestPrize, 18)} CTSI</p>
                <p>
                    Estimated Total Staked: {formatUnits(activeStake, 18)} CTSI
                </p>
                <p>
                    <ReactBootstrapSlider
                        min={0}
                        max={marketInformation.circulatingSupply}
                        value={marketInformation.circulatingSupply / 2}
                    />
                </p>
                <p>
                    Accumulated Reward:
                    {formatUnits(BigNumber.from(reward), 18)} CTSI
                </p>
                <p>
                    APR:{' '}
                    {apr.mulUnsafe(FixedNumber.from(100)).round(1).toString() +
                        '%'}
                </p>
            </form>
        </Layout>
    );
};

export default Calculator;
