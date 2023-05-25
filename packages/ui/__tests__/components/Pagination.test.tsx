// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { PageLink } from '../../src/components/Pagination';
import { withChakraTheme } from '../test-utilities';

const PageLinkComponent = withChakraTheme(PageLink);
const defaultPageLinkProps = {
    currentPage: 0,
    index: 0,
    onPageClick: () => undefined,
};

const PaginationComponent = withChakraTheme(Pagination);
const defaultPaginationProps = {
    currentPage: 0,
    pages: 1,
    onPageClick: () => undefined,
};

const isObject = (val: unknown) =>
    typeof val === 'object' && val !== null && !Array.isArray(val);

describe('Footer component', () => {
    describe('PageLink component', () => {
        it('should display correct index', () => {
            render(<PageLinkComponent {...defaultPageLinkProps} />);

            expect(
                screen.getByText(defaultPageLinkProps.index + 1)
            ).toBeInTheDocument();
        });

        it('should trigger callback when click event is triggered', () => {
            const onPageClick = jest.fn();
            const { container } = render(
                <PageLinkComponent
                    {...defaultPageLinkProps}
                    onPageClick={onPageClick}
                />
            );
            const button = container.querySelector('button');

            if (button) {
                fireEvent.click(button);
            }

            expect(onPageClick).toHaveBeenCalled();
        });

        it('should display previous and next buttons when multiple pages exist', () => {
            const { container } = render(
                <PaginationComponent {...defaultPaginationProps} pages={2} />
            );
            const prevButton = container.querySelector(
                '[title="Previous page"]'
            );
            const nextButton = container.querySelector('[title="Next page"]');

            expect(isObject(prevButton)).toBe(true);
            expect(isObject(nextButton)).toBe(true);
        });

        it('should not display previous and next buttons when one page exists', () => {
            const { container } = render(
                <PaginationComponent {...defaultPaginationProps} pages={1} />
            );
            const prevButton = container.querySelector(
                '[title="Previous page"]'
            );
            const nextButton = container.querySelector('[title="Next page"]');

            expect(isObject(prevButton)).toBe(false);
            expect(isObject(nextButton)).toBe(false);
        });

        it('should show simplified page count', () => {
            const currentPage = 0;
            const pages = 2;
            render(
                <PaginationComponent
                    {...defaultPaginationProps}
                    currentPage={currentPage}
                    pages={pages}
                />
            );

            expect(
                screen.getByText(`Page ${currentPage + 1} of ${pages}`)
            ).toBeInTheDocument();
        });
    });
});
