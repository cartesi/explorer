// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import RetiredNode from '../../../src/components/node/RetiredNode';
import { withChakraTheme } from '../../test-utilities';
import { BigNumber } from 'ethers';

const Component = withChakraTheme(RetiredNode);
const props = {
    chainId: 5,
    user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
    balance: BigNumber.from('10000'),
};

describe('RetiredNode component', () => {
    it('should display warning', () => {
        render(<Component {...props} />);
        expect(screen.getByText('This node is retired')).toBeInTheDocument();
    });

    it('should display correct labels', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Node Owner')).toBeInTheDocument();
        expect(screen.getByText('Node Balance')).toBeInTheDocument();
    });
});
