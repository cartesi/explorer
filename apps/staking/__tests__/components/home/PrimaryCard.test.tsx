// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { ChartIcon } from '@explorer/ui';
import PrimaryCard from '../../../src/components/home/PrimaryCard';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(PrimaryCard);
const props = {
    icon: ChartIcon,
};

describe('PrimaryCard component', () => {
    it('should display correct content', () => {
        const content = 'Test ABC';

        render(<Component {...props}>{content}</Component>);
        expect(screen.getByText(content)).toBeInTheDocument();
    });
});
