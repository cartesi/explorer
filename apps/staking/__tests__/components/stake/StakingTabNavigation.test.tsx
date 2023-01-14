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
import { StakingTabNavigation } from '../../../src/components/stake/StakingTabNavigation';
import { NextRouter, useRouter } from 'next/router';
import { withChakraTheme } from '../../test-utilities';

jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const EStakingTabNavigation = withChakraTheme(StakingTabNavigation);

describe('Staking Tab Navigation', () => {
    // a default configured component
    const renderComponent = () => render(<EStakingTabNavigation />);

    beforeEach(() => {
        // default mock return
        mockUseRouter.mockReturnValue({
            query: {
                pool: address,
            },
        } as unknown as NextRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display pool info label', () => {
        renderComponent();
        expect(screen.getByText('Pool Info')).toBeInTheDocument();
    });

    it('Should lead to pool info page', () => {
        renderComponent();
        expect(screen.getByText('Pool Info').getAttribute('href')).toBe(
            `/stake/${address}`
        );
    });

    it('Should display stake label', () => {
        renderComponent();
        expect(screen.getByText('Stake')).toBeInTheDocument();
    });

    it('Should lead to pool stake page', () => {
        renderComponent();
        expect(screen.getByText('Stake').getAttribute('href')).toBe(
            `/stake/${address}/stake`
        );
    });

    it('Should activate stake tab', () => {
        mockUseRouter.mockReturnValue({
            query: {
                pool: address,
            },
            pathname: '/stake/[pool]/stake',
        } as unknown as NextRouter);

        renderComponent();

        expect(screen.getByText('Stake').getAttribute('data-active')).toBe('');
        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            null
        );
    });

    it('Should activate pool info tab', () => {
        mockUseRouter.mockReturnValue({
            query: {
                pool: address,
            },
            pathname: '/stake/[pool]',
        } as unknown as NextRouter);

        const { rerender } = renderComponent();

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            ''
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            null
        );

        mockUseRouter.mockReturnValue({
            query: {
                pool: address,
            },
            pathname: '/stake/[pool]/users',
        } as unknown as NextRouter);

        rerender(<EStakingTabNavigation />);

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            ''
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            null
        );

        mockUseRouter.mockReturnValue({
            query: {
                pool: address,
            },
            pathname: '/stake/[pool]/commissions',
        } as unknown as NextRouter);

        rerender(<EStakingTabNavigation />);

        expect(screen.getByText('Pool Info').getAttribute('data-active')).toBe(
            ''
        );
        expect(screen.getByText('Stake').getAttribute('data-active')).toBe(
            null
        );
    });
});
