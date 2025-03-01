// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import { Logo } from '../../components/header';

export default {
    title: 'Header/Logo',
    component: Logo,
    argTypes: {},
} as Meta<typeof Logo>;

type Story = StoryObj<typeof Logo>;

const Template: Story = {
    render: (args) => (
        <div
            style={{
                width: 200,
                height: 100,
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Logo {...args} />
        </div>
    ),
};

export const Default: Story = {
    ...Template,
};
