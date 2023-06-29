// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { StakingWalletConnect } from '../../../src/components/stake/StakingWalletConnect';
import { withChakraTheme } from '../../test-utilities';

const defaultProps = {
    onConnect: () => undefined,
};

const EStakingWalletConnect = withChakraTheme(StakingWalletConnect);

describe('Staking Wallet Connect', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingWalletConnect {...defaultProps} />);

    it('Should display pool info label', () => {
        renderComponent();
        expect(
            screen.getByText(
                'You will be leaded to the connecting process of selected wallet.'
            )
        ).toBeInTheDocument();
    });

    it('Should display connect button', () => {
        renderComponent();
        expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
    });

    it('Should invoke onConnect callback', () => {
        let isTriggered = false;
        render(
            <EStakingWalletConnect
                {...defaultProps}
                onConnect={() => {
                    isTriggered = true;
                }}
            />
        );

        fireEvent.click(screen.getByText('Connect Your Wallet'));

        expect(isTriggered).toBe(true);
    });
});
