// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import humanizeDuration from 'humanize-duration';
import CommissionForm from '../../../../src/components/pools/fee/CommissionForm';
import { withChakraTheme } from '../../../test-utilities';

const Component = withChakraTheme(CommissionForm);
const props = {
    currentValue: 10,
    unit: '%',
    maxRaise: 20,
    maxDigits: 2,
    increaseWaitPeriod: 2,
    onSubmit: jest.fn(),
};

describe('CommissionForm component', () => {
    it('should display correct wait period', () => {
        render(<Component {...props} />);

        const wait = humanizeDuration(props.increaseWaitPeriod * 1000);
        expect(
            screen.getByText(
                `After increasing the current value you can only increase it again after ${wait}`
            )
        ).toBeInTheDocument();
    });

    it('should display helper text', () => {
        const helperText = 'Test ABC';
        render(<Component {...props} helperText={helperText} />);
        expect(screen.getByText(helperText)).toBeInTheDocument();
    });
});
