// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import axios from 'axios';
import Cors from 'cors';
import { FixedNumber, constants } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

import { getEstimatedRewardRate, getRewardRate } from '../../../utils/reward';
import runMiddleware from '../../../utils/runMiddleware';
import { toCTSI } from '../../../utils/token';

import { createApollo } from '../../../services/apollo';

import { BLOCKS } from '../../../graphql/queries/blocks';
import { SUMMARY } from '../../../graphql/queries/summary';

import { BlocksData, SummaryData } from '../../../graphql/models';
import { networks } from '../../../utils/networks';

const cors = Cors({
    methods: ['GET', 'HEAD'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const {
        query: { chain },
    } = req;

    const chainId =
        parseInt(
            Object.keys(networks).find(
                (key) => networks[key] == (chain as string).toLowerCase()
            )
        ) || 1;

    const client = createApollo(chainId);

    const {
        data: { summary },
    } = await client.query<SummaryData>({
        query: SUMMARY,
        variables: {
            id: '1',
        },
    });

    const {
        data: { blocks },
    } = await client.query<BlocksData>({
        query: BLOCKS,
    });

    const endpoint = `https://api.coingecko.com/api/v3/coins/cartesi?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const marketData = await axios.get(endpoint);
    const circulatingSupply = Math.round(
        marketData.data.market_data.circulating_supply
    );

    let projectedAnnualEarnings = 0,
        participationRate = 0;
    if (blocks && blocks.length > 0 && circulatingSupply && summary) {
        const { yearReturn } = getRewardRate(blocks, circulatingSupply);

        participationRate = toCTSI(summary.totalStaked)
            .divUnsafe(FixedNumber.from(circulatingSupply))
            .mulUnsafe(FixedNumber.from(100))
            .toUnsafeFloat();

        projectedAnnualEarnings = yearReturn
            .mulUnsafe(FixedNumber.from(100))
            .toUnsafeFloat();
    }

    const { activeStake } = getEstimatedRewardRate(blocks, constants.One, 0, 0);

    res.json({
        price: +marketData.data.market_data.current_price.usd.toFixed(4),
        circulatingSupply,
        totalStaked: toCTSI(summary.totalStaked).toUnsafeFloat(),
        totalUsers: summary.totalUsers,
        totalStakers: summary.totalStakers,
        effectiveTotalStaked: toCTSI(activeStake).toUnsafeFloat(),
        hiredNodes: summary.totalNodes,
        projectedAnnualEarnings,
        participationRate,
        latestBlock:
            blocks && blocks.length > 0
                ? {
                      id: blocks[0].id,
                      number: blocks[0].number,
                      timestamp: blocks[0].timestamp,
                      reward: toCTSI(blocks[0].reward).toUnsafeFloat(),
                      difficulty: blocks[0].difficulty,
                      chainNumber: blocks[0].chain.number,
                  }
                : null,
    });
};

export default handler;
