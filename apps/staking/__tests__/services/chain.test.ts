// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import axios from 'axios';
import {
    getAllChains,
    allChainsUrl,
    getChainUrl,
    getChain,
    chainErrorData,
} from '../../src/services/chain';

jest.mock('axios');
const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('chain service', () => {
    it('should invoke GET http request with correct endpoint', async () => {
        let url = null;
        mockAxiosGet.mockImplementation((endpoint) => {
            url = endpoint;
            return Promise.resolve({ data: {} });
        });

        await getAllChains();

        expect(url).toBe(allChainsUrl);
    });

    it('should invoke GET http request with correct chain url', async () => {
        const chainId = 5;
        let url = null;
        mockAxiosGet.mockImplementation((endpoint) => {
            url = endpoint;
            return Promise.resolve({ data: {} });
        });

        await getChain(chainId);

        expect(url).toBe(getChainUrl(chainId));
    });

    it('should invoke GET http request with correct chain url', async () => {
        const chainId = 5;
        mockAxiosGet.mockImplementation(() => {
            return Promise.reject({ data: {} });
        });

        const result = await getChain(chainId);

        expect(result).toStrictEqual({
            ...chainErrorData,
            chainId: chainId,
            networkId: chainId,
        });
    });
});
