import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import axios from 'axios';
import { BigNumber, constants, FixedNumber } from 'ethers';

import runMiddleware from '../../../utils/runMiddleware';
import { getEstimatedRewardRate, getRewardRate } from '../../../utils/reward';
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
    const circulatingSupply = marketData.data.market_data.circulating_supply;

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
        effectiveTotalStaked: toCTSI(activeStake).toUnsafeFloat(),
        hiredNodes: summary.totalNodes,
        projectedAnnualEarnings,
        participationRate,
    });
};

export default handler;
