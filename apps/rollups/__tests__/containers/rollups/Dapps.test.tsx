// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, fireEvent, render, screen } from '@testing-library/react';
import { withChakraTheme } from '../../test-utilities';
import {
    DappsSummary,
    DappsFilters,
    dappsFilterOptions,
} from '../../../src/containers/rollups/Dapps';
import { DApp_OrderBy } from '../../../src/generated/graphql';

const DappsSummaryComponent = withChakraTheme(DappsSummary);

const DappsFiltersComponent = withChakraTheme(DappsFilters);

const dapps = Array.from({ length: 3 }).map((_, index) => ({
    id: String(index + 1),
    inputCount: index + 1,
    deploymentTimestamp: Math.floor(Date.now() / 1000),
}));

describe('DApps', () => {
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

        it('invokes onChangeSearch when search is changed', () => {
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
