// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, renderHook, waitFor } from '@testing-library/react';
import { endpoint, useMarketInformation } from '../../src/services/market';

jest.mock('axios');
global.fetch = jest.fn();
const mockFetchGet = global.fetch as jest.MockedFunction<typeof global.fetch>;

describe('market service', () => {
    it('should invoke GET http request with correct endpoint', async () => {
        let url = null;
        mockFetchGet.mockImplementation((endpoint) => {
            url = endpoint;
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve({})),
            } as Response);
        });

        await act(async () => {
            await waitFor(() => {
                renderHook(() => useMarketInformation());
            });
        });

        expect(url).toBe(endpoint);
    });

    it('should return correct market information', async () => {
        const data = {
            market_data: {
                current_price: {
                    usd: 1000,
                },
                market_cap: {
                    usd: 500,
                },
                circulating_supply: 10,
            },
        };
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve(data)),
            } as Response);
        });

        const { result } = renderHook(() => useMarketInformation());

        await waitFor(() => {
            expect(result.current.marketInformation.price).toBe(
                data.market_data.current_price.usd.toFixed(4)
            );
            expect(result.current.marketInformation.marketCap).toBe(
                data.market_data.market_cap.usd
            );
            expect(result.current.marketInformation.circulatingSupply).toBe(
                data.market_data.circulating_supply
            );
        });
    });
});
