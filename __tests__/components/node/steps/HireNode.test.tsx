import { cleanup, render, screen, prettyDOM } from '@testing-library/react';
import HireNode from '../../../../src/components/node/steps/HireNode';

describe('HireNode Step', () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render the step-number assigned to it', () => {
        render(<HireNode stepNumber={1} />);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    describe('When not in focus', () => {
        it('Should only display the number, the title and the subtitle', () => {
            render(<HireNode stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Hire Node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'At this point, stake your funds using Cartesi Explorer.'
                )
            ).toBeInTheDocument();

            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();
            expect(screen.queryByText('PREVIOUS')).not.toBeInTheDocument();
            expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
        });
    });

    describe('When in focus', () => {
        it('Should display the header content, the body and action buttons', () => {
            render(<HireNode stepNumber={1} inFocus />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Hire Node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'At this point, stake your funds using Cartesi Explorer.'
                )
            ).toBeInTheDocument();

            expect(screen.getByText('Node Address')).toBeInTheDocument();
            expect(
                screen.getByText('You may find from the docker configuration')
            ).toBeInTheDocument();
            expect(screen.getByText('Initial Funds')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You need to specify the amount of ETH you want to give to your node. The node holds a separate Ethereum account and key pair, and only spends your ETH to accept being hired during setup (only once) and then to produce blocks. That means you only incur transaction fee expenses when you are rewarded with CTSI.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('PREVIOUS')).toBeInTheDocument();
            expect(screen.getByText('NEXT')).toBeInTheDocument();
        });

        it.skip('Should keep the NEXT button disable until the node address and initial funds are set', () => {
            render(<HireNode inFocus stepNumber={1} />);

            const button = screen.getByText('NEXT');
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });
});
