// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWallet } from '@explorer/wallet/src/useWallet';
import { cleanup, renderHook } from '@testing-library/react';
import { networks, useNetwork } from '../../src/services/useNetwork';
import { useRollupsGraphQL } from '../../src/services/useRollupsGraphQL';

const walletMod = `@explorer/wallet/src/useWallet`;
const networkMod = '../../src/services/useNetwork';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock(networkMod, () => {
    const originalModule = jest.requireActual(networkMod);
    return {
        __esModule: true,
        ...originalModule,
        useNetwork: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const defaultUseWalletData = {
    account,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
};

const defaultNetwork = networks[0x5];

describe('useRollupsGraphQL hook', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue(defaultUseWalletData);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should set the network graphql to the selected address when manual url is not provided', () => {
        let networkAddress = null;

        mockUseNetwork.mockReturnValue({
            ...defaultNetwork,
            graphql: (address) => {
                networkAddress = address;
                return defaultNetwork.graphql(address);
            },
        });

        renderHook(() => useRollupsGraphQL(account));

        expect(networkAddress).toBe(account);
    });

    it('should not set the network graphql to the selected address when manual url is provided', () => {
        let networkAddress = null;

        mockUseNetwork.mockReturnValue({
            ...defaultNetwork,
            graphql: (address) => {
                networkAddress = address;
                return `https://${address}.goerli.rollups.staging.cartesi.io/graphql`;
            },
        });
        const manualUrl =
            'https://0x332b30d6b862f060a6ef5da0ac338be08a4ce95a.goerli.rollups.staging.cartesi.io/graphql';
        renderHook(() => useRollupsGraphQL(account, manualUrl));

        expect(networkAddress).toBe(null);
    });
});
