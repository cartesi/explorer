// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Notification } from '../../src/components/Notification';
import { withChakraTheme } from '../test-utilities';

describe('Notification component', () => {
    beforeEach(() => {
        cleanup();
    });

    it('should display correct title', () => {
        render(<Notification title="That is a notification" />);

        expect(screen.getByText('That is a notification')).toBeInTheDocument();
    });

    it('should display a subtitle when defined', () => {
        render(
            <Notification
                title="Title message"
                subtitle="That is a subtitle message"
            />
        );

        expect(screen.getByText('Title message')).toBeInTheDocument();
        expect(
            screen.getByText('That is a subtitle message')
        ).toBeInTheDocument();
    });

    it('should display a close button when a onClose callback is defined', () => {
        const onClose = jest.fn();
        render(<Notification title="Title message" onClose={onClose} />);

        const closeButton = screen.getByRole('close-button');

        act(() => {
            fireEvent.click(closeButton);
        });

        expect(screen.getByText('Title message')).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
        expect(onClose).toHaveBeenCalled();
    });

    it('should display a children component when defined', () => {
        const DummyComp = () => <div>Connect To Wallet</div>;
        render(
            <Notification title="Wallet is disconnected">
                <DummyComp />
            </Notification>
        );

        expect(screen.getByText('Wallet is disconnected')).toBeInTheDocument();
        expect(screen.getByText('Connect To Wallet')).toBeInTheDocument();
    });

    it('should display default accent colour and different accents based on status', () => {
        const ENotification = withChakraTheme(Notification);
        const { rerender } = render(<ENotification title="Title" />);
        const role = screen.getByRole('alert');

        // default is info
        expect(role).toHaveStyle('--alert-fg: var(--chakra-colors-blue-200);');

        rerender(<ENotification title="Title" status="success" />);

        expect(role).toHaveStyle('--alert-fg: var(--chakra-colors-green-200);');

        rerender(<ENotification title="Title" status="error" />);

        expect(role).toHaveStyle('--alert-fg:  var(--chakra-colors-red-200);');

        rerender(<ENotification title="Title" status="warning" />);

        expect(role).toHaveStyle(
            '--alert-fg:  var(--chakra-colors-orange-200);'
        );
    });
});
