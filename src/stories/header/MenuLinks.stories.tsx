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

import MenuLinks from '../../components/header/MenuLinks';

export default {
    title: 'Header/MenuLinks',
    component: MenuLinks,
    argTypes: {
        isOpen: { control: 'boolean' },
    },
} as ComponentMeta<typeof MenuLinks>;

const Template: ComponentStory<typeof MenuLinks> = (args) => (
    <MenuLinks {...args} />
);

export const Default = Template.bind({});
Default.args = { isOpen: false };

export const SpecificPool = Template.bind({});
SpecificPool.args = { isOpen: false };
SpecificPool.story = {
    parameters: {
        nextRouter: {
            path: '/pools/[id]',
            asPath: '/pools/0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            query: {
                id: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            },
        },
    },
};

export const Mobile = Template.bind({});
Mobile.args = { isOpen: true };
