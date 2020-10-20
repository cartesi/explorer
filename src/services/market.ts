import axios from 'axios';

export type MarketInformation = {
    price?: number;
    marketCap?: number;
    circulatingSupply?: number;
};

export async function getMarketInformation(): Promise<MarketInformation> {
    const endpoint = `https://api.coingecko.com/api/v3/coins/cartesi?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    const { data } = await axios.get(endpoint);

    const marketInformation: MarketInformation = {
        price: data.market_data.current_price.usd,
        marketCap: data.market_data.market_cap.usd.toLocaleString('en'),
        circulatingSupply: data.market_data.circulating_supply.toLocaleString(
            'en'
        ),
    };

    return marketInformation;
}
