// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { renderHook } from '@testing-library/react';
import useStakingPools from '../../src/graphql/hooks/useStakingPools';
import { useQueryReturnFactory } from './mocks';

jest.mock('@apollo/client', () => ({ useQuery: jest.fn() }));

const useQueryMock = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useStakingPools', () => {
    beforeEach(() => {
        useQueryMock.mockReturnValue(useQueryReturnFactory());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should query default params', () => {
        const { result } = renderHook(() => useStakingPools());

        expect(result.current.data).toBeDefined();
        expect(result.current.data).toHaveLength(3);
        expect(useQueryMock.mock.calls[0][1]).toEqual({
            notifyOnNetworkStatusChange: true,
            pollInterval: 600000,
            variables: {
                first: 50,
                firstMonthlyPerf: 2,
                firstWeeklyPerf: 2,
                monthlyOrderBy: 'timestamp',
                monthlyOrderDirection: 'desc',
                orderBy: 'commissionPercentage',
                orderDirection: 'asc',
                skip: 0,
                weeklyOrderBy: 'timestamp',
                weeklyOrderDirection: 'desc',
                where: {},
                whereMonthly: {
                    performance_not: 0,
                    timestamp_gte: expect.any(Number),
                },
                whereWeekly: {
                    performance_not: 0,
                    timestamp_gte: expect.any(Number),
                },
            },
        });
    });

    it('should set the correct query params', () => {
        const { result } = renderHook(() =>
            useStakingPools({
                pageNumber: 1,
                sort: 'totalUsers',
                where: { id: '0x0', manager: '0x001' },
            })
        );

        expect(result.current.data).toBeDefined();
        expect(result.current.data).toHaveLength(3);
        expect(useQueryMock.mock.calls[0][1]).toEqual({
            notifyOnNetworkStatusChange: true,
            pollInterval: 600000,
            variables: {
                first: 50,
                firstMonthlyPerf: 2,
                firstWeeklyPerf: 2,
                monthlyOrderBy: 'timestamp',
                monthlyOrderDirection: 'desc',
                orderBy: 'totalUsers',
                orderDirection: 'desc',
                skip: 50,
                weeklyOrderBy: 'timestamp',
                weeklyOrderDirection: 'desc',
                where: {
                    id: '0x0',
                    manager: '0x001',
                },
                whereMonthly: {
                    performance_not: 0,
                    timestamp_gte: expect.any(Number),
                },
                whereWeekly: {
                    performance_not: 0,
                    timestamp_gte: expect.any(Number),
                },
            },
        });
    });
});
