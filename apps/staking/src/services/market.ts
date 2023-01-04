// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import axios from 'axios';

export type MarketInformation = {
    price?: number;
    marketCap?: number;
    circulatingSupply?: number;
};

export const useMarketInformation = () => {
    const endpoint = `https://api.coingecko.com/api/v3/coins/cartesi?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const [marketInformation, setMarketInformation] =
        useState<MarketInformation>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError('');
        axios
            .get(endpoint)
            .then(({ data }) => {
                setLoading(false);
                setError('');
                setMarketInformation({
                    price: data.market_data.current_price.usd.toFixed(4),
                    marketCap: data.market_data.market_cap.usd,
                    circulatingSupply: Math.round(
                        data.market_data.circulating_supply
                    ),
                });
            })
            .catch((e) => {
                setError(e.message);
            });
    }, []);

    return { marketInformation, error, loading };
};
