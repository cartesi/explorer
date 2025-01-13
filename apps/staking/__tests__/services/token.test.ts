// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CartesiToken } from '@cartesi/token';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { renderHook, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { act } from 'react';
import { useCartesiTokenContract } from '../../src/services/contracts';
import { useCartesiToken } from '../../src/services/token';
import { Transaction, useTransaction } from '../../src/services/transaction';

jest.mock('../../src/services/contracts', () => {
    const originalModule = jest.requireActual('../../src/services/contracts');
    return {
        __esModule: true,
        ...originalModule,
        useCartesiTokenContract: jest.fn(),
    };
});

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;

const mockedUseCartesiTokenContract =
    useCartesiTokenContract as jest.MockedFunction<
        typeof useCartesiTokenContract
    >;

const cartesiTokenData = {
    balanceOf: () => Promise.resolve(BigNumber.from(0)),
    allowance: () => Promise.resolve(BigNumber.from(0)),
    approve: jest.fn(),
} as unknown as CartesiToken;

describe('token service', () => {
    beforeEach(() => {
        mockedUseCartesiTokenContract.mockReturnValue(cartesiTokenData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly approve amount', async () => {
        const mockedSet = jest.fn();
        mockedUseTransaction.mockReturnValue({
            set: mockedSet,
        } as unknown as Transaction<any>);
        const { result } = renderHook(() => useCartesiToken());

        await act(async () => {
            await result.current.approve('spender', BigNumber.from('100000'));
        });

        expect(mockedSet).toHaveBeenCalled();
    });

    it('should set balance and allowance to zero when token and account are not defined', () => {
        const { result } = renderHook(() => useCartesiToken());

        expect(result.current.balance).toStrictEqual(BigNumber.from(0));
        expect(result.current.allowance).toStrictEqual(BigNumber.from(0));
    });

    it('should correctly set balance and allowance when token and account are defined', async () => {
        const balance = BigNumber.from('10000000');
        const allowance = BigNumber.from('10000000000');
        const account = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
        const spender = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
        mockedUseCartesiTokenContract.mockReturnValue({
            ...cartesiTokenData,
            balanceOf: () => Promise.resolve(balance),
            allowance: () => Promise.resolve(allowance),
        } as unknown as CartesiToken);
        const { result } = renderHook(() => useCartesiToken(account, spender));

        await waitFor(() => {
            expect(result.current.balance).toStrictEqual(balance);
            expect(result.current.allowance).toStrictEqual(allowance);
        });
    });

    it('should correctly parse CTSI', () => {
        const { result } = renderHook(() => useCartesiToken());

        const amount = 100000;
        expect(result.current.parseCTSI(amount)).toStrictEqual(
            parseUnits((amount * 1000).toString(), 15)
        );
    });

    it('should correctly convert to CTSI', () => {
        const { result } = renderHook(() => useCartesiToken());

        const amount = BigNumber.from('10000');
        expect(result.current.toCTSI(amount)).toStrictEqual(
            parseInt(formatUnits(amount, 18))
        );
    });

    it('should correctly convert to big CTSI', () => {
        const { result } = renderHook(() => useCartesiToken());

        const amount = BigNumber.from('10000');
        expect(result.current.toBigCTSI(amount)).toStrictEqual(
            BigNumber.from(result.current.toCTSI(amount))
        );
    });
});
