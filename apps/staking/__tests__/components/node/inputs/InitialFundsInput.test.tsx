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
    cleanup,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import { useWallet } from '@explorer/wallet';
import { useBalance } from '../../../../src/services/eth';
import { InitialFundsInput } from '../../../../src/components/node/inputs/InitialFundsInput';
import { toBigNumber } from '../../../../src/utils/numberParser';

const walletMod = `@explorer/wallet`;
const servicesEthMod = `../../../../src/services/eth`;

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

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const defaultUseWalletData = {
    account,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
};

describe('InitialFundsInput component', () => {
    const onValidationStub = jest.fn();
    const onChangeStub = jest.fn();

    const Component = ({ max, min }: { max?: number; min?: number }) => (
        <InitialFundsInput
            max={max || 3}
            min={min || 0}
            onChange={onChangeStub}
            onValidationChange={onValidationStub}
        />
    );

    beforeEach(() => {
        mockUseWallet.mockReturnValue(defaultUseWalletData);

        mockUseBalance.mockReturnValue(toBigNumber('1'));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display expected label and balance information', () => {
        render(<Component max={3} min={0} />);

        expect(screen.getByLabelText('Initial Funds')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Your balance: 1 ETH')).toBeInTheDocument();
    });

    it('should reset ETH balance when wallet is disconnected', () => {
        mockUseWallet.mockReturnValue({
            ...defaultUseWalletData,
            active: false,
        });
        render(<Component max={3} min={0} />);

        expect(screen.getByText('Your balance: 0.00 ETH')).toBeInTheDocument();
    });

    describe('validations', () => {
        it('Should display message when funds set is smaller than established minimum (i.e. 0.001)', async () => {
            render(<Component min={0.001} />);
            const input = screen.getByLabelText('Initial Funds');
            act(() => {
                fireEvent.change(input, { target: { value: 0 } });
            });

            expect(
                await screen.findByText(
                    'Min amount of ETH allowed to deposit is 0.001'
                )
            ).toBeInTheDocument();
        });

        it('should display insufficient-eth-balance when wallet is disconnected and input change', async () => {
            mockUseWallet.mockReturnValue({
                ...defaultUseWalletData,
                active: false,
            });
            mockUseBalance.mockReturnValue(undefined);

            render(<Component min={0.001} />);
            const input = screen.getByLabelText('Initial Funds');
            act(() => {
                fireEvent.change(input, { target: { value: 0.5 } });
            });

            expect(
                await screen.findByText('Insufficient ETH balance')
            ).toBeInTheDocument();
        });

        it(`Should display message when deposit set is bigger than user's ETH balance`, async () => {
            render(<Component />);
            const input = screen.getByLabelText('Initial Funds');
            act(() => {
                fireEvent.change(input, { target: { value: 2 } });
            });

            expect(
                await screen.findByText('Insufficient ETH balance')
            ).toBeInTheDocument();
        });

        it(`Should display message when deposit set is bigger then maximum allowed (i.e. 3)`, async () => {
            mockUseBalance.mockReturnValue(toBigNumber('10'));
            render(<Component />);
            const input = screen.getByLabelText('Initial Funds');
            act(() => {
                fireEvent.change(input, { target: { value: 5 } });
            });

            expect(
                await screen.findByText(
                    'Max amount of ETH allowed to deposit is 3'
                )
            ).toBeInTheDocument();
        });

        it('should display field required message on blur event and the field is empty', async () => {
            render(<Component />);
            const input = screen.getByLabelText('Initial Funds');
            act(() => {
                fireEvent.blur(input);
            });

            expect(
                await screen.findByText('This field is required.')
            ).toBeInTheDocument();
        });
    });
});
