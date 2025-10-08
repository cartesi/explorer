// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { useQuery } from '@apollo/client/react';
import { render, screen } from '@testing-library/react';
import { Route } from 'next';
import PoolPerformanceStat, {
    PoolPerformanceStatProps,
} from '../../../../src/components/stake/stats/PoolPerformanceStat';
import useStakingPoolPerformance from '../../../../src/graphql/hooks/useStakingPoolPerformance';
import {
    StakingPoolPerformanceData,
    StakingPoolPerformanceVars,
} from '../../../../src/graphql/models';
import { withChakraTheme } from '../../../test-utilities';

jest.mock('../../../../src/graphql/hooks/useStakingPoolPerformance');

const mockUseStakingPoolPerformance =
    useStakingPoolPerformance as jest.MockedFunction<
        typeof useStakingPoolPerformance
    >;

const defaultAddress = 'Angel Karaliichev 1 str.';
const defaultLocation: Route = '/';

const EPoolPerformanceStat =
    withChakraTheme<PoolPerformanceStatProps>(PoolPerformanceStat);

const mockedHook = {
    loading: false,
    data: {
        performance: {
            monthly: [{ id: '2', performance: '0.00', timestamp: 1682164800 }],
            weekly: [{ id: '1', performance: '0.00', timestamp: 1686744000 }],
        },
    },
} as useQuery.Result<
    StakingPoolPerformanceData,
    StakingPoolPerformanceVars,
    'complete' | 'empty'
>;

describe('Pool Performance Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EPoolPerformanceStat
                address={defaultAddress}
                location={defaultLocation}
            />
        );

    beforeEach(() => {
        // default mock return
        mockUseStakingPoolPerformance.mockReturnValue(mockedHook);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display pool performance label', () => {
        renderComponent();
        expect(screen.getByText('Pool Performance')).toBeInTheDocument();
    });

    it('Should display location icon', () => {
        renderComponent();

        expect(screen.getByTestId('location-icon')).toBeInTheDocument();
    });

    it('Should not display location icon', () => {
        render(<EPoolPerformanceStat address={defaultAddress} />);

        expect(() => screen.getByTestId('location-icon')).toThrow(
            'Unable to find an element'
        );
    });
});
