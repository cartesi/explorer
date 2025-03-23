// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { constants, FixedNumber } from 'ethers';

import {
    getEstimatedRewardRate,
    getRewardRate,
} from '../../../../utils/reward';
import { toCTSI } from '../../../../utils/token';

import { createApollo } from '../../../../services/apollo';

import { BLOCKS, SUMMARY } from '../../../../graphql/queries';

import { BlocksData, SummaryData } from '../../../../graphql/models';
import { networks } from '../../../../utils/networks';
import { NextRequest, NextResponse } from 'next/server';

interface Response {
    params: Promise<{ chain: string; address: string }>;
}

const handler = async ({ params }: Response) => {
    const chain = (await params).chain;

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
    const response = await fetch(endpoint);
    const marketData = await response.json();
    const circulatingSupply = Math.round(
        marketData.market_data.circulating_supply
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

    return NextResponse.json({
        price: +marketData.market_data.current_price.usd.toFixed(4),
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

export async function GET(_: NextRequest, res: Response) {
    return handler(res);
}

export async function HEAD(_: NextRequest, res: Response) {
    return handler(res);
}
