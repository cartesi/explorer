/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    cleanup,
    render,
    screen,
    fireEvent,
    act,
    waitFor,
    findByText,
} from '@testing-library/react';
import SetAllowance from '../../../../src/components/node/steps/SetAllowance';
import { useWallet } from '../../../../src/contexts/wallet';
import { useStaking } from '../../../../src/services/staking';
import { useCartesiToken } from '../../../../src/services/token';
import { toBigNumber } from '../../../../src/utils/numberParser';
import { buildUseCartesiTokenReturn, buildUseStakingReturn } from '../mocks';

const walletMod = `../../../../src/contexts/wallet`;
const servicesStakingMod = `../../../../src/services/staking`;
const servicesTokenMod = `../../../../src/services/token`;

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock(servicesStakingMod, () => {
    const originalModule = jest.requireActual(servicesStakingMod);
    return {
        __esModule: true,
        ...originalModule,
        useStaking: jest.fn(),
    };
});

jest.mock(servicesTokenMod, () => {
    const originalModule = jest.requireActual(servicesTokenMod);
    return {
        __esModule: true,
        ...originalModule,
        useCartesiToken: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseStaking = useStaking as jest.MockedFunction<typeof useStaking>;
const mockUseCartesiToken = useCartesiToken as jest.MockedFunction<
    typeof useCartesiToken
>;

describe('SetAllowance Step', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const stakingAddress = '0x329f000E4195823418ff2eCC7cb6f4ca1530Ca4f';

    beforeEach(() => {
        // Partial filled Happy returns
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });

        mockUseStaking.mockReturnValue(buildUseStakingReturn({}));
        mockUseCartesiToken.mockReturnValue(buildUseCartesiTokenReturn());
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
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
        expect(true).toBeTruthy();
    });

    describe('Actions', () => {
        const stakingSetup = {
            staking: { address: stakingAddress },
        };

        it('should call approve() with correct BigNumber when validations passed and it is clicked', async () => {
            const stakingMock = buildUseStakingReturn(stakingSetup);
            const tokenMock = buildUseCartesiTokenReturn();
            mockUseStaking.mockReturnValue(stakingMock);
            mockUseCartesiToken.mockReturnValue(tokenMock);

            render(<SetAllowance stepNumber={1} inFocus />);

            const input = screen.getByLabelText('Enter the allowance');
            const button = screen.getByText('RUN YOUR NODE');

            act(() => {
                fireEvent.change(input, { target: { value: 10000 } });
            });

            await waitFor(() =>
                expect(button.hasAttribute('disabled')).toBe(false)
            );

            fireEvent.click(button);

            expect(tokenMock.approve).toHaveBeenCalledWith(
                stakingAddress,
                toBigNumber(10000)
            );
        });

        it('Should display spinner and be disabled when clicked while the allowance transaction is happening', async () => {
            const stakingMock = buildUseStakingReturn(stakingSetup);
            const tokenMock = buildUseCartesiTokenReturn();
            mockUseStaking.mockReturnValue(stakingMock);
            mockUseCartesiToken.mockReturnValue(tokenMock);
            // First render
            const { rerender } = render(
                <SetAllowance stepNumber={1} inFocus />
            );

            const input = screen.getByLabelText('Enter the allowance');
            const button = screen.getByText('RUN YOUR NODE');

            act(() => {
                fireEvent.change(input, { target: { value: 10000 } });
            });

            await waitFor(() =>
                expect(button.hasAttribute('disabled')).toBe(false)
            );

            fireEvent.click(button);

            // Emulating hooks changing cartesi-token / transaction state.
            tokenMock.transaction.submitting = true;
            tokenMock.transaction.acknowledged = false;
            // Then we render the component again to get fresh values
            rerender(<SetAllowance stepNumber={1} inFocus />);

            expect(await findByText(button, 'Loading...')).toBeInTheDocument();

            // trying to mess with approve() method call.
            fireEvent.click(button);
            fireEvent.click(button);

            expect(tokenMock.approve).toHaveBeenCalledTimes(1);
        });
    });
});
