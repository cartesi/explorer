// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import Footer, { socialLinks } from '../../src/components/Footer';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(Footer);
const defaultProps = {
    links: [
        { label: 'Google', href: 'https://google.com' },
        { label: 'Amazon', href: 'https://amazon.com' },
    ],
    support: [
        { label: 'Discord', href: 'https://discord.com' },
        { label: 'FAQ', href: 'https://faq.example' },
    ],
    general: [
        { label: 'About Us', href: 'https://cartesi.io/about/' },
        { label: 'Docs', href: 'https://docs.cartesi.io/' },
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
    it('should display the links of every column', () => {
        const { container } = render(<Component {...defaultProps} />);

        [
            ...defaultProps.links,
            ...defaultProps.support,
            ...defaultProps.general,
        ].forEach((link) => {
            expect(
                container.querySelector(`a[href="${link.href}"]`),
            ).toBeInTheDocument();
        });
    });

    it('should place the Contracts column last', () => {
        render(<Component {...defaultProps} />);

        const headers = [
            'Resources & Security',
            'Support Center',
            'General',
            'Contracts',
        ].map((title) => screen.getByText(title));

        headers.slice(1).forEach((header, index) => {
            expect(
                headers[index].compareDocumentPosition(header) &
                    Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });
    });

    it('should display contracts', () => {
        render(<Component {...defaultProps} />);

        defaultProps.contracts.forEach((contract) => {
            expect(screen.getByText(contract.name)).toBeInTheDocument();
        });
    });

    it('should keep the Contracts title when no contract has an address', () => {
        render(
            <Component
                {...defaultProps}
                contracts={[{ name: 'Contract A' }]}
            />,
        );

        expect(screen.getByText('Contracts')).toBeInTheDocument();
        expect(screen.queryByText('Contract A')).not.toBeInTheDocument();
    });

    it('should display the Cartesi social channels', () => {
        const { container } = render(<Component {...defaultProps} />);

        socialLinks.forEach(({ label, href }) => {
            const link = container.querySelector(`a[href="${href}"]`);
            expect(link).toBeInTheDocument();
            expect(link).toHaveTextContent(label);
        });
    });
});
