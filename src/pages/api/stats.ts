import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import axios from 'axios';
import { BigNumber, constants, FixedNumber } from 'ethers';

import runMiddleware from '../../utils/runMiddleware';
import { getRewardRate } from '../../utils/reward';
import { toCTSI } from '../../utils/token';

import { createApollo } from '../../services/apollo';

import { BLOCKS } from '../../graphql/queries/blocks';
import { SUMMARY } from '../../graphql/queries/summary';

import { BlocksData, SummaryData } from '../../graphql/models';

const cors = Cors({
    methods: ['GET', 'HEAD'],
});

const client = createApollo(1);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

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
    const market = {
        price: marketData.data.market_data.current_price.usd.toFixed(4),
        marketCap: marketData.data.market_data.market_cap.usd,
        circulatingSupply: marketData.data.market_data.circulating_supply,
    };

    let projectedAnnualEarnings = 0,
        participationRate = 0;
    if (blocks && blocks.length > 0 && market?.circulatingSupply && summary) {
        const { yearReturn } = getRewardRate(blocks, market.circulatingSupply);

        participationRate = toCTSI(summary.totalStaked)
            .divUnsafe(FixedNumber.from(market.circulatingSupply))
            .mulUnsafe(FixedNumber.from(100))
            .toUnsafeFloat();

        projectedAnnualEarnings = yearReturn
            .mulUnsafe(FixedNumber.from(100))
            .toUnsafeFloat();
    }

    const difficulty = blocks
        .map((t) => BigNumber.from(t.difficulty))
        .reduce((sum, d) => sum.add(d), constants.Zero)
        .div(blocks.length);

    const targetInterval = blocks[0].chain.targetInterval;

    const effectiveTotalStaked = toCTSI(
        difficulty.div(targetInterval)
    ).toUnsafeFloat();

    res.json({
        totalStaked: toCTSI(summary.totalStaked).toUnsafeFloat(),
        effectiveTotalStaked,
        difficulty: difficulty.toString(),
        activeNodes: summary.totalNodes,
        currentBlockReward: toCTSI(blocks[0].reward).toUnsafeFloat(),
        projectedAnnualEarnings,
        participationRate,
    });
};

export default handler;
