// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { act } from 'react';
import { NavBar, NavLink } from '../../../src/components/header/NavBar';
import { useWallet } from '../../../src/components/wallet/useWallet';

const walletMod = '../../../src/components/wallet/useWallet';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');
    return {
        __esModule: true,
        ...originalModule,
        usePathname: jest.fn(),
    };
});

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

const defaultProps = {
    links: [
        {
            key: 'home',
            label: 'Home',
            href: '/',
        },
        {
            key: 'stake',
            label: 'Stake',
            href: '/stake',
        },
        {
            key: 'runners',
            label: 'Node Runners',
            href: '/node-runners',
        },
        {
            key: 'blocks',
            label: 'Blocks',
            href: '/blocks',
        },
    ],
};

describe('Nav Bar', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });
        mockUsePathname.mockReturnValue('stake');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display children', async () => {
        const label = 'Children';
        await act(async () => {
            render(<NavLink href="/">{label}</NavLink>);
        });

        await waitFor(() => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it('Should display menu button', async () => {
        mockUsePathname.mockReturnValue('stake');
        await act(async () => {
            render(<NavBar {...defaultProps} />);
        });

        await waitFor(() => {
            const button = screen.getByTestId('menu-button');
            expect(button).toBeInTheDocument();
        });
    });

    it('Should display links container', async () => {
        await act(async () => {
            render(<NavBar {...defaultProps} />);
        });

        await waitFor(() => {
            const element = screen.getByTestId('links-container');
            expect(element).toBeInTheDocument();
        });
    });

    it('Should display theme toggle button', async () => {
        await act(async () => {
            render(<NavBar {...defaultProps} />);
        });

        await waitFor(() => {
            const button = screen.getByTestId('theme-toggle-button');
            expect(button).toBeInTheDocument();
        });
    });

    it('Should toggle mobile menu', async () => {
        await act(async () => {
            render(<NavBar {...defaultProps} />);
        });

        await waitFor(() => {
            const button = screen.getByTestId('menu-button');
            fireEvent.click(button);
            const element = screen.getByTestId('mobile-menu');
            expect(element).toBeInTheDocument();
            fireEvent.click(button);
            expect(() => screen.getByTestId('mobile-menu')).toThrow(
                'Unable to find an element'
            );
        });
    });
});
