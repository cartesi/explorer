// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { Card } from '../../src/components/Card';
import { withChakraTheme } from '../test-utilities';
import { act } from 'react';

const ECard = withChakraTheme(Card);

describe('Card component', () => {
    beforeEach(() => {
        cleanup();
    });

    it('should display title, subtitle and button when defined', () => {
        render(
            <ECard
                title="Create a private node"
                subtitle="Run your own node"
                buttonText="CREATE NODE"
            />
        );

        expect(screen.getByText('Create a private node')).toBeInTheDocument();
        expect(screen.getByText('Run your own node')).toBeInTheDocument();
        expect(screen.getByText('CREATE NODE')).toBeInTheDocument();
    });

    it('Should not display button or subtitle areas when not defined', () => {
        render(<ECard title="Hello" />);

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.queryByTestId('card-subtitle')).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('card-action-button')
        ).not.toBeInTheDocument();
    });

    it('Should provide a tooltip when specified in the card properties', async () => {
        const tooltip =
            'Create your own node and earn rewards when a block is produced';

        render(<ECard title="Create a private node" tooltip={tooltip} />);

        const icon = screen.getByRole('tooltip-icon');

        act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(tooltip);
        expect(screen.getByText(tooltip)).toBeInTheDocument();
    });
});
