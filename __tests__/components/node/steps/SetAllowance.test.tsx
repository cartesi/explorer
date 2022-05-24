import { cleanup, render, screen } from '@testing-library/react';
import SetAllowance from '../../../../src/components/node/steps/SetAllowance';

describe('SetAllowance Step', () => {
    afterEach(() => {
        cleanup();
    });

    describe('when in focus', () => {
        it('should display the header content, body content and action buttons', () => {
            render(<SetAllowance inFocus stepNumber={1} />);

            expect(screen.getByText('Set Allowance')).toBeInTheDocument();
            expect(
                screen.getByText('Final steps to run your node.')
            ).toBeInTheDocument();
            expect(screen.getByText('Enter the allowance')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This is going to be the maximum amount of CTSI that Cartesi’s staking contract will be able to receive from your personal account.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('RUN YOUR NODE')).toBeInTheDocument();
        });

        it('should keep the run-your-node button disabled until set the allowance amount', () => {
            render(<SetAllowance inFocus stepNumber={1} />);
            const button = screen.getByText('RUN YOUR NODE');
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });

    describe('when not in focus', () => {
        it('Should display only the header content, body and actions are not visible', () => {
            render(<SetAllowance stepNumber={1} />);

            expect(screen.getByText('Set Allowance')).toBeInTheDocument();
            expect(
                screen.getByText('Final steps to run your node.')
            ).toBeInTheDocument();

            expect(
                screen.queryByText('Enter the allowance')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    'This is going to be the maximum amount of CTSI that Cartesi’s staking contract will be able to receive from your personal account.'
                )
            ).not.toBeInTheDocument();
            expect(screen.queryByText('RUN YOUR NODE')).not.toBeInTheDocument();
        });
    });
});
