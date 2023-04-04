// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import {
    CartesiDAppFactory,
    CartesiDAppFactory__factory,
} from '@cartesi/rollups';
import { useApplications } from '../../src/services/useApplications';
import { networks, useNetwork } from '../../src/services/useNetwork';
import { useRollupsFactory } from '../../src/services/useRollupsFactory';

const networkMod = '../../src/services/useNetwork';
const rollupsMod = '../../src/services/useRollupsFactory';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

jest.mock(networkMod, () => {
    const originalModule = jest.requireActual(networkMod);
    return {
        __esModule: true,
        ...originalModule,
        useNetwork: jest.fn(),
    };
});

jest.mock(rollupsMod, () => {
    const originalModule = jest.requireActual(rollupsMod);
    return {
        __esModule: true,
        ...originalModule,
        useRollupsFactory: jest.fn(),
    };
});

const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;
const mockUseRollupsFactory = useRollupsFactory as jest.MockedFunction<
    typeof useRollupsFactory
>;

const defaultNetwork = networks[0x5];

describe('useApplications hook', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("should set correct application state when when network doesn't exist", () => {
        mockUseNetwork.mockReturnValue(undefined);
        mockUseRollupsFactory.mockReturnValue({} as CartesiDAppFactory);

        const applications = renderHook(() => useApplications());
        expect(applications.result.current.loading).toBe(false);
        expect(applications.result.current.applications.length).toBe(0);
    });

    it("should set correct application state when when rollups factory doesn't exist", () => {
        mockUseNetwork.mockReturnValue(defaultNetwork);
        mockUseRollupsFactory.mockReturnValue(undefined);

        const applications = renderHook(() => useApplications());
        expect(applications.result.current.loading).toBe(false);
        expect(applications.result.current.applications.length).toBe(0);
    });

    it('should invoke the network deployment function when network and rollups factory exist', async () => {
        const connectValue = 'connect';
        CartesiDAppFactory__factory.connect = (): CartesiDAppFactory =>
            connectValue as unknown as CartesiDAppFactory;

        let isDeploymentCalled = false;
        mockUseRollupsFactory.mockReturnValue({
            queryFilter: () => ({
                then: function () {
                    return this;
                },
                catch: function () {
                    return this;
                },
            }),
            filters: {
                ApplicationCreated: () => [],
            },
        } as unknown as CartesiDAppFactory);
        mockUseNetwork.mockReturnValue({
            ...defaultNetwork,
            deployment: () => {
                isDeploymentCalled = true;
                return Promise.resolve({
                    address: account,
                    transaction: null,
                    receipt: null,
                    transactionHash: null,
                });
            },
        });

        await waitFor(() => {
            renderHook(() => useApplications());
        });

        expect(isDeploymentCalled).toBe(true);
    });
});
