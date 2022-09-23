/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    act,
    cleanup,
    findByText,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';

import { useWallet } from '../../../../src/contexts/wallet';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useStakingPool } from '../../../../src/services/pool';
import { buildUseStakingPoolReturn, buildContractReceipt } from '../mocks';
import { withChakraTheme } from '../../../test-utilities';
import { useStepState } from '../../../../src/components/StepGroup';
import ENS from '../../../../src/components/pools/steps/ENS';
import { StepStatus } from '../../../../src/components/Step';
import { useBreakpointValue } from '@chakra-ui/react';

const walletMod = `../../../../src/contexts/wallet`;
const stakingPoolMod = '../../../../src/services/pool';
const stepGroupMod = '../../../../src/components/StepGroup';

jest.mock(stepGroupMod, () => {
    const originalModule = jest.requireActual(stepGroupMod);
    return {
        __esModule: true,
        ...originalModule,
        useStepState: jest.fn(),
    };
});

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock('jotai', () => {
    const originalModule = jest.requireActual('jotai');
    return {
        __esModule: true,
        ...originalModule,
        useAtom: jest.fn(),
    };
});

jest.mock(stakingPoolMod, () => {
    const originalModule = jest.requireActual(stakingPoolMod);
    return {
        __esModule: true,
        ...originalModule,
        useStakingPool: jest.fn(),
    };
});

jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});
jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;
const mockUseStakingPool = useStakingPool as jest.MockedFunction<
    typeof useStakingPool
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseStepState = useStepState as jest.MockedFunction<
    typeof useStepState
>;
const mockUseBreakpointValue = useBreakpointValue as jest.MockedFunction<
    typeof useBreakpointValue
>;
const { useStepState: realUseStepState } = jest.requireActual(stepGroupMod);

const Component = withChakraTheme(ENS);

describe('Pool ENS step', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const poolAddress = '0xE656584736b1EFC14b4b6c785AA9C23BAc8f41AA';
    const routerPushStub = jest.fn();

    beforeEach(() => {
        mockUseBreakpointValue.mockReturnValue(false);
        // Partial filled Happy returns
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });

        // @ts-ignore
        mockUseAtom.mockImplementation(() => [poolAddress, jest.fn()]);
        mockUseStakingPool.mockReturnValue(buildUseStakingPoolReturn());
        // @ts-ignore
        mockUseRouter.mockImplementation(() => ({ push: routerPushStub }));

        // default is the real implementation
        mockUseStepState.mockImplementation(realUseStepState);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    describe('When not in focus', () => {
        it('Should only display the number, the title and the subtitle', () => {
            render(<Component stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Pool ENS')).toBeInTheDocument();
            expect(
                screen.getByText('Registering a ENS domain and setting it up.')
            ).toBeInTheDocument();

            expect(
                screen.getByText('This step could be skip.')
            ).toBeInTheDocument();

            expect(screen.queryByText('Pool ENS name')).not.toBeInTheDocument();
            expect(screen.queryByText('COMPLETE')).not.toBeInTheDocument();
        });
    });

    describe('when in focus', () => {
        it('Should display header, body content and the action button', () => {
            render(<Component stepNumber={1} inFocus />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Pool ENS')).toBeInTheDocument();
            expect(
                screen.getByText('Registering a ENS domain and setting it up.')
            ).toBeInTheDocument();

            expect(
                screen.getByText('This step could be skip.')
            ).toBeInTheDocument();

            expect(screen.getByText('Pool ENS name')).toBeInTheDocument();

            expect(
                screen.queryByPlaceholderText(/name.eth/i)
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'Pool owners can name the pool addresses to provide additional trust or just make it easier to identify the pool. The system relies on authority information provided by ENS domains:'
                )
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'Open Ethereum-enabled browser and navigate to the'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('ENS Manager')).toBeInTheDocument();
            expect(
                screen.getByText('Search for your desired .ETH name')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Finish registration of ENS domain')
            ).toBeInTheDocument();
            expect(screen.getByText('COMPLETE')).toBeInTheDocument();
        });
    });

    describe('Notifications', () => {
        it('should only display wallet-disconnected message if the ENS input is filled', async () => {
            mockUseWallet.mockReturnValue({
                active: false,
                activate: jest.fn(),
                deactivate: jest.fn(),
            });

            render(<Component inFocus stepNumber={1} />);

            // check if the warning message is rendered when input is clean
            expect(
                screen.queryByText('Your wallet is disconnected')
            ).not.toBeInTheDocument();

            act(() => {
                fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                    target: { value: 'my.poolname.eth' },
                });
            });

            expect(
                await screen.findByText('Your wallet is disconnected')
            ).toBeInTheDocument();
            expect(
                await screen.findByText('Connect To Wallet')
            ).toBeInTheDocument();
        });
    });

    describe('Actions', () => {
        describe('Complete without ENS', () => {
            it('should redirect the use to the pool manage screen when pool-address available', () => {
                const onComplete = jest.fn();
                render(
                    <Component inFocus stepNumber={1} onComplete={onComplete} />
                );

                fireEvent.click(screen.getByText('COMPLETE'));

                expect(onComplete).toHaveBeenCalled();
                expect(routerPushStub).toHaveBeenCalledWith(
                    '/pools/0xE656584736b1EFC14b4b6c785AA9C23BAc8f41AA/manage'
                );
            });

            it('should redirect to the landing page when the pool-address is not available', () => {
                const onComplete = jest.fn();
                mockUseAtom.mockReturnValue(['', jest.fn() as never]);
                render(
                    <Component inFocus stepNumber={1} onComplete={onComplete} />
                );

                fireEvent.click(screen.getByText('COMPLETE'));

                expect(onComplete).toHaveBeenCalled();
                expect(routerPushStub).toHaveBeenCalledWith('/node-runners');
            });
        });

        describe('Complete with ENS', () => {
            it('should call set-name method from the staking-pool contract passing the ENS information', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                render(<Component inFocus stepNumber={1} />);

                fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                    target: { value: 'my.poolname.eth' },
                });

                fireEvent.click(screen.getByText('COMPLETE'));

                expect(pool.setName).toHaveBeenCalledWith('my.poolname.eth');
                expect(routerPushStub).not.toHaveBeenCalled();
            });

            it('should display an informative notification when setting Pool ENS is in course', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <Component inFocus stepNumber={1} />
                );

                act(() => {
                    fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                        target: { value: 'my.poolname.eth' },
                    });
                });

                fireEvent.click(screen.getByText('COMPLETE'));

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = true;
                rerender(<Component inFocus stepNumber={1} />);

                expect(
                    await screen.findByText('Updating pool ENS...')
                ).toBeInTheDocument();

                expect(
                    await screen.findByText('Loading...')
                ).toBeInTheDocument();
            });

            it('should display an error notification when setting Pool ENS failed', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <Component inFocus stepNumber={1} />
                );

                act(() => {
                    fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                        target: { value: 'my.poolname.eth' },
                    });
                });

                fireEvent.click(screen.getByText('COMPLETE'));

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.error =
                    'Tx Metamask: user cancelled transaction';
                rerender(<Component inFocus stepNumber={1} />);

                expect(
                    await screen.findByText('Pool ENS update failed!')
                ).toBeInTheDocument();

                expect(
                    await screen.findByText(
                        'Tx Metamask: user cancelled transaction'
                    )
                ).toBeInTheDocument();
            });

            it('should display an success notification when set-name for Pool ENS is finished', async () => {
                // Lets control the step state, so we can check the success message of transactions
                mockUseStepState.mockImplementation((a: any) => [
                    { status: StepStatus.ACTIVE },
                    () => a,
                ]);

                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <Component inFocus stepNumber={1} />
                );

                act(() => {
                    fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                        target: { value: 'my.poolname.eth' },
                    });
                });

                fireEvent.click(screen.getByText('COMPLETE'));

                // setting to have the contract transaction fulfilled
                pool.transaction.acknowledged = false;
                pool.transaction.receipt = buildContractReceipt();
                pool.transaction.state = 'confirmed';
                rerender(<Component inFocus stepNumber={1} />);

                expect(
                    await screen.findByText('Updating pool ENS...')
                ).toBeInTheDocument();

                expect(
                    await screen.findByText('Pool ENS updated with success!')
                ).toBeInTheDocument();

                // Checking even though the step-state router is controlled the router is still called
                expect(routerPushStub).toHaveBeenCalledWith(
                    '/pools/0xE656584736b1EFC14b4b6c785AA9C23BAc8f41AA/manage'
                );
            });

            it('should display a spinner and block any futher clicks while transaction is in due course', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <Component inFocus stepNumber={1} />
                );

                act(() => {
                    fireEvent.change(screen.getByLabelText('Pool ENS name'), {
                        target: { value: 'my.poolname.eth' },
                    });
                });

                const button = screen.getByText('COMPLETE');
                fireEvent.click(button);

                // setting to have the transaction rolling
                pool.transaction.acknowledged = false;
                pool.transaction.isOngoing = true;
                rerender(<Component inFocus stepNumber={1} />);

                expect(
                    await findByText(button, 'Loading...')
                ).toBeInTheDocument();

                fireEvent.click(button);
                fireEvent.click(button);

                expect(pool.setName).toHaveBeenCalledTimes(1);
            });
        });
    });
});
