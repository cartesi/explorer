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
import { Button } from '../../components/base/Button';

export default {
    title: 'Base/Button',
    component: Button,
    argTypes: {},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const MediumButton = Template.bind({});
MediumButton.args = {
    children: 'Medium button',
};

export const LargeButton = Template.bind({});
LargeButton.args = {
    size: 'lg',
    children: 'Large button',
};

export const SmallButton = Template.bind({});
SmallButton.args = {
    size: 'sm',
    children: 'Small button',
};
