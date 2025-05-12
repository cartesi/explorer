// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { WalletMobileModal } from '../../../../src/components/header/modals/WalletMobileModal';
import { withChakraTheme } from '../../../test-utilities';

const defaultProps = {
    disclosure: {
        onClose: () => undefined,
    },
    isOpen: true,
    onClose: () => undefined,
};

const EWalletMobileModal = withChakraTheme(WalletMobileModal);

describe('Staking Pool Allowance Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EWalletMobileModal {...defaultProps} />);

    it('Should display account label', () => {
        renderComponent();

        expect(screen.getByText('Your Account')).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EWalletMobileModal {...defaultProps} isOpen={false} />);

        expect(() => screen.getByText('Your account')).toThrow(
            'Unable to find an element'
        );
    });
});
