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
import { PoolHeader } from '../../../src/components/stake/PoolHeader';
import { useWallet } from '../../../src/contexts/wallet';
import { NextRouter, useRouter } from 'next/router';
import { withChakraTheme } from '../../test-utilities';
import { WalletConnectionContextProps } from '../../../src/contexts/wallet/definitions';
import { useFlag } from '@unleash/proxy-client-react';

jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

jest.mock('../../../src/contexts/wallet');
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

jest.mock('@unleash/proxy-client-react', () => ({
    useUnleashContext: () => jest.fn(),
    useFlag: jest.fn(),
}));
const useFlagStub = useFlag as jest.MockedFunction<typeof useFlag>;

const EPoolHeader = withChakraTheme(PoolHeader);

describe('Pool Header', () => {
    // a default configured component
    const renderComponent = () => render(<EPoolHeader />);

    beforeEach(() => {
        // default mock return
        mockUseRouter.mockReturnValue({
            query: {
                pool: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
            },
        } as unknown as NextRouter);

        mockUseWallet.mockReturnValue({
            chainId: 129803901,
        } as unknown as WalletConnectionContextProps);

        useFlagStub.mockImplementation(() => true);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display staking pool label', () => {
        renderComponent();
        expect(screen.getByText('Staking pool')).toBeInTheDocument();
    });
});
