// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import CTSI, {
    numberFormat,
} from '../../../../src/components/pools/staking/CTSI';
import { withChakraTheme } from '../../../test-utilities';
import { formatUnits } from 'ethers/lib/utils';

const Component = withChakraTheme(CTSI);
const props = {
    value: '100000000000000',
};

describe('CTSI component', () => {
    it('should display correct wait period', () => {
        render(<Component {...props} />);

        expect(
            screen.getByText(
                numberFormat.format(parseFloat(formatUnits(props.value, 18)))
            )
        ).toBeInTheDocument();
    });
});
