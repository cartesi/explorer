// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StakingInstructions } from '../../../../src/components/stake/components/StakingInstructions';
import { withChakraTheme } from '../../../test-utilities';

const EStakingInstructions = withChakraTheme(StakingInstructions);

describe('Staking Instructions', () => {
    // a default configured component
    const renderComponent = () => render(<EStakingInstructions />);

    it('Should display earn rewards label', () => {
        renderComponent();
        expect(
            screen.getByText('Earn rewards by staking CTSI')
        ).toBeInTheDocument();
    });

    it('Should display learn detailed staking instructions label', () => {
        renderComponent();
        expect(
            screen.getByText('Learn detailed staking instructions')
        ).toBeInTheDocument();
    });

    it("Should display don't show again label", () => {
        renderComponent();
        expect(screen.getByText("Don't show again")).toBeInTheDocument();
    });
});
