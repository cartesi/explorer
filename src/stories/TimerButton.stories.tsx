// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TimerButton from '../components/TimerButton';

export default {
    title: 'Base/TimerButton',
    component: TimerButton,
    argTypes: {},
} as Meta<typeof TimerButton>;

type Story = StoryObj<typeof TimerButton>;

const Template: Story = {
    render: (args) => <TimerButton {...args} />,
};

export const MediumButton: Story = {
    args: {
        children: 'Medium button',
        remainingTime: Date.now() + 60000,
    },
    ...Template,
};

export const LargeButton: Story = {
    args: {
        size: 'lg',
        children: 'Large button',
        remainingTime: Date.now() + 600000,
    },
    ...Template,
};

export const SmallButton: Story = {
    args: {
        size: 'sm',
        children: 'Small button',
        remainingTime: Date.now() + 6000000,
    },
    ...Template,
};
