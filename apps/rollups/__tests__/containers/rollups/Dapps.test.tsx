// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import { CombinedError } from '@urql/core';
import {
    Dapps,
    DappsFilters,
    DappsSummary,
    dappsFilterOptions,
} from '../../../src/containers/rollups/Dapps';
import { withChakraTheme } from '../../test-utilities';

import {
    ApplicationOrderByInput,
    useApplicationsQuery,
    useRollupsSummaryQuery,
} from '../../../src/generated/graphql/squid';

const squidPath = '../../../src/generated/graphql/squid/';

jest.mock(squidPath, () => {
    const originalModule = jest.requireActual(squidPath);
    return {
        __esModule: true,
        ...originalModule,
        useRollupsSummaryQuery: jest.fn(),
        useApplicationsQuery: jest.fn(),
    };
});

const DappsSummaryComponent = withChakraTheme(DappsSummary);
const DappsFiltersComponent = withChakraTheme(DappsFilters);

const mockUseApplicationsQuery = useApplicationsQuery as jest.MockedFunction<
    typeof useApplicationsQuery
>;

const mockUseRollupsSummaryQuery =
    useRollupsSummaryQuery as jest.MockedFunction<
        typeof useRollupsSummaryQuery
    >;

const DappsComponent = withChakraTheme(Dapps);

describe('DApps container', () => {
    describe('Dapps component', () => {
        beforeEach(() => {
            mockUseApplicationsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
            mockUseRollupsSummaryQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
        });

        afterEach(() => {
            cleanup();
            jest.resetAllMocks();
        });

        it('should display dapps summary', () => {
            mockUseRollupsSummaryQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    data: {
                        rollupsSummary: {
                            totalApplications: 3,
                            totalInputs: 2,
                        },
                    },
                },
                () => undefined,
            ]);

            render(<DappsComponent chainId={11155111} />);

            expect(screen.getByTestId('dapps-summary')).toBeInTheDocument();
        });

        it('should display error', () => {
            mockUseApplicationsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    error: {
                        message: 'Error',
                    } as CombinedError,
                },
                () => undefined,
            ]);

            const { rerender } = render(<DappsComponent chainId={5} />);
            expect(
                screen.getByText('Error fetching DApps!')
            ).toBeInTheDocument();

            mockUseApplicationsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
            rerender(<DappsComponent chainId={5} />);

            expect(() => screen.getByText('Error fetching DApps!')).toThrow(
                'Unable to find an element'
            );
        });

        it('should not display dapps filters and list when error has occurred', () => {
            mockUseApplicationsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    error: {
                        message: 'Error',
                    } as CombinedError,
                    data: {
                        applications: [
                            {
                                id: '1',
                                deploymentTimestamp: new Date()
                                    .getTime()
                                    .toString(),
                                activityTimestamp: new Date()
                                    .getTime()
                                    .toString(),
                                inputCount: 0,
                            },
                        ],
                    },
                },
                () => undefined,
            ]);

            render(<DappsComponent chainId={5} />);
            expect(() => screen.getByTestId('dapps-filters')).toThrow(
                'Unable to find an element'
            );
            expect(() => screen.getByTestId('dapps-list')).toThrow(
                'Unable to find an element'
            );
        });
    });

    describe('DappsSummary component', () => {
        it('should render correct labels', () => {
            render(<DappsSummaryComponent dappCount={0} inputCount={0} />);

            expect(screen.getByText('# DApps')).toBeInTheDocument();
            expect(screen.getByText('# Inputs')).toBeInTheDocument();
        });

        it('should render correct dappCount and inputCount', () => {
            const dappCount = 10;
            const inputCount = 20;

            render(
                <DappsSummaryComponent
                    dappCount={dappCount}
                    inputCount={inputCount}
                />
            );

            expect(screen.getByText(dappCount)).toBeInTheDocument();
            expect(screen.getByText(inputCount)).toBeInTheDocument();
        });
    });

    describe('DappsFilters component', () => {
        it('should render correct options', () => {
            render(
                <DappsFiltersComponent
                    orderBy={ApplicationOrderByInput.ActivityTimestampDesc}
                    fetching={false}
                    onChangeSearch={() => undefined}
                    onChangeOrderBy={() => undefined}
                />
            );

            dappsFilterOptions.forEach((option) => {
                const label = screen.getByText(option.label);
                expect(label).toBeInTheDocument();
                expect(label.getAttribute('value')).toBe(option.value);
            });
        });

        it('invokes onChangeSearch when search is changed', () => {
            const onChangeSearch = jest.fn();
            render(
                <DappsFiltersComponent
                    orderBy={ApplicationOrderByInput.ActivityTimestampDesc}
                    fetching={false}
                    onChangeSearch={onChangeSearch}
                    onChangeOrderBy={() => undefined}
                />
            );

            const input = screen.getByPlaceholderText('Search');
            const nextSearch = 'test-abc';
            act(() => {
                fireEvent.change(input, { target: { value: nextSearch } });
            });

            expect(onChangeSearch).toBeCalledWith(nextSearch);
        });

        it('invokes onChangeOrderBy when orderBy is changed', () => {
            const onChangeOrderBy = jest.fn();
            render(
                <DappsFiltersComponent
                    orderBy={ApplicationOrderByInput.ActivityTimestampDesc}
                    fetching={false}
                    onChangeSearch={() => undefined}
                    onChangeOrderBy={onChangeOrderBy}
                />
            );

            const select = screen.getByTestId('dapps-filters-order-by');
            const nextOrderBy =
                dappsFilterOptions[dappsFilterOptions.length - 1].value;
            act(() => {
                fireEvent.change(select, { target: { value: nextOrderBy } });
            });

            expect(onChangeOrderBy).toBeCalledWith(nextOrderBy);
        });

        it('should display spinner when fetching', () => {
            render(
                <DappsFiltersComponent
                    orderBy={ApplicationOrderByInput.ActivityTimestampDesc}
                    fetching
                    onChangeSearch={() => undefined}
                    onChangeOrderBy={() => undefined}
                />
            );

            expect(
                screen.getByTestId('dapps-filters-spinner')
            ).toBeInTheDocument();
        });
    });
});
