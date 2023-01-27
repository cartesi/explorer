// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConnectWallet, ConnectWalletProps } from '../../../src/components';
import { withChakraTheme } from '../../test-utilities';
import { UnsupportedNetworkError } from '@explorer/wallet';

const defaultWallet = {
    error: undefined,
    active: false,
    activate: () => Promise.resolve(),
    deactivate: () => Promise.resolve(),
};

const Component = withChakraTheme<ConnectWalletProps>(ConnectWallet);

describe('Connect Wallet', () => {
    // a default configured component
    const renderComponent = (props: ConnectWalletProps) =>
        render(<Component {...props} />);

    it('Should display connect to wallet label', () => {
        renderComponent({
            wallet: {
                ...defaultWallet,
                active: false,
            },
        });

        const label = screen.getByText('Connect To Wallet');
        expect(label).toBeInTheDocument();
    });

    it('Should invoke "active" callback', () => {
        const mockedActivate = jest.fn();
        renderComponent({
            wallet: {
                ...defaultWallet,
                active: false,
                activate: mockedActivate(),
            },
        });

        const button = screen
            .getByText('Connect To Wallet')
            .closest('button') as HTMLButtonElement;
        fireEvent.click(button);

        expect(mockedActivate).toHaveBeenCalledTimes(1);
    });

    it('Should display unsupported network label', () => {
        renderComponent({
            wallet: {
                ...defaultWallet,
                error: new UnsupportedNetworkError(1),
            },
        });

        const label = screen.getByText('Unsupported Network');
        expect(label).toBeInTheDocument();
    });
});
