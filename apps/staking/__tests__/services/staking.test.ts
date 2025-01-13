// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { StakingImpl } from '@cartesi/pos';
import { renderHook, waitFor } from '@testing-library/react';
import { BigNumber, constants } from 'ethers';
import { act } from 'react';
import { useStakingContract } from '../../src/services/contracts';
import { useStaking } from '../../src/services/staking';
import { Transaction, useTransaction } from '../../src/services/transaction';

jest.mock('../../src/services/contracts', () => {
    const originalModule = jest.requireActual('../../src/services/contracts');
    return {
        __esModule: true,
        ...originalModule,
        useStakingContract: jest.fn(),
    };
});

jest.mock('../../src/services/eth', () => ({
    useBlockNumber: jest.fn(),
}));

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

const mockedUseStakingContract = useStakingContract as jest.MockedFunction<
    typeof useStakingContract
>;
const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;

const stakingContractData = {
    stake: jest.fn(),
    unstake: jest.fn(),
    withdraw: jest.fn(),
    getStakedBalance: () => Promise.resolve(BigNumber.from(0)),
    getMaturingTimestamp: () => Promise.resolve(BigNumber.from(0)),
    getReleasingTimestamp: () => Promise.resolve(BigNumber.from(0)),
    getMaturingBalance: () => Promise.resolve(BigNumber.from(0)),
    getReleasingBalance: () => Promise.resolve(BigNumber.from(0)),
};

describe('staking service', () => {
    beforeEach(() => {
        mockedUseStakingContract.mockReturnValue(
            stakingContractData as unknown as StakingImpl
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly set stake amount', async () => {
        const mockedSet = jest.fn();
        const stakeAmount = BigNumber.from('100000000000');
        mockedUseTransaction.mockReturnValue({
            set: mockedSet,
        } as unknown as Transaction<any>);
        const { result } = renderHook(() => useStaking(account));

        await act(async () => {
            await result.current.stake(stakeAmount);
        });

        expect(mockedSet).toHaveBeenCalled();
    });

    it('should correctly set unstake amount', async () => {
        const mockedSet = jest.fn();
        const stakeAmount = BigNumber.from('100000000000');
        mockedUseTransaction.mockReturnValue({
            set: mockedSet,
        } as unknown as Transaction<any>);
        const { result } = renderHook(() => useStaking(account));

        await act(async () => {
            await result.current.unstake(stakeAmount);
        });

        expect(mockedSet).toHaveBeenCalled();
    });

    it('should correctly set withdraw amount', async () => {
        const mockedSet = jest.fn();
        const stakeAmount = BigNumber.from('100000000000');
        mockedUseTransaction.mockReturnValue({
            set: mockedSet,
        } as unknown as Transaction<any>);
        const { result } = renderHook(() => useStaking(account));

        await act(async () => {
            await result.current.withdraw(stakeAmount);
        });

        expect(mockedSet).toHaveBeenCalled();
    });

    it('should set correct balances when staking and user are undefined', async () => {
        mockedUseStakingContract.mockReturnValue(undefined);
        const { result } = renderHook(() => useStaking(undefined));

        await waitFor(() => {
            expect(result.current.stakedBalance).toStrictEqual(constants.Zero);
            expect(result.current.releasingBalance).toStrictEqual(
                constants.Zero
            );
            expect(result.current.maturingBalance).toStrictEqual(
                constants.Zero
            );
        });
    });

    it('should set correct balances when staking and user are defined', async () => {
        const stakedBalance = BigNumber.from('1000000000');
        const maturingBalance = BigNumber.from('100000000000000');
        const releasingBalance = BigNumber.from('1000000000000000000');
        const maturingValue = BigNumber.from('1000000000');
        const releasingValue = BigNumber.from('1000000000');
        mockedUseStakingContract.mockReturnValue({
            ...stakingContractData,
            getStakedBalance: () => Promise.resolve(stakedBalance),
            getMaturingBalance: () => Promise.resolve(maturingBalance),
            getReleasingBalance: () => Promise.resolve(releasingBalance),
            getMaturingTimestamp: () => Promise.resolve(maturingValue),
            getReleasingTimestamp: () => Promise.resolve(releasingValue),
        } as unknown as StakingImpl);
        const { result } = renderHook(() => useStaking(account));

        await waitFor(() => {
            expect(result.current.stakedBalance).toStrictEqual(stakedBalance);
            expect(result.current.maturingBalance).toStrictEqual(
                maturingBalance
            );
            expect(result.current.releasingBalance).toStrictEqual(
                releasingBalance
            );
            expect(result.current.maturingTimestamp).toStrictEqual(
                new Date(maturingValue.toNumber() * 1000)
            );
            expect(result.current.releasingTimestamp).toStrictEqual(
                new Date(releasingValue.toNumber() * 1000)
            );
        });
    });
});
