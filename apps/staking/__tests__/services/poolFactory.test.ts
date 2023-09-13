// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { useWallet } from '@explorer/wallet/src/useWallet';
import { useStakingPoolFactory } from '../../src/services/poolFactory';
import { useTransaction, Transaction } from '../../src/services/transaction';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';
import { useStakingPoolFactoryContract } from '../../src/services/contracts';
import { StakingPoolFactoryImpl } from '@cartesi/staking-pool';
import { act } from 'react-dom/test-utils';

jest.mock('@explorer/wallet/src/useWallet');

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

jest.mock('../../src/services/eth', () => ({
    useBlockNumber: jest.fn(),
}));

jest.mock('../../src/services/contracts', () => ({
    useStakingPoolFactoryContract: jest.fn(),
}));

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;
const mockedUseStakingPoolFactoryContract =
    useStakingPoolFactoryContract as jest.MockedFunction<
        typeof useStakingPoolFactoryContract
    >;

const walletData = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    library: {
        getSigner: jest.fn(),
    } as unknown as Web3Provider,
    account: address,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
    network: {
        ensAddress: '0xb00299b573a9deee20e6a242416188d1033e325f',
    },
};

const stakingPoolFactoryContract = {
    createFlatRateCommission: jest.fn(),
    paused: () => Promise.resolve(),
    referencePool: () => Promise.resolve(),
    pos: () => Promise.resolve(),
};

describe('poolFactory service', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue(
            walletData as unknown as WalletConnectionContextProps
        );
        mockedUseStakingPoolFactoryContract.mockReturnValue(
            stakingPoolFactoryContract as unknown as StakingPoolFactoryImpl
        );
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should invoke createFlatRateCommission and related functions when poolFactory exists', async () => {
        const mockedSet = jest.fn();
        mockedUseTransaction.mockReturnValue({
            set: mockedSet,
        } as unknown as Transaction<any>);

        const mockedCreateFlatRateCommission = jest.fn();
        mockedUseStakingPoolFactoryContract.mockReturnValue({
            ...stakingPoolFactoryContract,
            createFlatRateCommission: mockedCreateFlatRateCommission,
        } as unknown as StakingPoolFactoryImpl);

        const { result } = renderHook(() => useStakingPoolFactory());
        await act(async () => {
            await result.current.createFlatRateCommission(1000);
        });

        expect(mockedSet).toHaveBeenCalled();
        expect(mockedCreateFlatRateCommission).toHaveBeenCalled();
    });

    it('should not set pos when poolFactory and account are undefined', () => {
        mockedUseStakingPoolFactoryContract.mockReturnValue(undefined);
        const { result } = renderHook(() => useStakingPoolFactory());
        expect(result.current.pos).toBe(null);
    });

    it('should set paused, ready and loading state when poolFactory and account are defined', async () => {
        const paused = true;
        mockedUseStakingPoolFactoryContract.mockReturnValue({
            ...stakingPoolFactoryContract,
            paused: () => Promise.resolve(paused),
            referencePool: () => Promise.resolve(address),
        } as unknown as StakingPoolFactoryImpl);

        const { result } = renderHook(() => useStakingPoolFactory());
        await waitFor(() => {
            expect(result.current.paused).toBe(paused);
            expect(result.current.ready).toBe(true);
            expect(result.current.loading).toBe(false);
        });
    });
});
