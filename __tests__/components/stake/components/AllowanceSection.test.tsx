// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen, fireEvent } from '@testing-library/react';
import { BigNumber } from 'ethers';
import {
    AllowanceSection,
    IAllowanceSectionProps,
} from '../../../../src/components/stake/components/AllowanceSection';
import { parseCtsiValue } from '../../../../src/components/pools/staking/CTSI';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';

const EAllowanceSection =
    withChakraTheme<IAllowanceSectionProps>(AllowanceSection);

describe('Allowance Section', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EAllowanceSection
                allowance={BigNumber.from(defaultValue)}
                onAllowanceClick={() => {
                    console.log('onAllowanceClick::');
                }}
            />
        );

    it('Should display pool allowance label', () => {
        renderComponent();
        expect(screen.getByText('Pool allowance')).toBeInTheDocument();
    });

    it('Should display correct allowance value', () => {
        renderComponent();

        expect(screen.getByRole('ctsi-text')).toHaveTextContent(
            parseCtsiValue(BigNumber.from(defaultValue))
        );
    });

    it('Should invoke onAllowanceClick callback', () => {
        const mockOnClick = jest.fn();
        const { getByRole } = render(
            <EAllowanceSection
                allowance={BigNumber.from(defaultValue)}
                onAllowanceClick={mockOnClick()}
            />
        );

        const buttonIcon = getByRole('button-icon');

        fireEvent.click(buttonIcon);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
