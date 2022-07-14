// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    StakingDashboard,
    StakingDashboardProps,
} from '../../../src/components/stake/StakingDashboard';
import { withChakraTheme } from '../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000';

const defaultProps = {
    balance: BigNumber.from(defaultValue),
    allowance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(defaultValue),
    onApprove: () => undefined,
};

const EStakingDashboard =
    withChakraTheme<StakingDashboardProps>(StakingDashboard);

describe('Staking Dashboard', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingDashboard {...defaultProps} />);

    it('Should display wallet balance', () => {
        renderComponent();
        expect(screen.getByRole('wallet-balance')).toBeInTheDocument();
    });
});
