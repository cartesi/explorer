// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Logo } from '../../components/header/Logo';

export default {
    title: 'Header/Logo',
    component: Logo,
    argTypes: {},
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => (
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
);

export const Default = Template.bind({});
Default.args = {};
