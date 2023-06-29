// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    act,
    findByText,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { useWallet } from '@explorer/wallet/src/useWallet';
import { useBalance } from '../../../../src/services/eth';
import { useNode } from '../../../../src/services/node';
import HireNode from '../../../../src/components/pools/steps/HireNode';
import { toBigNumber } from '../../../../src/utils/numberParser';
import { buildNodeObj } from '../../node/mocks';
import { useAtom } from 'jotai';
import { useStakingPool } from '../../../../src/services/pool';
import { useStepState } from '../../../../src/components/StepGroup';
import { buildUseStakingPoolReturn, buildContractReceipt } from '../mocks';
import { StepStatus } from '../../../../src/components/Step';
import { useBreakpointValue } from '@chakra-ui/react';

const walletMod = '@explorer/wallet/src/useWallet';
const servicesEthMod = `../../../../src/services/eth`;
const servicesNodeMod = `../../../../src/services/node`;
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

jest.mock(servicesEthMod, () => {
    const originalModule = jest.requireActual(servicesEthMod);
    return {
        __esModule: true,
        ...originalModule,
        useBalance: jest.fn(),
    };
});

jest.mock(servicesNodeMod, () => {
    const originalModule = jest.requireActual(servicesNodeMod);
    return {
        __esModule: true,
        ...originalModule,
        useNode: jest.fn(),
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
jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseNode = useNode as jest.MockedFunction<typeof useNode>;
const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;
const mockUseAtom = useAtom as jest.MockedFunction<typeof useAtom>;
const mockUseStakingPool = useStakingPool as jest.MockedFunction<
    typeof useStakingPool
>;
const mockUseStepState = useStepState as jest.MockedFunction<
    typeof useStepState
>;
const mockUseBreakpointValue = useBreakpointValue as jest.MockedFunction<
    typeof useBreakpointValue
>;
const { useStepState: realUseStepState } = jest.requireActual(stepGroupMod);

describe('HireNode Step', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const poolAddress = '0xE656584736b1EFC14b4b6c785AA9C23BAc8f41AA';

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

        mockUseBalance.mockReturnValue(toBigNumber('1'));
        mockUseNode.mockReturnValue(buildNodeObj());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mockUseAtom.mockImplementation(() => [poolAddress]);
        mockUseStakingPool.mockReturnValue(buildUseStakingPoolReturn());

        // default is the real implementation
        mockUseStepState.mockImplementation(realUseStepState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have access to the pool address created previously shared by atom', () => {
        render(<HireNode inFocus stepNumber={1} />);

        expect(useStakingPool).toHaveBeenCalledWith(poolAddress, account);
    });

    it('Should render the step-number assigned to it', () => {
        render(<HireNode stepNumber={1} />);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    describe('When not in focus', () => {
        it('Should only display the number, the title and the subtitle when not in focus', () => {
            render(<HireNode stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Hire Node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'At this point, stake your funds using Cartesi Explorer.'
                )
            ).toBeInTheDocument();

            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();
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
                screen.getByText('Allowing your pool to accept new stakes')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You need to specify the amount of ETH you want to give to your node. The node holds a separate Ethereum account and key pair, and only spends your ETH to accept being hired during setup (only once) and then to produce blocks. That means you only incur transaction fee expenses when you are rewarded with CTSI.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('NEXT')).toBeInTheDocument();
        });

        it('Should keep the NEXT button disable when the node address and initial funds are empty', () => {
            render(<HireNode inFocus stepNumber={1} />);
            const button = screen.getByText('NEXT');
            expect(button.hasAttribute('disabled')).toBe(true);
        });
    });

    describe('Notifications', () => {
        it('should display an warning notification when wallet is disconnected and action button to quick connect', () => {
            const activate = jest.fn();
            mockUseWallet.mockReturnValue({
                active: false,
                activate,
                deactivate: jest.fn(),
            });
            render(<HireNode stepNumber={1} inFocus />);

            expect(
                screen.getByText('Your wallet is disconnected')
            ).toBeInTheDocument();
            expect(screen.getByText('Connect To Wallet')).toBeInTheDocument();
        });

        describe('Pool Stakes', () => {
            it('should display an informative notification when pausing new stakes in the pool is in course', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                expect(
                    screen
                        .getByText('Allowing your pool to accept new stakes')
                        .hasAttribute('data-checked')
                ).toBe(true);

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = true;
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Pausing new stakes')
                ).toBeInTheDocument();
                expect(
                    await findByText(alert, 'Loading...')
                ).toBeInTheDocument();
                expect(pool.pause).toHaveBeenCalled();
            });

            it('should display an error notification when pausing new stakes failed', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                // setting to fail the transaction
                pool.transaction.acknowledged = false;
                pool.transaction.error = 'tx metamask: not enough funds';
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Pausing new stakes setup failed!')
                ).toBeInTheDocument();
                expect(
                    await findByText(alert, 'tx metamask: not enough funds')
                ).toBeInTheDocument();
                expect(pool.pause).toHaveBeenCalled();
            });

            it('should display an success message when pausing new stakes transaction is completed', async () => {
                const pool = buildUseStakingPoolReturn();
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = false;
                pool.transaction.receipt = buildContractReceipt();
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Pausing new stakes')
                ).toBeInTheDocument();
                expect(
                    await findByText(
                        alert,
                        'The pool will no longer accept new stakes.'
                    )
                ).toBeInTheDocument();
                expect(pool.pause).toHaveBeenCalled();
            });

            it('should display an informative notification when accepting new stakes in the pool is in course', async () => {
                const pool = buildUseStakingPoolReturn();
                pool.paused = true;
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                expect(
                    screen
                        .getByText('Allowing your pool to accept new stakes')
                        .hasAttribute('data-checked')
                ).toBe(false);

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                await waitFor(() => expect(pool.unpause).toHaveBeenCalled());

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = true;
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Accepting new stakes')
                ).toBeInTheDocument();
                expect(
                    await findByText(alert, 'Loading...')
                ).toBeInTheDocument();
            });

            it('should display an error notification when accepting new stakes failed', async () => {
                const pool = buildUseStakingPoolReturn();
                pool.paused = true;
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                // setting to fail the transaction
                pool.transaction.acknowledged = false;
                pool.transaction.error = 'tx metamask: error communicating';
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(
                        alert,
                        'Accepting new stakes setup failed!'
                    )
                ).toBeInTheDocument();
                expect(
                    await findByText(alert, 'tx metamask: error communicating')
                ).toBeInTheDocument();
                expect(pool.unpause).toHaveBeenCalled();
            });

            it('should display an success message when accepting new stakes transaction is completed', async () => {
                const pool = buildUseStakingPoolReturn();
                pool.paused = true;
                mockUseStakingPool.mockReturnValue(pool);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                await act(() => {
                    fireEvent.click(
                        screen.getByText(
                            'Allowing your pool to accept new stakes'
                        )
                    );
                });

                // setting to have the transaction set
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = false;
                pool.transaction.receipt = buildContractReceipt();
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Accepting new stakes')
                ).toBeInTheDocument();
                expect(
                    await findByText(
                        alert,
                        'The pool is now accepting new stakes.'
                    )
                ).toBeInTheDocument();
                expect(pool.unpause).toHaveBeenCalled();
            });
        });

        describe('Hiring node', () => {
            let node: ReturnType<typeof buildNodeObj>;
            let pool: ReturnType<typeof buildUseStakingPoolReturn>;

            beforeEach(() => {
                node = buildNodeObj('available', '0x00');
                pool = buildUseStakingPoolReturn();
                mockUseNode.mockReturnValue(node);
                mockUseStakingPool.mockReturnValue(pool);
                mockUseBalance.mockReturnValue(toBigNumber('6'));
            });

            it('should display informative notification when hiring node is in due course', async () => {
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );
                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText('This node is available');

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                // emulating transaction state change;
                pool.transaction.acknowledged = false;
                pool.transaction.submitting = true;
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Hiring node...')
                ).toBeInTheDocument();
                expect(
                    await findByText(alert, 'Loading...')
                ).toBeInTheDocument();
            });

            it('should display an error notification when hiring a node failed', async () => {
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );
                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText('This node is available');

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                // emulating transaction state change;
                pool.transaction.acknowledged = false;
                pool.transaction.error =
                    'tx metamask: something went terribly wrong';
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Hiring the node failed')
                ).toBeInTheDocument();
                expect(
                    await findByText(
                        alert,
                        'tx metamask: something went terribly wrong'
                    )
                ).toBeInTheDocument();
            });

            it('should display an success message when hiring a node is completed with success', async () => {
                // lets control the useStepState hook so we can see the success message
                mockUseStepState.mockImplementation((a: any) => [
                    { status: StepStatus.ACTIVE },
                    () => {
                        return a;
                    },
                ]);
                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );
                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText('This node is available');

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                // emulating transaction state change;
                pool.transaction.acknowledged = false;
                pool.transaction.receipt = buildContractReceipt();
                rerender(<HireNode inFocus stepNumber={1} />);

                const alert = screen.getByRole('alert');
                expect(
                    await findByText(alert, 'Hiring node...')
                ).toBeInTheDocument();
                expect(
                    await findByText(
                        alert,
                        'Node hired! moving to the next step...'
                    )
                ).toBeInTheDocument();
            });
        });
    });

    describe('Actions', () => {
        describe('NEXT Button', () => {
            it('should keep next button disabled when node is not available', async () => {
                const pool = buildUseStakingPoolReturn();
                const node = buildNodeObj('owned', '0x00');
                mockUseStakingPool.mockReturnValue(pool);
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('5'));

                render(<HireNode inFocus stepNumber={1} />);

                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText(
                    'Looks like that node is already owned.'
                );

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                expect(pool.hire).not.toHaveBeenCalled();
                expect(button.hasAttribute('disabled')).toBe(true);
            });

            it('should keep next button disabled when initial funds fails validation', async () => {
                const pool = buildUseStakingPoolReturn();
                const node = buildNodeObj('available', '0x00');
                mockUseStakingPool.mockReturnValue(pool);
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('5'));

                render(<HireNode inFocus stepNumber={1} />);

                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 4 } });
                });

                await screen.findByText('This node is available');

                await screen.findByText(
                    'Max amount of ETH allowed to deposit is 3'
                );

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                expect(pool.hire).not.toHaveBeenCalled();
                expect(button.hasAttribute('disabled')).toBe(true);
            });

            it('should allow user to click the next button when all field pass the validations', async () => {
                const pool = buildUseStakingPoolReturn();
                const node = buildNodeObj('available', '0x00');
                mockUseStakingPool.mockReturnValue(pool);
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('5'));

                render(<HireNode inFocus stepNumber={1} />);

                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText('This node is available');

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                expect(pool.hire).toHaveBeenCalledWith(account, toBigNumber(2));
                expect(button.hasAttribute('disabled')).toBe(false);
            });

            it('Should display spinner when clicked and block extra clicks while transaction is in course', async () => {
                const pool = buildUseStakingPoolReturn();
                const node = buildNodeObj('available', '0x00');
                mockUseStakingPool.mockReturnValue(pool);
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('5'));

                const { rerender } = render(
                    <HireNode inFocus stepNumber={1} />
                );

                const addressInput = screen.getByLabelText('Node Address');
                const fundsInput = screen.getByLabelText('Initial Funds');

                await act(() => {
                    fireEvent.change(addressInput, {
                        target: { value: account },
                    });
                    fireEvent.change(fundsInput, { target: { value: 2 } });
                });

                await screen.findByText('This node is available');

                const button = screen.getByText('NEXT');
                fireEvent.click(button);

                pool.transaction.acknowledged = false;
                pool.transaction.isOngoing = true;

                rerender(<HireNode inFocus stepNumber={1} />);

                expect(
                    await findByText(button, 'Loading...')
                ).toBeInTheDocument();

                // trying to do multiple clicks.
                fireEvent.click(button);
                fireEvent.click(button);

                expect(pool.hire).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When node is hired', () => {
        it('should call onComplete callback, transition the step to a completed state', async () => {
            const Component = () => (
                <HireNode inFocus stepNumber={1} onComplete={onComplete} />
            );
            const pool = buildUseStakingPoolReturn();
            const node = buildNodeObj('available', '0x00');
            mockUseStakingPool.mockReturnValue(pool);
            mockUseNode.mockReturnValue(node);
            mockUseBalance.mockReturnValue(toBigNumber('5'));
            const nodeAddress = '0xBB0d5E9bba2606D01683605cc09eB5561740f623';
            pool.transaction.acknowledged = false;
            const onComplete = jest.fn();
            const { rerender } = render(<Component />);

            const addressInput = screen.getByLabelText('Node Address');
            const fundsInput = screen.getByLabelText('Initial Funds');

            await act(() => {
                fireEvent.change(addressInput, {
                    target: { value: nodeAddress },
                });
                fireEvent.change(fundsInput, { target: { value: 2 } });
            });

            await screen.findByText('This node is available');

            const button = screen.getByText('NEXT');
            fireEvent.click(button);

            //Emulate transaction submission
            pool.transaction.isOngoing = true;
            rerender(<Component />);
            expect(await findByText(button, 'Loading...')).toBeInTheDocument();

            //Emulate transaction confirmation
            pool.transaction.state = 'confirmed';
            rerender(<Component />);

            expect(onComplete).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();
            expect(screen.queryByText('Initial Funds')).not.toBeInTheDocument();
            expect(screen.queryByText('PREVIOUS')).not.toBeInTheDocument();
            expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
        });
    });
});
