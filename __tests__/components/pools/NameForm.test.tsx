// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import NameForm from '../../../src/components/pools/NameForm';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(NameForm);
const props = {
    onSetName: jest.fn(),
};

describe('CTSI component', () => {
    it('should display correct label', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Pool ENS name')).toBeInTheDocument();
    });

    it('should display correct helper text', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(
                'After registering a ENS domain and setting it up, set the name here to register the reverse record.'
            )
        ).toBeInTheDocument();
    });

    it('should invoke onSetName callback', () => {
        const mockedOnSetName = jest.fn();
        const { container } = render(<Component onSetName={mockedOnSetName} />);

        const button = container.querySelector('button');

        fireEvent.click(button);

        expect(mockedOnSetName).toHaveBeenCalled();
    });
});
