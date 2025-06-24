// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { StakingTabNavigation } from '../../../src/components/stake/StakingTabNavigation';
import { useParams, usePathname } from 'next/navigation';
import { withChakraTheme } from '../../test-utilities';

jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');
    return {
        __esModule: true,
        ...originalModule,
        usePathname: jest.fn(),
        useParams: jest.fn(),
    };
});

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';

const useParamsMock = useParams as jest.MockedFunction<typeof useParams>;
const usePathnameMock = usePathname as jest.MockedFunction<typeof usePathname>;

const EStakingTabNavigation = withChakraTheme(StakingTabNavigation);

describe('Staking Tab Navigation', () => {
    // a default configured component
    const renderComponent = () => render(<EStakingTabNavigation />);

    beforeEach(() => {
        // default mock return
        useParamsMock.mockReturnValue({
            pool: address,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display pool info label', () => {
        renderComponent();
        expect(screen.getByText('Pool Info')).toBeInTheDocument();
    });

    it('Should lead to pool info page', () => {
        renderComponent();
        expect(
            screen.getByText('Pool Info').closest('a').getAttribute('href')
        ).toBe(`/stake/${address}`);
    });

    it('Should display stake label', () => {
        renderComponent();
        expect(screen.getByText('Stake')).toBeInTheDocument();
    });

    it('Should lead to pool stake page', () => {
        renderComponent();
        expect(
            screen.getByText('Stake').closest('a').getAttribute('href')
        ).toBe(`/stake/${address}/stake`);
    });

    it('Should activate stake tab', () => {
        useParamsMock.mockReturnValue({
            pool: address,
            pathname: '/stake/[pool]/stake',
        });
        usePathnameMock.mockReturnValue('/stake/[pool]/stake');

        renderComponent();

        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            'true'
        );
        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            'false'
        );
    });

    it('Should activate pool info tab', () => {
        useParamsMock.mockReturnValue({
            pool: address,
        });
        usePathnameMock.mockReturnValue('/stake/[pool]');

        const { rerender } = renderComponent();

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            'true'
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            'false'
        );

        useParamsMock.mockReturnValue({
            pool: address,
        });
        usePathnameMock.mockReturnValue('/stake/[pool]/users');

        rerender(<EStakingTabNavigation />);

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            'true'
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            'false'
        );

        useParamsMock.mockReturnValue({
            pool: address,
            pathname: '/stake/[pool]/commissions',
        });
        usePathnameMock.mockReturnValue('/stake/[pool]/commissions');

        rerender(<EStakingTabNavigation />);

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            'true'
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            'false'
        );
    });
});
