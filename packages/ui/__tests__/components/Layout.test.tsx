// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { act } from 'react-dom/test-utils';
import Layout from '../../src/components/Layout';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(Layout);
jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const defaultProps = {
    headerLinks: [
        {
            key: '1',
            label: 'Home',
            href: '/',
        },
    ],
    footerLinks: [
        { label: 'Google', href: 'https://google.com' },
        { label: 'Amazon', href: 'https://amazon.com' },
    ],
    footerGeneral: [
        {
            label: 'About Us',
            href: 'https://cartesi.io/about/',
        },
        {
            label: 'Docs',
            href: 'https://docs.cartesi.io/',
        },
    ],
    footerSupport: [
        {
            label: `What's New`,
            href: 'https://cartesi.io/blog/',
        },
        {
            label: 'Support on Discord',
            href: 'https://discord.com/invite/pfXMwXDDfW',
        },
        {
            label: 'FAQ',
            href: 'https://github.com/cartesi/noether/wiki/FAQ',
        },
    ],
    footerContracts: [
        {
            name: 'Contract A',
            address: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
        },
        {
            name: 'Contract B',
            address: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
        },
    ],
};

describe('Layout component', () => {
    beforeEach(() => {
        mockUseRouter.mockReturnValue({
            asPath: 'stake',
        } as unknown as NextRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) =>
        render(
            <Component {...defaultProps} {...props}>
                Footer
            </Component>
        );

    it('should display header links', async () => {
        await act(() => {
            renderComponent();
        });

        defaultProps.headerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should display footer links', async () => {
        const { container } = await act(() => renderComponent());

        defaultProps.footerLinks.forEach((link) => {
            const domLink = container.querySelector(`a[href="${link.href}"]`);
            const isLinkInDom = typeof domLink === 'object' && domLink !== null;

            expect(isLinkInDom).toBe(true);
        });
    });

    it('should display footer contracts', async () => {
        await act(() => {
            renderComponent();
        });

        defaultProps.footerContracts.forEach((contract) => {
            expect(screen.getByText(contract.name)).toBeInTheDocument();
        });
    });
});
