// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MenuToggle from '../../components/header/MenuToggle';

export default {
    title: 'Header/MenuToggle',
    component: MenuToggle,
    argTypes: {
        toggle: { action: 'toggle' },
    },
} as ComponentMeta<typeof MenuToggle>;

const Template: ComponentStory<typeof MenuToggle> = (args) => (
    <MenuToggle {...args} />
);

export const Closed = Template.bind({});
Closed.args = { isOpen: false };

export const Open = Template.bind({});
Open.args = { isOpen: true };
