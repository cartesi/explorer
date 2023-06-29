// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import ProductionIntervalStat, {
    ProductionIntervalStatProps,
} from '../../../../src/components/stake/stats/ProductionIntervalStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultLocation = 'Bulgaria, Sofia';

const EProductionIntervalStat = withChakraTheme<ProductionIntervalStatProps>(
    ProductionIntervalStat
);

describe('Production Interval Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EProductionIntervalStat
                totalBlocks={10}
                productionInterval={10000}
                location={defaultLocation}
            />
        );

    it('Should display production interval label', () => {
        renderComponent();
        expect(screen.getByText('Production Interval')).toBeInTheDocument();
    });

    it('Should display location icon', () => {
        renderComponent();

        expect(screen.getByRole('location-icon')).toBeInTheDocument();
    });

    it('Should not display location icon', () => {
        render(
            <EProductionIntervalStat
                totalBlocks={10}
                productionInterval={10000}
            />
        );

        expect(() => screen.getByRole('location-icon')).toThrow(
            'Unable to find an accessible element with the role "location-icon"'
        );
    });
});
