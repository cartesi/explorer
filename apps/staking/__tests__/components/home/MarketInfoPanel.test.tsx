// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import MarketInfoPanel from '../../../src/components/home/MarketInfoPanel';
import { MarketInfoUnit } from '../../../src/components/MarketInfo';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(MarketInfoPanel);
const props = {
    label: 'Some label',
    value: 10,
    unit: 'USD' as MarketInfoUnit,
};

describe('MarketInfoPanel component', () => {
    it('should display label', () => {
        render(<Component {...props} />);
        expect(screen.getByText(props.label)).toBeInTheDocument();
    });

    it('should display unit when value is larger than zero', () => {
        render(<Component {...props} />);
        expect(screen.getByText(props.unit)).toBeInTheDocument();
    });

    it('should not display unit when value is zero', () => {
        render(<Component {...props} value={0} />);
        expect(() => screen.getByText(props.unit)).toThrow(
            'Unable to find an element'
        );
    });
});
