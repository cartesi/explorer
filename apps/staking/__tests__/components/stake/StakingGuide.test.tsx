// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import {
    StakingGuide,
    steps,
} from '../../../src/components/stake/StakingGuide';
import { withChakraTheme } from '../../test-utilities';

const EStakingGuide = withChakraTheme(StakingGuide);

describe('Staking Guide', () => {
    // a default configured component
    const renderComponent = () => render(<EStakingGuide />);

    it('Should display heading text', () => {
        renderComponent();
        expect(screen.getByText('Staking in a few steps')).toBeInTheDocument();
    });

    it('Should display steps', () => {
        renderComponent();

        steps.forEach((step, index) => {
            expect(
                screen.getByText(`${index + 1}. ${step.title}`)
            ).toBeInTheDocument();
        });
    });
});
