import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Card, CardProps } from '../../src/components/Card';
import { withChakraTheme } from '../test-utilities';

const ECard = withChakraTheme<CardProps>(Card);

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

        expect(screen.getByRole('img')).toBeInTheDocument();
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
        render(
            <ECard
                title="Create a private node"
                tooltip="Create your own node and earn rewards when a block is produced"
            />
        );

        fireEvent.mouseOver(screen.getByRole('tooltip-icon'));

        expect(
            await screen.findByText(
                'Create your own node and earn rewards when a block is produced'
            )
        ).toBeInTheDocument();
    });
});
