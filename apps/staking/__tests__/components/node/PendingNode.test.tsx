// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import PendingNode from '../../../src/components/node/PendingNode';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(PendingNode);

const props = {
    account: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
    chainId: 5,
    user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
    balance: BigNumber.from('10000'),
    onCancelHire: jest.fn(),
};

describe('PendingNode component', () => {
    it('should display Cancel Hire button when account and user are the same', () => {
        window.prompt = () => undefined;
        render(<Component {...props} user={props.account} />);

        expect(screen.getByText('Cancel Hire')).toBeInTheDocument();
    });

    it('should invoke onCancelHire callback when icon button is clicked', () => {
        const mockedOnCancelHire = jest.fn();
        render(
            <Component
                {...props}
                user={props.account}
                onCancelHire={mockedOnCancelHire}
            />
        );

        fireEvent.click(screen.getByTestId('cancel-hire-button'));
        expect(mockedOnCancelHire).toHaveBeenCalled();
    });
});
