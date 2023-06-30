// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CartesiDAppFactory } from '@cartesi/rollups';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useInputBoxMeta } from '../../src/services/contracts/inputBox';
import { useApplications } from '../../src/services/useApplications';
import { networks, useNetwork } from '../../src/services/useNetwork';
import { useRollupsFactory } from '../../src/services/useRollupsFactory';
import {
    buildApplicationCreatedEvent,
    buildUseInputBoxMetaReturn,
    buildUseRollupFactoryReturn,
} from './mocks';

const networkMod = '../../src/services/useNetwork';
const rollupsMod = '../../src/services/useRollupsFactory';
const inputBoxMod = '../../src/services/contracts/inputBox';
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
        useRollupLegacyFactories: jest.fn(),
    };
});

jest.mock(inputBoxMod, () => {
    const originalModule = jest.requireActual(inputBoxMod);
    return {
        __esModule: true,
        ...originalModule,
        useInputBoxMeta: jest.fn(),
    };
});

const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;
const mockUseRollupsFactory = useRollupsFactory as jest.MockedFunction<
    typeof useRollupsFactory
>;

const mockUseInputBoxMeta = useInputBoxMeta as jest.MockedFunction<
    typeof useInputBoxMeta
>;

const defaultNetwork = networks[0x5];

describe('useApplications Hook', () => {
    beforeEach(() => {
        mockUseInputBoxMeta.mockReturnValue(buildUseInputBoxMetaReturn());
        mockUseRollupsFactory.mockReturnValue(buildUseRollupFactoryReturn());
        mockUseNetwork.mockReturnValue({
            ...defaultNetwork,
            deployment: () => {
                return Promise.resolve({
                    address: account,
                    transaction: null,
                    receipt: null,
                    transactionHash: null,
                });
            },
        });

        // Keep the tests log clean.
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
    });

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
        expect(applications.result.current.error).not.toBeDefined();
    });

    it("should set correct application state when when rollups factory doesn't exist", () => {
        mockUseNetwork.mockReturnValue(defaultNetwork);
        mockUseRollupsFactory.mockReturnValue(undefined);

        const applications = renderHook(() => useApplications());
        expect(applications.result.current.loading).toBe(false);
        expect(applications.result.current.applications.length).toBe(0);
        expect(applications.result.current.error).not.toBeDefined();
    });

    it('should invoke the network deployment function when network and rollups factory exist', async () => {
        let isDeploymentCalled = false;
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

        await act(async () => {
            waitFor(() => {
                renderHook(() => useApplications());
            });
        });

        expect(isDeploymentCalled).toBe(true);
    });

    it('should retrieve DApp (v0.9) information directly from smartcontract', async () => {
        const factory = buildUseRollupFactoryReturn();
        factory.queryFilter = jest.fn(() =>
            Promise.resolve<any>([buildApplicationCreatedEvent()])
        );

        mockUseRollupsFactory.mockReturnValue(factory);

        const { result } = renderHook(() => useApplications());
        const currentResult = result.current;

        await waitFor(() => expect(result.current).not.toBe(currentResult));

        expect(result.current.applications).toHaveLength(1);
        expect(result.current.applications[0]).toHaveProperty(
            'factoryVersion',
            '0.9'
        );
        expect(result.current.applications[0]).toHaveProperty(
            'address',
            '0x64'
        );
        expect(result.current.applications[0]).toHaveProperty(
            'deploymentTimestamp'
        );
        expect(result.current.applications[0].inputs.length).toBe(2);
    });

    it('should provide error in case of failure when fetching applications data', async () => {
        const factory = buildUseRollupFactoryReturn();
        factory.queryFilter = jest.fn(() =>
            Promise.reject(new Error('Network unresponsive'))
        );

        mockUseRollupsFactory.mockReturnValue(factory);

        const { result } = renderHook(() => useApplications());
        const currentResult = result.current;

        await waitFor(() => expect(result.current).not.toBe(currentResult));

        expect(result.current.applications).toHaveLength(0);
        expect(result.current.error).toEqual(new Error('Network unresponsive'));
    });

    it('should log error when fails to retrieve inputs, but keep the inputs as an empty list', async () => {
        const factory = buildUseRollupFactoryReturn();
        factory.queryFilter = jest.fn(() =>
            Promise.resolve<any>([buildApplicationCreatedEvent()])
        );
        mockUseRollupsFactory.mockReturnValue(factory);

        const inputBoxMeta = buildUseInputBoxMetaReturn();
        inputBoxMeta.getInputs = jest.fn(() =>
            Promise.reject(new Error('not found'))
        );
        mockUseInputBoxMeta.mockReturnValue(inputBoxMeta);
        const errorLog = jest
            .spyOn(console, 'error')
            .mockImplementation(jest.fn());

        const { result } = renderHook(() => useApplications());
        const currentResult = result.current;

        await waitFor(() => expect(result.current).not.toBe(currentResult));

        expect(result.current.applications).toHaveLength(1);
        expect(result.current.applications[0].inputs).toHaveLength(0);
        expect(errorLog).toHaveBeenCalledWith(new Error('not found'));
    });
});
