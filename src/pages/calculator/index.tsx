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
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Heading,
    HStack,
    Input,
    Slider,
    Table,
    Tbody,
    Td,
    Th,
    Tr,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';

import Layout from '../../components/Layout';

import { useMarketInformation } from '../../services/market';
import { useCartesiToken } from '../../services/token';

import useBlocks from '../../graphql/hooks/useBlocks';
import useSummary from '../../graphql/hooks/useSummary';

import { getEstimatedRewardRate } from '../../utils/reward';
import { formatCTSI } from '../../utils/token';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import Stats from '../../components/Stats';

const Calculator = () => {
    // user statke
    const [stake, setStake] = useState<BigNumber>(
        constants.One.mul(100000).mul(constants.WeiPerEther)
    );

    const summary = useSummary();

    // investment period
    const [period, setPeriod] = useState<number>(100);

    // get market information (we need circulation supply)
    const { marketInformation, error: marketInfomationError } =
        useMarketInformation();
    const { parseCTSI, toCTSI } = useCartesiToken();

    // total staked simulation
    const [totalStaked, setTotalStaked] = useState<number>(-1);

    // get latest block
    const { data } = useBlocks(10);
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

    return (
        <Layout>
            <Head>
                <title>Staking Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Heading>Staking Calculator</Heading>

            {loaded ? (
                <form>
                    <FormControl id="stake">
                        <FormLabel>Amount to stake</FormLabel>
                        <Input />
                        <FormHelperText>
                            Amount of CTSI tokens to stake.
                        </FormHelperText>
                    </FormControl>

                    <FormControl id="period">
                        <FormLabel>Staking period</FormLabel>
                        <Input />
                        <FormHelperText>
                            Amount of days you will keep your stake.
                        </FormHelperText>
                    </FormControl>

                    <Table variant="clear">
                        <Tbody>
                            <Tr>
                                <Th>Current Block Reward</Th>
                                <Td>{formatCTSI(currentReward, 2)} CTSI</Td>
                            </Tr>
                            <Tr>
                                <Th>Total Staked</Th>
                                <Td>
                                    {formatCTSI(
                                        summary ? summary.totalStaked : 0
                                    )}
                                </Td>
                            </Tr>
                            <Tr>
                                <Th>Effective Total Stake</Th>
                                <Td>
                                    {toCTSI(activeStake).toLocaleString()} CTSI
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                    <FormControl id="totalStaked">
                        <FormLabel>Total Staked</FormLabel>
                        <Input />
                        <FormHelperText>
                            Total amount of CTSI tokens staked.
                        </FormHelperText>
                    </FormControl>

                    <Slider />

                    <Heading>Results</Heading>

                    <HStack>
                        <Stats label="Projected Period Reward" unit="decimal" />
                        <Stats
                            label="Projected Annual Earnings"
                            unit="percent"
                        />
                    </HStack>

                    <StakingDisclaimer persistanceKey="calculator" />
                </form>
            ) : (
                <div />
            )}
        </Layout>
    );
};

export default Calculator;
