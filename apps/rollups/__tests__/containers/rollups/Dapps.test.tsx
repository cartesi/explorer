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
import { withChakraTheme } from '../../test-utilities';
import {
    dappsFilterOptions,
    DappsFilters,
    DappsSummary,
    Dapps,
} from '../../../src/containers/rollups/Dapps';
import {
    DApp_OrderBy,
    DappsQuery,
    useDappsQuery,
    useDashboardQuery,
} from '../../../src/generated/graphql';
import { UseQueryResponse } from 'urql';
import { CombinedError, Operation } from '@urql/core';

const path = '../../../src/generated/graphql';
jest.mock(path, () => {
    const originalModule = jest.requireActual(path);
    return {
        __esModule: true,
        ...originalModule,
        useDappsQuery: jest.fn(),
        useDashboardQuery: jest.fn(),
    };
});

const DappsSummaryComponent = withChakraTheme(DappsSummary);
const DappsFiltersComponent = withChakraTheme(DappsFilters);
const DappsComponent = withChakraTheme(Dapps);

const mockUseDappsQuery = useDappsQuery as jest.MockedFunction<
    typeof useDappsQuery
>;
const mockUseDashboardQuery = useDashboardQuery as jest.MockedFunction<
    typeof useDashboardQuery
>;

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';

describe('DApps', () => {
    describe('Dapps component', () => {
        beforeEach(() => {
            mockUseDappsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
            mockUseDashboardQuery.mockReturnValue([
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
            mockUseDashboardQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    data: {
                        dashboard: {
                            id: '1',
                            factoryCount: 1,
                            dappCount: 0,
                            inputCount: 0,
                        },
                    },
                },
                () => undefined,
            ]);

            const { rerender } = render(
                <DappsComponent chainId={5} address={address} />
            );
            expect(screen.getByTestId('dapps-summary')).toBeInTheDocument();

            mockUseDashboardQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
            rerender(<DappsComponent chainId={5} address={address} />);

            expect(() => screen.getByTestId('dapps-summary')).toThrow(
                'Unable to find an element'
            );
        });

        it('should display error', () => {
            mockUseDappsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    error: {
                        message: 'Error',
                    } as CombinedError,
                },
                () => undefined,
            ]);

            const { rerender } = render(
                <DappsComponent chainId={5} address={address} />
            );
            expect(
                screen.getByText('Error fetching DApps!')
            ).toBeInTheDocument();

            mockUseDappsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
            rerender(<DappsComponent chainId={5} address={address} />);

            expect(() => screen.getByText('Error fetching DApps!')).toThrow(
                'Unable to find an element'
            );
        });

        it('should display dapps filters and list', () => {
            mockUseDappsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    data: {
                        dapps: [
                            {
                                id: '1',
                                deploymentTimestamp:
                                    new Date().getTime() / 1000,
                                activityTimestamp: new Date().getTime() / 1000,
                                factory: {
                                    id: '2',
                                },
                                inputCount: 0,
                            },
                        ],
                    },
                },
                () => undefined,
            ]);

            render(<DappsComponent chainId={5} address={address} />);
            expect(screen.getByTestId('dapps-filters')).toBeInTheDocument();
            expect(screen.getByTestId('dapps-list')).toBeInTheDocument();
        });

        it('should not display dapps filters and list when error has occurred', () => {
            mockUseDappsQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    error: {
                        message: 'Error',
                    } as CombinedError,
                    data: {
                        dapps: [
                            {
                                id: '1',
                                deploymentTimestamp:
                                    new Date().getTime() / 1000,
                                activityTimestamp: new Date().getTime() / 1000,
                                factory: {
                                    id: '2',
                                },
                                inputCount: 0,
                            },
                        ],
                    },
                },
                () => undefined,
            ]);

            render(<DappsComponent chainId={5} address={address} />);
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
                    orderBy={DApp_OrderBy.ActivityTimestamp}
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
                    orderBy={DApp_OrderBy.ActivityTimestamp}
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
                    orderBy={DApp_OrderBy.ActivityTimestamp}
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
                    orderBy={DApp_OrderBy.ActivityTimestamp}
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
