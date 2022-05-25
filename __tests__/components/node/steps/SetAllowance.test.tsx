import {
    cleanup,
    render,
    screen,
    fireEvent,
    act,
} from '@testing-library/react';
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

        it('should keep the run-your-node button disabled until the allowance amount is set', () => {
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

    describe('Set Allowance input', () => {
        describe('Validations', () => {
            it('should display message when allowance set bellow or equal to zero', async () => {
                render(<SetAllowance stepNumber={1} inFocus />);

                const input = screen.getByLabelText('Enter the allowance');

                act(() => {
                    fireEvent.change(input, { target: { value: 0 } });
                });

                expect(
                    await screen.findByText(
                        'Allowance should be greater than 0'
                    )
                ).toBeInTheDocument();
            });
        });
    });

    describe.skip('Notifications', () => {
        expect(true).toBeFalsy();
    });

    describe('Actions', () => {
        it.skip('should call approve() with correct BigNumber when validations passed and it is clicked', () => {
            expect(true).toBeFalsy();
        });
    });
});
