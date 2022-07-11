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
import CommissionStat, {
    CommissionStatProps,
} from '../../../../src/components/stake/stats/CommissionStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultCommissionPercentage = 50;
const defaultFee = {
    id: '1',
    commission: 25,
    gas: 20,
    created: 1657193076608,
    lastUpdated: 1657193076608,
};
const defaultLocation = 'us';

const ECommissionStat = withChakraTheme<CommissionStatProps>(CommissionStat);

describe('Commission Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <ECommissionStat
                commissionPercentage={defaultCommissionPercentage}
                fee={defaultFee}
                location={defaultLocation}
            />
        );

    it('Should display commission label', () => {
        renderComponent();
        expect(screen.getByText('Commission')).toBeInTheDocument();
    });

    it('Should display big number text', () => {
        render(
            <ECommissionStat
                commissionPercentage={defaultCommissionPercentage}
                fee={defaultFee}
                location={defaultLocation}
            />
        );

        expect(screen.getByRole('big-number-text')).toBeInTheDocument();
    });

    it('Should display commission text', () => {
        render(
            <ECommissionStat
                commissionPercentage={0}
                fee={defaultFee}
                location={defaultLocation}
            />
        );

        expect(screen.getByRole('commission-text')).toBeInTheDocument();
    });

    it('Should display location icon', () => {
        render(
            <ECommissionStat
                commissionPercentage={0}
                fee={defaultFee}
                location={defaultLocation}
            />
        );

        expect(screen.getByRole('location-icon')).toBeInTheDocument();
    });

    it('Should not display location icon', () => {
        render(<ECommissionStat commissionPercentage={0} fee={defaultFee} />);

        expect(() => screen.getByRole('location-icon')).toThrow(
            'Unable to find an accessible element with the role "location-icon"'
        );
    });
});
