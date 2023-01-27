// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Notification, NotificationProps, ConnectWallet } from '../components';

export default {
    title: 'Notification',
    component: Notification,
    argTypes: {},
} as ComponentMeta<typeof Notification>;

const Template: ComponentStory<typeof Notification> = (args) => {
    return (
        <Stack
            bg="gray.80"
            spacing={8}
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
            ;
        </Stack>
    );
};

export const Info = Template.bind({});
Info.args = {
    title: 'My info notification',
    status: 'info',
    onClose: () => undefined,
} as NotificationProps;

export const InfoWithSubtitle = Template.bind({});
InfoWithSubtitle.args = {
    title: 'My info notification',
    subtitle: 'All operations accepted',
    status: 'info',
    onClose: () => undefined,
} as NotificationProps;

export const Warning = Template.bind({});
Warning.args = {
    title: 'Warning notification',
    status: 'warning',
    onClose: () => undefined,
} as NotificationProps;

export const Error = Template.bind({});
Error.args = {
    title: 'Error notification',
    status: 'error',
    onClose: () => undefined,
} as NotificationProps;

export const Success = Template.bind({});
Success.args = {
    title: 'Success notification',
    status: 'success',
    onClose: () => undefined,
} as NotificationProps;

export const WithClosingButton = Template.bind({});
WithClosingButton.args = {
    title: 'Closable notification',
    status: 'success',
    onClose: () => alert('Close button clicked'),
} as NotificationProps;

export const WithActionableChildren = Template.bind({});
WithActionableChildren.args = {
    title: 'Notification with action',
    status: 'warning',
    displayName: 'WithActionableChildren',
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
} as NotificationProps;
