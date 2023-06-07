// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, fireEvent } from '@testing-library/react';
import { NodeRetiredBanner } from '../../../src/components/node/NodeRetiredBanner';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(NodeRetiredBanner);

describe('NodeRetiredBanner component', () => {
    it('should invoke onClose callback when close button is clicked', () => {
        const mockedOnClose = jest.fn();
        const { container } = render(<Component onClose={mockedOnClose} />);

        const button = container.querySelector('button');
        fireEvent.click(button);

        expect(mockedOnClose).toHaveBeenCalled();
    });
});
