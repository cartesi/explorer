// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { NodeStakedBalanceSection } from '../../../src/components/node/NodeStakedBalanceSection';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(NodeStakedBalanceSection);

const TEST_BALANCE = BigNumber.from('0x04b75e170de2fc0000');
const TEST_BALANCE_CTSI = '87';

describe('NodeStakedBalanceSection component', () => {
    it(`Should be with ${TEST_BALANCE_CTSI} CTSI`, () => {
        render(<Component stakedBalance={TEST_BALANCE} />);

        expect(screen.getByText(TEST_BALANCE_CTSI)).toBeInTheDocument();
    });
});
