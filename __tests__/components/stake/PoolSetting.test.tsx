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
import { PoolSetting } from '../../../src/components/stake/PoolSetting';
import { withChakraTheme } from '../../test-utilities';

const EPoolSetting = withChakraTheme(PoolSetting);

describe('PoolSetting', () => {
    const renderComponent = () => render(<EPoolSetting />);

    it('Should display header text', () => {
        renderComponent();
        expect(screen.getByText('Pool Setting')).toBeInTheDocument();
    });

    it('Should display balance tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'SAMPLE TEXT';

        const icon = getByRole('balance-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });

    it('Should display commission tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'SAMPLE TEXT';

        const icon = getByRole('commission-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });

    it('Should display pool tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'SAMPLE TEXT';

        const icon = getByRole('pool-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });

    it('Should display staking tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'SAMPLE TEXT';

        const icon = getByRole('staking-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });

    it('Should display quit tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'SAMPLE TEXT';

        const icon = getByRole('quit-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });
});
