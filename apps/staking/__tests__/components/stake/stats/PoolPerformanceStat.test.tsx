// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import PoolPerformanceStat, {
    PoolPerformanceStatProps,
} from '../../../../src/components/stake/stats/PoolPerformanceStat';
import { withChakraTheme } from '../../../test-utilities';
import usePoolShareInfoExtended from '../../../../src/graphql/hooks/usePoolShareInfoExtended';
import {
    PoolShareInfoExtendedData,
    StakingPoolsVars,
} from '../../../../src/graphql/models';
import { QueryResult } from '@apollo/client';

jest.mock('../../../../src/graphql/hooks/usePoolShareInfoExtended');
const mockUsePoolShareInfoExtended =
    usePoolShareInfoExtended as jest.MockedFunction<
        typeof usePoolShareInfoExtended
    >;

const defaultAddress = 'Angel Karaliichev 1 str.';
const defaultLocation = 'Bulgaria, Sofia';

const EPoolPerformanceStat =
    withChakraTheme<PoolPerformanceStatProps>(PoolPerformanceStat);

const mockedHook = {
    loading: false,
    data: {
        allStakingPools: {
            nodes: [
                {
                    id: '1',
                    weekPerformance: 0,
                    monthPerformance: 0,
                    shareValue: 0,
                },
            ],
        },
    },
} as QueryResult<PoolShareInfoExtendedData, Partial<StakingPoolsVars>>;

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
        mockUsePoolShareInfoExtended.mockReturnValue(mockedHook);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display pool performance label', () => {
        renderComponent();
        expect(screen.getByText('Pool Performance')).toBeInTheDocument();
    });

    it('Should display location icon', () => {
        renderComponent();

        expect(screen.getByRole('location-icon')).toBeInTheDocument();
    });

    it('Should not display location icon', () => {
        render(<EPoolPerformanceStat address={defaultAddress} />);

        expect(() => screen.getByRole('location-icon')).toThrow(
            'Unable to find an accessible element with the role "location-icon"'
        );
    });
});
