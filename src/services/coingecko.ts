interface QueryParamsModel {
    localization: boolean;
    tickers: boolean;
    market_data: boolean;
    community_data: boolean;
    developer_data: boolean;
    sparkline: boolean;
}

/**
 * @description Generates the endpoint for retrieving the Cartesi market information from CoinGecko
 * @param queryParams - The query params that can be used to customize the returned market information
 * @return string - The generated endpoint
 */
export const getCartesiMarketInformationEndpoint = (
    queryParams: QueryParamsModel = {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
    }
) => {
    const url = 'https://api.coingecko.com/api/v3/coins/cartesi';
    const stringifiedParams = Object.keys(queryParams).reduce(
        (obj, key) => ({
            ...obj,
            [key]: queryParams[key].toString(),
        }),
        {}
    );

    const params = new URLSearchParams(stringifiedParams).toString();
    return `${url}?${params}`;
};
