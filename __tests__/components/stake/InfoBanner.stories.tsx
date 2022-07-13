// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    IInfoBannerProps,
    InfoBanner,
} from '../../../src/components/stake/InfoBanner';
import { withChakraTheme } from '../../test-utilities';

const defaultProps = {
    isOpen: true,
    isClosable: false,
    isExpandable: false,
    isExpanded: false,
    title: 'Info Banner',
    content: 'Content for Info Banner',
    onToggle: () => undefined,
};

const EInfoBanner = withChakraTheme<IInfoBannerProps>(InfoBanner);

describe('Info Banner', () => {
    // a default configured component
    const renderComponent = () => render(<EInfoBanner {...defaultProps} />);

    it('Should display title', () => {
        renderComponent();
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('Should not display banner', () => {
        render(<EInfoBanner {...defaultProps} isOpen={false} />);
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();

        expect(() => screen.getByText(defaultProps.title)).toThrow(
            'Unable to find an element'
        );
    });

    it('Should display content', () => {
        renderComponent();
        expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
    });

    it('Should display icon button', () => {
        render(<EInfoBanner {...defaultProps} isExpandable />);
        expect(screen.getByRole('icon-button')).toBeInTheDocument();
    });

    it('Should display icon button', () => {
        render(<EInfoBanner {...defaultProps} isClosable />);
        expect(screen.getByRole('close-button')).toBeInTheDocument();
    });

    it('Should invoke onToggle callback', () => {
        const mockOnClick = jest.fn();
        render(
            <EInfoBanner
                {...defaultProps}
                isClosable
                onToggle={mockOnClick()}
            />
        );

        fireEvent.click(screen.getByRole('close-button'));

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
