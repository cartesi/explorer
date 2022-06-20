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
    fireEvent,
    prettyDOM,
    act,
    render,
    screen,
    waitFor,
    findByText,
} from '@testing-library/react';
import CommissionModel from '../../../../src/components/pools/steps/CommissionModel';
import { useStakingPoolFactory } from '../../../../src/services/poolFactory';
import { useWallet } from '../../../../src/contexts/wallet';
import { buildUseStakingPoolFactoryReturn } from '../mocks';

const poolFactoryPath = '../../../../src/services/poolFactory';
const walletMod = '../../../../src/contexts/wallet';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);

    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock(poolFactoryPath, () => {
    const originalModule = jest.requireActual(poolFactoryPath);
    return {
        __esModule: true,
        ...originalModule,
        useStakingPoolFactory: jest.fn(),
    };
});

const mockUseStakingPoolFactory = useStakingPoolFactory as jest.MockedFunction<
    typeof useStakingPoolFactory
>;
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('CommissionModel step component', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

    beforeEach(() => {
        // default happy setup.
        mockUseStakingPoolFactory.mockReturnValue(
            buildUseStakingPoolFactoryReturn()
        );

        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    describe('When not on focus', () => {
        it('Should only display the number, the title and the subtitle.', () => {
            render(<CommissionModel stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Commission Model')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Choose the commission model and fee for your pool'
                )
            ).toBeInTheDocument();
            expect(
                screen.queryByLabelText('Flat-rate commission (%)')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByLabelText('Gas-based commission (Gas)')
            ).not.toBeInTheDocument();
            expect(screen.queryByText('PREVIOUS')).not.toBeInTheDocument();
            expect(screen.queryByText('CREATE POOL')).not.toBeInTheDocument();
        });
    });

    describe('When in focus', () => {
        it('should display the headers, body and action buttons', () => {
            render(<CommissionModel stepNumber={1} inFocus />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Commission Model')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Choose the commission model and fee for your pool'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText('Flat-rate commission (%)')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This model calculates the commission as a fixed percentage of the block CTSI reward before distributing the remaining amount to the pool users.'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText('Gas-based commission (Gas)')
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'This model calculates the commission considering the current network gas price, Ethereum price and CTSI price. The configured amount of gas above is multiplied by the gas price provided by a ChainLink oracle, then converted from ETH to CTSI using an Uniswap V2 price oracle.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('PREVIOUS')).toBeInTheDocument();
            expect(screen.getByText('CREATE POOL')).toBeInTheDocument();
        });

        it('should initialised with CREATE-POOL button disabled while a model required field are not filled', () => {
            render(<CommissionModel stepNumber={1} inFocus />);
            const btn = screen.getByText('CREATE POOL');
            expect(btn.hasAttribute('disabled')).toBe(true);
        });

        it('should keep CREATE-POOL button disabled when everything is filled but wallet is not connected', async () => {
            const { rerender } = render(
                <CommissionModel stepNumber={1} inFocus />
            );

            act(() => {
                const flatRateInput = screen.getByLabelText(
                    'Flat-rate commission (%)'
                );
                fireEvent.change(flatRateInput, { target: { value: 10 } });
            });

            await waitFor(() =>
                expect(
                    screen.getByText('CREATE POOL').hasAttribute('disabled')
                ).toBe(false)
            );

            mockUseWallet.mockReturnValue({
                active: false,
                account: null,
                activate: jest.fn(),
                deactivate: jest.fn(),
            });

            rerender(<CommissionModel stepNumber={1} inFocus />);

            await waitFor(() =>
                expect(
                    screen.getByText('CREATE POOL').hasAttribute('disabled')
                ).toBe(true)
            );
        });
    });

    describe('Validations', () => {
        describe('Flat Rate Commission', () => {
            it('should display message when flat rate value is lower than 0', async () => {
                render(<CommissionModel inFocus stepNumber={1} />);

                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Flat-rate commission (%)'),
                        { target: { value: -1 } }
                    );
                });

                expect(
                    await screen.findByText('Minimum value allowed is 0')
                ).toBeInTheDocument();
            });

            it('should display message when flat rate value is higher than 100', async () => {
                render(<CommissionModel inFocus stepNumber={1} />);

                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Flat-rate commission (%)'),
                        { target: { value: 101 } }
                    );
                });

                expect(
                    await screen.findByText('Maximum value allowed is 100')
                ).toBeInTheDocument();
            });

            it('should display a message when flat rate value has more than 2 decimal places', async () => {
                render(<CommissionModel inFocus stepNumber={1} />);

                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Flat-rate commission (%)'),
                        { target: { value: 0.001 } }
                    );
                });

                expect(
                    await screen.findByText(
                        'Maximum decimal places allowed is 2'
                    )
                ).toBeInTheDocument();
            });

            it('should display a message when the field is visited and left in blank', async () => {
                render(<CommissionModel inFocus stepNumber={1} />);

                act(() => {
                    fireEvent.blur(
                        screen.getByLabelText('Flat-rate commission (%)')
                    );
                });

                expect(
                    await screen.findByText('This field is required.')
                ).toBeInTheDocument();
            });
        });

        describe('Gas Based Commission', () => {
            it('should display a message when the field is visited and left in blank', async () => {
                const { container } = render(
                    <CommissionModel inFocus stepNumber={1} />
                );

                expect(
                    screen
                        .getByLabelText('Gas-based commission (Gas)')
                        .hasAttribute('disabled')
                ).toBe(true);

                const gasBasedOption = container.querySelector(
                    `input[name='gasBasedOption']`
                );

                act(() => {
                    fireEvent.click(gasBasedOption);
                });

                await waitFor(() =>
                    expect(
                        screen
                            .getByText('Gas-based commission (Gas)')
                            .hasAttribute('disabled')
                    ).toBe(false)
                );

                act(() => {
                    fireEvent.blur(
                        screen.getByLabelText('Gas-based commission (Gas)')
                    );
                });

                expect(
                    await screen.findByText('This field is required.')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Notifications', () => {
        it('should display notification and lock the CREATE-POOL when pool factory is loaded and is paused', () => {
            const returned = buildUseStakingPoolFactoryReturn();
            returned.paused = true;
            mockUseStakingPoolFactory.mockReturnValue(returned);

            render(<CommissionModel stepNumber={1} inFocus />);

            expect(screen.getByText('We notice a problem')).toBeInTheDocument();
            expect(
                screen.getByText('Creation of new pools is currently paused.')
            ).toBeInTheDocument();

            expect(
                screen.getByText('CREATE POOL').hasAttribute('disabled')
            ).toBe(true);
        });

        it('should display notification and lock the CREATE-POOL when pool factory is loaded and not ready', () => {
            const returned = buildUseStakingPoolFactoryReturn();
            returned.ready = false;
            mockUseStakingPoolFactory.mockReturnValue(returned);

            render(<CommissionModel stepNumber={1} inFocus />);

            expect(screen.getByText('We notice a problem')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'The pool factory is not initialised properly.'
                )
            ).toBeInTheDocument();

            expect(
                screen.getByText('CREATE POOL').hasAttribute('disabled')
            ).toBe(true);
        });
    });

    describe('Actions', () => {
        describe('PREVIOUS button', () => {
            it('should call onPrevious callback when clicked', () => {
                const onPrev = jest.fn();
                render(
                    <CommissionModel
                        inFocus
                        stepNumber={1}
                        onPrevious={onPrev}
                    />
                );
                const button = screen.getByText('PREVIOUS');
                fireEvent.click(button);

                expect(onPrev).toHaveBeenCalledTimes(1);
            });
        });

        describe('CREATE POOL button', () => {
            it('should call creation pool method based on selected model type (Flat Rate)', async () => {
                const poolFactory = buildUseStakingPoolFactoryReturn();
                mockUseStakingPoolFactory.mockReturnValue(poolFactory);
                render(<CommissionModel inFocus stepNumber={1} />);
                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Flat-rate commission (%)'),
                        { target: { value: 5.25 } }
                    );
                });

                const button = screen.getByText('CREATE POOL');
                fireEvent.click(button);

                await waitFor(() =>
                    expect(
                        poolFactory.createFlatRateCommission
                    ).toHaveBeenCalledWith(525)
                );
            });

            it('should call creation pool method based on selected model type (Gas Based)', async () => {
                const poolFactory = buildUseStakingPoolFactoryReturn();
                mockUseStakingPoolFactory.mockReturnValue(poolFactory);
                const { container } = render(
                    <CommissionModel inFocus stepNumber={1} />
                );

                const gasBasedOption = container.querySelector(
                    `input[name='gasBasedOption']`
                );

                act(() => {
                    fireEvent.click(gasBasedOption);
                });

                await waitFor(() =>
                    expect(
                        screen
                            .getByText('Gas-based commission (Gas)')
                            .hasAttribute('disabled')
                    ).toBe(false)
                );

                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Gas-based commission (Gas)'),
                        { target: { value: 400000 } }
                    );
                });

                const button = screen.getByText('CREATE POOL');
                fireEvent.click(button);

                await waitFor(() =>
                    expect(
                        poolFactory.createGasTaxCommission
                    ).toHaveBeenCalledWith(400000)
                );
            });

            it('should display spinner when transaction is submitted and avoid any subsequent click', async () => {
                const poolFactory = buildUseStakingPoolFactoryReturn();
                mockUseStakingPoolFactory.mockReturnValue(poolFactory);
                // First render
                const { rerender } = render(
                    <CommissionModel inFocus stepNumber={1} />
                );

                act(() => {
                    fireEvent.change(
                        screen.getByLabelText('Flat-rate commission (%)'),
                        { target: { value: 5.25 } }
                    );
                });

                const button = screen.getByText('CREATE POOL');
                fireEvent.click(button);

                await waitFor(() =>
                    expect(
                        poolFactory.createFlatRateCommission
                    ).toHaveBeenCalledWith(525)
                );

                // Emulating hooks changing pool-factory transaction state.
                poolFactory.transaction.submitting = true;
                poolFactory.transaction.acknowledged = false;
                // Then we render the component again to get fresh values
                rerender(<CommissionModel inFocus stepNumber={1} />);

                expect(
                    await findByText(button, 'Loading...')
                ).toBeInTheDocument();

                // trying to click multiple times
                fireEvent.click(button);
                fireEvent.click(button);

                expect(
                    poolFactory.createFlatRateCommission
                ).toHaveBeenCalledTimes(1);
            });
        });
    });
});
