// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen } from '@testing-library/react';
import PoolPerformanceExtended from '../../../src/components/stake/PoolPerformanceExtended';
import useStakingPoolsExtended from '../../../src/graphql/hooks/useStakingPoolsExtended';
import { useVisibilityThreshold } from '../../../src/utils/hooks/useVisibilityThreshold';
import { withChakraTheme } from '../../test-utilities';
import { QueryResult } from '@apollo/client';
import {
    StakingPoolsExtendedData,
    StakingPoolsVars,
} from '../../../src/graphql/models';

jest.mock('../../../src/graphql/hooks/useStakingPoolsExtended');
jest.mock('../../../src/utils/hooks/useVisibilityThreshold', () => ({
    useVisibilityThreshold: jest.fn(),
}));

const mockedUseStakingPools = useStakingPoolsExtended as jest.MockedFunction<
    typeof useStakingPoolsExtended
>;
const mockedUseVisibilityThreshold =
    useVisibilityThreshold as jest.MockedFunction<
        typeof useVisibilityThreshold
    >;

const Component = withChakraTheme(PoolPerformanceExtended);
const props = {
    chainId: 5,
    pages: 1,
    search: '',
};

describe('PoolPerformanceExtended component', () => {
    beforeEach(() => {
        mockedUseStakingPools.mockReturnValue({
            data: undefined,
            loading: false,
        } as unknown as QueryResult<StakingPoolsExtendedData, StakingPoolsVars>);

        mockedUseVisibilityThreshold.mockReturnValue({
            isBelow: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display pagination when there is no search query', () => {
        render(<Component {...props} search={undefined} />);
        expect(
            screen.getByTestId('pool-performance-extended-pagination')
        ).toBeInTheDocument();
    });

    it('Should not display pagination when there is search query', () => {
        render(<Component {...props} search="Some search" />);
        expect(() =>
            screen.getByTestId('pool-performance-extended-pagination')
        ).toThrow('Unable to find an element');
    });
});
