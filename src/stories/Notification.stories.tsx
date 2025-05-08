// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { ConnectWallet } from '../components/header';
import { Notification } from '../components/Notification';

export default {
    title: 'Notification',
    component: Notification,
    argTypes: {},
} as Meta<typeof Notification>;

type Story = StoryObj<typeof Notification>;

const Template: Story = {
    render: (args) => {
        return (
            <Stack
                bg="gray.80"
                gap={8}
                px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 8, sm: '3vw' }}
                pb={{ base: 8, sm: '5vw' }}
                direction={{ base: 'column' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                justifyContent={['flex-start', 'center']}
            >
                <Notification
                    id="notification"
                    title={args.title}
                    subtitle={args.subtitle}
                    onClose={args.onClose}
                    status={args.status}
                >
                    {args.children}
                </Notification>
            </Stack>
        );
    },
};

export const Info: Story = {
    args: {
        title: 'My info notification',
        status: 'info',
        onClose: () => undefined,
    },
    ...Template,
};

export const InfoWithSubtitle: Story = {
    args: {
        title: 'My info notification',
        subtitle: 'All operations accepted',
        status: 'info',
        onClose: () => undefined,
    },
    ...Template,
};

export const Warning: Story = {
    args: {
        title: 'Warning notification',
        status: 'warning',
        onClose: () => undefined,
    },
    ...Template,
};

export const Error: Story = {
    args: {
        title: 'Error notification',
        status: 'error',
        onClose: () => undefined,
    },
    ...Template,
};

export const Success: Story = {
    args: {
        title: 'Success notification',
        status: 'success',
        onClose: () => undefined,
    },
    ...Template,
};

export const WithClosingButton: Story = {
    args: {
        title: 'Closable notification',
        status: 'success',
        onClose: () => alert('Close button clicked'),
    },
    ...Template,
};

export const WithActionableChildren: Story = {
    args: {
        title: 'Notification with action',
        status: 'warning',
        children: (
            <ConnectWallet
                wallet={{
                    active: false,
                    activate: () => {
                        alert('connecting wallet');
                        return Promise.resolve();
                    },
                    deactivate: () => Promise.resolve(),
                }}
            />
        ),
        onClose: () => undefined,
    },
    ...Template,
};
