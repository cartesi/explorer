// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(Footer);
const defaultProps = {
    links: [
        { label: 'Google', href: 'https://google.com' },
        { label: 'Amazon', href: 'https://amazon.com' },
    ],
    general: [
        {
            label: 'About Us',
            href: 'https://cartesi.io/about/',
        },
        {
            label: 'Docs',
            href: 'https://docs.cartesi.io/',
        },
    ],
    support: [
        {
            label: 'About Us',
            href: 'https://cartesi.io/about/',
        },
        {
            label: 'Docs',
            href: 'https://docs.cartesi.io/',
        },
    ],
    contracts: [
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

describe('Footer component', () => {
    it('should display links', () => {
        const { container } = render(<Component {...defaultProps} />);

        defaultProps.links.forEach((link) => {
            const domLink = container.querySelector(`a[href="${link.href}"]`);
            const isLinkInDom = typeof domLink === 'object' && domLink !== null;

            expect(isLinkInDom).toBe(true);
        });
    });

    it('should display contracts', () => {
        render(<Component {...defaultProps} />);

        defaultProps.contracts.forEach((contract) => {
            expect(screen.getByText(contract.name)).toBeInTheDocument();
        });
    });

    it('should display Cartesi twitter link', () => {
        const { container } = render(<Component {...defaultProps} />);
        const twitterLink = container.querySelector(
            `a[href="https://twitter.com/cartesiproject"]`
        );
        const isLinkInDom =
            typeof twitterLink === 'object' && twitterLink !== null;

        expect(isLinkInDom).toBe(true);
    });
});
