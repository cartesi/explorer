// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client/react';
import { renderHook, waitFor } from '@testing-library/react';
import { userShare } from '../../../src/graphql/hooks/usePoolBalances';
import useTotalPoolBalance from '../../../src/graphql/hooks/useTotalPoolBalance';
import { PoolBalance } from '../../../src/graphql/models';

// Baselines captured from the FixedNumber implementation. Amounts are compared
// in CTSI with a tolerance: FixedNumber truncated the share ratio to 18 decimals.
jest.mock('@apollo/client/react', () => {
    const original = jest.requireActual('@apollo/client/react');
    return { __esModule: true, ...original, useQuery: jest.fn() };
});

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

const balance = (
    shares: string,
    poolShares: string,
    poolAmount: string,
): PoolBalance =>
    ({
        id: `${shares}/${poolShares}`,
        shares,
        balance: '0',
        stakeTimestamp: 0,
        user: { id: '0xabc' },
        pool: { id: '0xpool', shares: poolShares, amount: poolAmount },
    }) as unknown as PoolBalance;

const asCTSI = (wei: unknown): number => Number(String(wei)) / 1e18;

describe('pool balance maths (characterization)', () => {
    describe('userShare', () => {
        it('returns the user share of the pool as a fraction', () => {
            expect(
                userShare(
                    balance(
                        '250000000000000000000',
                        '1000000000000000000000',
                        '0',
                    ),
                ),
            ).toBe(0.25);
            expect(userShare(balance('1', '3', '0'))).toBeCloseTo(
                0.3333333333333333,
                15,
            );
        });

        it('returns zero when the pool has no shares', () => {
            expect(userShare(balance('5', '0', '0'))).toBe(0);
        });
    });

    describe('useTotalPoolBalance', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('sums the user amount across pools, skipping pools without shares', async () => {
            mockedUseQuery.mockReturnValue({
                data: {
                    poolBalances: [
                        // 25% of a 4,000 CTSI pool
                        balance(
                            '250000000000000000000',
                            '1000000000000000000000',
                            '4000000000000000000000',
                        ),
                        // a third of a 10 CTSI pool
                        balance(
                            '1000000000000000000',
                            '3000000000000000000',
                            '10000000000000000000',
                        ),
                        // pool without shares contributes nothing
                        balance('7', '0', '100'),
                    ],
                },
                refetch: jest.fn(),
            } as any);

            const { result } = renderHook(() => useTotalPoolBalance('0xabc'));

            await waitFor(() => expect(asCTSI(result.current)).not.toBe(0));
            expect(asCTSI(result.current)).toBeCloseTo(1003.3333333333333, 9);
        });

        it('starts at zero and queries the zero address without a user', () => {
            mockedUseQuery.mockReturnValue({ data: undefined } as any);

            const { result } = renderHook(() => useTotalPoolBalance(undefined));

            expect(asCTSI(result.current)).toBe(0);
            expect(mockedUseQuery.mock.calls[0][1]).toMatchObject({
                variables: {
                    where: {
                        user: '0x0000000000000000000000000000000000000000',
                    },
                },
            });
        });
    });
});
