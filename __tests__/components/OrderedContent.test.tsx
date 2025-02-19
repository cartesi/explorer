// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { OrderedContent } from '../../src/components/OrderedContent';

describe('OrderedContent component', () => {
    it('Should render the title and list of subjected enumerated', () => {
        const title = 'Proposed activities';
        const activities = [
            'Research about the technology X',
            'Apply hotfix for feature B',
        ];

        const { container } = render(
            <OrderedContent title={title} orderedItems={activities} />
        );

        expect(container.querySelector('ol').getAttribute('type')).toEqual('1');

        expect(screen.getByText('Proposed activities')).toBeInTheDocument();
        expect(
            screen.getByText('Research about the technology X')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Apply hotfix for feature B')
        ).toBeInTheDocument();
    });
});
