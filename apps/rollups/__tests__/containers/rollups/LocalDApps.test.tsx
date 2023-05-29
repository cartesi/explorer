// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withChakraTheme } from '../../test-utilities';
import {
    DappsSummary,
    LocalDAppList,
} from '../../../src/containers/rollups/LocalDApps';
import { useApplications } from '../../../src/services/useApplications';

const path = '../../../src/services/useApplications';
jest.mock(path, () => {
    const originalModule = jest.requireActual(path);
    return {
        __esModule: true,
        ...originalModule,
        useApplications: jest.fn(),
    };
});

const DappsSummaryComponent = withChakraTheme(DappsSummary);
const LocalDAppListComponent = withChakraTheme(LocalDAppList);

const dappsSummaryProps = {
    dappCount: 2,
    inputCount: 10,
};

const localDappListProps = {
    chainId: 5,
};

const mockUseApplications = useApplications as jest.MockedFunction<
    typeof useApplications
>;

describe('LocalDApps container', () => {
    describe('DappsSummary component', () => {
        it('should display dapps count tooltip', async () => {
            render(<DappsSummaryComponent {...dappsSummaryProps} />);

            const text = 'Total number of DApps instantiated';
            const icon = screen.getByTestId('dapps-summary-dapps-count');
            await act(() => {
                userEvent.click(icon);
            });

            await screen.findByText(text);
            expect(screen.getByText(text)).toBeInTheDocument();
        });

        it('should display input count tooltip', async () => {
            render(<DappsSummaryComponent {...dappsSummaryProps} />);

            const text = 'Total number of inputs processed';
            const icon = screen.getByTestId('dapps-summary-input-count');
            await act(() => {
                userEvent.click(icon);
            });

            await screen.findByText(text);
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    describe('LocalDAppList component', () => {
        it('should display spinner only when loading', () => {
            mockUseApplications.mockReturnValue({
                loading: true,
                applications: [],
            });

            const { rerender } = render(
                <LocalDAppListComponent {...localDappListProps} />
            );
            const testId = 'local-dapp-list-spinner';

            expect(screen.getByTestId(testId)).toBeInTheDocument();

            mockUseApplications.mockReturnValue({
                loading: false,
                applications: [],
            });

            rerender(<LocalDAppListComponent {...localDappListProps} />);

            expect(() => screen.getByTestId(testId)).toThrow(
                'Unable to find an element'
            );
        });

        it('should display alert only when error has occurred', () => {
            const errorMessage = 'Error ABC';
            mockUseApplications.mockReturnValue({
                error: {
                    code: 1,
                    name: 'Error',
                    message: errorMessage,
                },
                loading: true,
                applications: [],
            });

            const { rerender } = render(
                <LocalDAppListComponent {...localDappListProps} />
            );

            expect(screen.getByText(errorMessage)).toBeInTheDocument();

            mockUseApplications.mockReturnValue({
                error: null,
                loading: false,
                applications: [],
            });

            rerender(<LocalDAppListComponent {...localDappListProps} />);

            expect(() => screen.getByText(errorMessage)).toThrow(
                'Unable to find an element'
            );
        });

        it('should display applications', () => {
            const errorMessage = 'Error XYZ';
            const applications = [
                {
                    factoryVersion: '0.9',
                    address: 'some-address',
                    inputs: [],
                    deploymentTimestamp: new Date().getTime() / 1000,
                },
            ];

            mockUseApplications.mockReturnValue({
                error: {
                    code: 1,
                    name: 'Error',
                    message: errorMessage,
                },
                loading: true,
                applications,
            });

            render(<LocalDAppListComponent {...localDappListProps} />);

            expect(screen.getAllByTestId('dapps-list-card').length).toBe(
                applications.length
            );
        });

        it('should display no items', () => {
            mockUseApplications.mockReturnValue({
                error: null,
                loading: false,
                applications: [],
            });

            render(<LocalDAppListComponent {...localDappListProps} />);
            expect(screen.getByText('No items')).toBeInTheDocument();
        });
    });
});
