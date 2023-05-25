// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { withChakraTheme } from '../test-utilities';
import { Layout, LayoutProps } from '../../src/components';

const Component = withChakraTheme<LayoutProps>(Layout);
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
    const renderComponent = (props = {}) =>
        render(
            <Component {...defaultProps} {...props}>
                Footer
            </Component>
        );

    it('should display header links', () => {
        renderComponent();

        defaultProps.headerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should display footer links', () => {
        const { container } = renderComponent();

        defaultProps.footerLinks.forEach((link) => {
            const domLink = container.querySelector(`a[href="${link.href}"]`);
            const isLinkInDom = typeof domLink === 'object' && domLink !== null;

            expect(isLinkInDom).toBe(true);
        });
    });

    it('should display footer contracts', () => {
        renderComponent();

        defaultProps.footerContracts.forEach((contract) => {
            expect(screen.getByText(contract.name)).toBeInTheDocument();
        });
    });
});
