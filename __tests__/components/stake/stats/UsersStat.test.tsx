// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersStat, {
    UsersStatProps,
} from '../../../../src/components/stake/stats/UsersStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultLocation = 'Bulgaria, Sofia';

const EUsersStat = withChakraTheme<UsersStatProps>(UsersStat);

describe('Users Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EUsersStat totalUsers={100} location={defaultLocation} />);

    it('Should display users label', () => {
        renderComponent();
        expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('Should display location icon', () => {
        renderComponent();

        expect(screen.getByRole('location-icon')).toBeInTheDocument();
    });

    it('Should not display location icon', () => {
        render(<EUsersStat totalUsers={100} />);

        expect(() => screen.getByRole('location-icon')).toThrow(
            'Unable to find an accessible element with the role "location-icon"'
        );
    });

    it('Should display tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'Number of users who staked in this pool';

        const icon = getByRole('users-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });
});
