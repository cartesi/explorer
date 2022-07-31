// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useWallet } from '../../../src/contexts/wallet';
import NavBar, {
    buildLinks,
    NavLink,
} from '../../../src/components/header/NavBar';

const walletMod = `../../../src/contexts/wallet`;
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

jest.mock('@unleash/proxy-client-react', () => ({
    useUnleashContext: () => jest.fn(),
    useFlag: jest.fn(),
}));

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('Nav Bar', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('Should generate correct default nav links', () => {
        const links = buildLinks({
            newNodeRunnersEnabled: false,
        });

        expect(links.length).toBe(4);

        expect(links[0].key).toBe('home');
        expect(links[0].label).toBe('Home');
        expect(links[0].href).toBe('/');

        expect(links[1].key).toBe('pools');
        expect(links[1].label).toBe('Stake');
        expect(links[1].href).toBe('/pools');

        expect(links[2].key).toBe('staking');
        expect(links[2].label).toBe('Node Runners');
        expect(links[2].href).toBe('/staking');

        expect(links[3].key).toBe('blocks');
        expect(links[3].label).toBe('Blocks');
        expect(links[3].href).toBe('/blocks');
    });

    it('Should generate nav link for new staking', () => {
        const links = buildLinks({
            newNodeRunnersEnabled: true,
        });

        expect(links.length).toBe(5);

        expect(links[4].key).toBe('newStaking');
        expect(links[4].label).toBe('New Node Runners');
        expect(links[4].href).toBe('/newStaking');
    });

    it('Should display children', () => {
        const label = 'Children';

        render(
            <NavLink href="/">
                <span>{label}</span>
            </NavLink>
        );

        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('Should display menu button', () => {
        render(<NavBar />);

        const button = screen.getByTestId('menu-button');
        expect(button).toBeInTheDocument();
    });

    it('Should display links container', () => {
        render(<NavBar />);

        const element = screen.getByTestId('links-container');
        expect(element).toBeInTheDocument();
    });

    it('Should display theme toggle button', () => {
        render(<NavBar />);

        const button = screen.getByTestId('theme-toggle-button');
        expect(button).toBeInTheDocument();
    });

    it('Should toggle mobile menu', () => {
        render(<NavBar />);

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
