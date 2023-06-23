// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

//
import { WalletConnectionProvider } from '@explorer/wallet/src/provider';
import { render, screen } from '@testing-library/react';
import Web3Container, {
    appMetaData,
    chainIds,
} from '../../src/components/Web3Container';

const path = '@explorer/wallet/src/provider';
jest.mock(path, () => {
    const originalModule = jest.requireActual(path);
    return {
        __esModule: true,
        ...originalModule,
        WalletConnectionProvider: jest.fn(),
    };
});

const MockWalletConnectionProvider =
    WalletConnectionProvider as jest.MockedFunction<
        typeof WalletConnectionProvider
    >;

describe('Web3Container component', () => {
    it('should display children', () => {
        const text = 'Test ABC';
        MockWalletConnectionProvider.mockImplementation(({ children }) => (
            <div>{children}</div>
        ));

        render(<Web3Container>{text}</Web3Container>);

        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should provide to WalletConnectionProvider required props', () => {
        let componentChainIds = null;
        let componentAppDMetaData = null;
        const mockedWalletConnectionProvider = (props) => {
            componentChainIds = props.chainIds;
            componentAppDMetaData = props.appMetaData;
            return null;
        };
        MockWalletConnectionProvider.mockImplementation(
            mockedWalletConnectionProvider
        );

        render(<Web3Container>Test ABC</Web3Container>);

        expect(componentChainIds).toBe(chainIds);
        expect(componentAppDMetaData).toBe(appMetaData);
    });
});
