// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';
import { PoolHeader } from '../../../src/components/stake/PoolHeader';
import { WalletConnectionContextProps } from '../../../src/components/wallet/definitions';
import { useWallet } from '../../../src/components/wallet/useWallet';
import useFlag from '../../../src/hooks/useFlag';
import { withChakraTheme } from '../../test-utilities';

jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');
    return {
        __esModule: true,
        ...originalModule,
        useParams: jest.fn(),
    };
});
const useParamsMock = useParams as jest.MockedFunction<typeof useParams>;

jest.mock('../../../src/components/wallet/useWallet');
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

jest.mock('../../../src/hooks/useFlag');

const useFlagStub = useFlag as jest.MockedFunction<typeof useFlag>;

const EPoolHeader = withChakraTheme(PoolHeader);

const query = {
    pool: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
};

describe('Pool Header', () => {
    // a default configured component
    const renderComponent = (props = {}) => render(<EPoolHeader {...props} />);

    beforeEach(() => {
        // default mock return
        useParamsMock.mockReturnValue(query);

        mockUseWallet.mockReturnValue({
            chainId: 129803901,
        } as unknown as WalletConnectionContextProps);

        useFlagStub.mockImplementation(() => true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display staking pool label', () => {
        renderComponent();
        expect(screen.getByText('Staking pool')).toBeInTheDocument();
    });

    it('Should display manage link', () => {
        renderComponent({
            isManager: true,
        });

        const link = screen.getByTestId('pool-management-link');

        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe(`/pools/${query.pool}/manage`);
    });

    it('Should display manage link with "from" query param', () => {
        const from = 'commissions';
        renderComponent({
            from,
            isManager: true,
        });

        const link = screen.getByTestId('pool-management-link');

        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe(
            `/pools/${query.pool}/manage?from=${from}`
        );
    });
});
