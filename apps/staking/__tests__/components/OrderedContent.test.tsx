import { cleanup, render, screen } from '@testing-library/react';
import { OrderedContent } from '../../src/components/OrderedContent';

describe('OrderedContent component', () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render the title and list of subjected enumerated', () => {
        const title = 'Proposed activities';
        const activities = [
            'Research about the technology X',
            'Apply hotfix for feature B',
        ];

        const { container } = render(
            <OrderedContent title={title} orderedItems={activities} />
        );

        expect(container.querySelector('ol').getAttribute('type')).toEqual('1');

        expect(screen.getByText('Proposed activities')).toBeInTheDocument();
        expect(
            screen.getByText('Research about the technology X')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Apply hotfix for feature B')
        ).toBeInTheDocument();
    });
});
