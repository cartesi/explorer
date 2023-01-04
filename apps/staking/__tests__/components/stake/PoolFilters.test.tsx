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
import { PoolFilters } from '../../../src/components/stake/PoolFilters';
import { withChakraTheme } from '../../test-utilities';

const defaultFilters = [
    {
        title: 'Default filter',
        type: 'checkbox',
        key: 'type',
        options: [
            {
                value: 'checkbox',
                default: true,
            },
        ],
    },
    {
        title: 'Second filter',
        type: 'radio',
        key: '',
        options: [
            {
                value: 'Some value',
                default: true,
            },
        ],
    },
    {
        title: 'Third filter',
        type: 'checkbox',
        key: '',
        options: [
            {
                value: 'Some value',
                default: true,
            },
        ],
    },
];

const defaultProps = {
    filters: defaultFilters,
    selectedPeriod: null,
    selectedTypes: [],
    onSelectedPeriodChange: () => undefined,
    onSelectedTypesChange: () => undefined,
};

const EPoolFilters = withChakraTheme(PoolFilters);

describe('Pool Filters', () => {
    const renderComponent = () => render(<EPoolFilters {...defaultProps} />);

    it('Should display add filter text', () => {
        renderComponent();
        expect(screen.getByText('Add Filter')).toBeInTheDocument();
    });

    it('Should display filter titles', () => {
        renderComponent();

        defaultFilters.forEach((filter) => {
            expect(screen.getByText(filter.title)).toBeInTheDocument();
        });
    });
});
