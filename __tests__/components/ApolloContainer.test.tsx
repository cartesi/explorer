// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import ApolloContainer from '../../src/components/ApolloContainer';
import { useWallet } from '../../src/components/wallet/useWallet';
import { useApollo } from '../../src/services/apollo';
import { withChakraTheme } from '../test-utilities';

const useWalletMod = '../../src/components/wallet/useWallet';

jest.mock('@apollo/client', () => {
    const originalModule = jest.requireActual('@apollo/client');
    return {
        __esModule: true,
        ...originalModule,
        ApolloProvider: ({ children }) => <div>{children}</div>,
    };
});

jest.mock('../../src/services/apollo', () => {
    const originalModule = jest.requireActual('../../src/services/apollo');
    return {
        __esModule: true,
        ...originalModule,
        useApollo: jest.fn(),
    };
});

jest.mock(useWalletMod, () => {
    const originalModule = jest.requireActual(useWalletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const mockedUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockedUseApollo = useApollo as jest.MockedFunction<typeof useApollo>;
const walletData = {
    account,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
};

const Component = withChakraTheme(ApolloContainer);

describe('ApolloContainer component', () => {
    beforeEach(() => {
        mockedUseWallet.mockReturnValue(walletData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display correct content', () => {
        const content = 'Content';
        render(<Component>{content}</Component>);
        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should invoke useApollo hook with chain id', () => {
        const implementation = jest.fn();
        mockedUseApollo.mockImplementation(implementation);

        render(<Component>Content</Component>);
        expect(implementation).toHaveBeenCalledWith(walletData.chainId);
    });
});
