// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    cleanup,
    render,
    screen,
    fireEvent,
    act,
    findByText,
} from '@testing-library/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useWallet } from '@explorer/wallet';
import { useBalance } from '../../../../src/services/eth';
import { useNode } from '../../../../src/services/node';
import HireNode from '../../../../src/components/node/steps/HireNode';
import { toBigNumber } from '../../../../src/utils/numberParser';
import { buildNodeObj } from '../mocks';
import { useAtom } from 'jotai';

const walletMod = `@explorer/wallet`;
const servicesEthMod = `../../../../src/services/eth`;
const servicesNodeMod = `../../../../src/services/node`;

/**
 * Looks repetitive but that is because the way Jest hoist the jest.mock calls to guarantee
 * it will run before the imports.
 */
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

const mockUseBreakpointValue = useBreakpointValue as jest.MockedFunction<
    typeof useBreakpointValue
>;

describe('HireNode Step', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const atomSetterStub = jest.fn();

    beforeEach(() => {
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
        mockUseAtom.mockImplementation(() => ['', atomSetterStub]);
        mockUseBreakpointValue.mockReturnValue(false);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
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

        it('Should keep the NEXT button disable when the node address and initial funds are empty', () => {
            render(<HireNode inFocus stepNumber={1} />);
            const button = screen.getByText('NEXT');
            expect(button.hasAttribute('disabled')).toBe(true);
        });

        it('should keep the NEXT button disabled when step goes out of focus and then goes back to focus', async () => {
            const node = buildNodeObj('available', '0x00');
            mockUseNode.mockReturnValue(node);
            mockUseBalance.mockReturnValue(toBigNumber('6'));
            const { rerender } = render(<HireNode inFocus stepNumber={1} />);
            const addressInput = screen.getByLabelText('Node Address');
            const fundsInput = screen.getByLabelText('Initial Funds');

            expect(screen.getByText('NEXT').hasAttribute('disabled')).toBe(
                true
            );

            // Fill the required fields
            await act(() => {
                fireEvent.change(addressInput, {
                    target: { value: account },
                });
                fireEvent.change(fundsInput, { target: { value: 2 } });
            });

            await screen.findByText('This node is available');
            expect(screen.queryByDisplayValue(account)).toBeInTheDocument();
            expect(screen.queryByDisplayValue(2)).toBeInTheDocument();
            expect(screen.getByText('NEXT').hasAttribute('disabled')).toBe(
                false
            );

            //removing the focus of it i.e. user clicked PREVIOUS
            rerender(<HireNode stepNumber={1} />);

            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();

            // user goes back to the HireNode step
            rerender(<HireNode inFocus stepNumber={1} />);

            expect(screen.queryByDisplayValue(account)).not.toBeInTheDocument();
            expect(screen.queryByDisplayValue(2)).not.toBeInTheDocument();

            expect(screen.getByText('NEXT').hasAttribute('disabled')).toBe(
                true
            );
        });
    });

    describe('Notifications', () => {
        it('should display an informative notification when the transaction is in course', async () => {
            const node = buildNodeObj('available', '0x00');
            node.transaction.acknowledged = false;
            node.transaction.submitting = true;
            mockUseNode.mockReturnValue(node);
            render(<HireNode inFocus stepNumber={1} />);

            const alert = screen.getByRole('alert');
            expect(
                await findByText(alert, 'Hiring the node...')
            ).toBeInTheDocument();
            expect(await findByText(alert, 'Loading...')).toBeInTheDocument();
        });

        it('should display an error notification when the transaction failed', () => {
            const node = buildNodeObj('available', '0x00');
            node.transaction.acknowledged = false;
            node.transaction.error =
                'Tx metamask: user rejected the transaction';
            mockUseNode.mockReturnValue(node);
            render(<HireNode inFocus stepNumber={1} />);

            expect(
                screen.getByText('Hiring the node failed')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Tx metamask: user rejected the transaction')
            ).toBeInTheDocument();
        });
    });

    describe('Actions', () => {
        describe('PREVIOUS button', () => {
            it('should call onPrevious callback when clicked', () => {
                const onPrev = jest.fn();
                render(<HireNode inFocus stepNumber={1} onPrevious={onPrev} />);
                const button = screen.getByText('PREVIOUS');
                fireEvent.click(button);

                expect(onPrev).toHaveBeenCalledTimes(1);
            });
        });

        describe('NEXT button', () => {
            it('should call node.hire() with correct Bignumber when validations passed and it is clicked', async () => {
                const node = buildNodeObj('available', '0x00');
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('6'));
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

                expect(node.hire).toHaveBeenCalledTimes(1);
                expect(node.hire).toHaveBeenCalledWith(toBigNumber('2'));
            });

            it('Should display spinner when clicked and block any futher click to have effect while transaction in course', async () => {
                const node = buildNodeObj('available', '0x00');
                mockUseNode.mockReturnValue(node);
                mockUseBalance.mockReturnValue(toBigNumber('6'));
                // First render
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

                // Emulating hooks changing node / transaction state.
                node.transaction.isOngoing = true;
                node.transaction.acknowledged = false;
                // Then we render the component again to get fresh values
                rerender(<HireNode inFocus stepNumber={1} />);

                expect(
                    await findByText(button, 'Loading...')
                ).toBeInTheDocument();

                // trying to mess with hire() method call.
                fireEvent.click(button);
                fireEvent.click(button);

                expect(node.hire).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When node is hired', () => {
        it('should call onComplete callback, transition the step to a completed state and update hired-node-address atom', async () => {
            const Component = () => (
                <HireNode inFocus stepNumber={1} onComplete={onComplete} />
            );
            const nodeAddress = '0xBB0d5E9bba2606D01683605cc09eB5561740f623';
            const node = buildNodeObj('available', '0x00');
            node.transaction.acknowledged = false;
            mockUseNode.mockReturnValue(node);
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

            //Adding transaction confirmation
            node.transaction.state = 'confirmed';
            rerender(<Component />);

            expect(onComplete).toHaveBeenCalledTimes(1);
            expect(atomSetterStub).toHaveBeenCalledWith(nodeAddress);
            expect(screen.queryByText('Node Address')).not.toBeInTheDocument();
            expect(screen.queryByText('Initial Funds')).not.toBeInTheDocument();
            expect(screen.queryByText('PREVIOUS')).not.toBeInTheDocument();
            expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
        });
    });
});
