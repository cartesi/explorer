// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import { ChartIcon } from '../../components/Icons';

import PrimaryCard from '../../components/home/PrimaryCard';

const defaultProps = {
    children: 'Primary Card',
    icon: ChartIcon,
};

export default {
    title: 'Home/PrimaryCard',
    component: PrimaryCard,
    argTypes: {},
} as Meta<typeof PrimaryCard>;

type Story = StoryObj<typeof PrimaryCard>;

const Template: Story = {
    render: ({ children, ...restProps }) => (
        <PrimaryCard {...restProps}>{children}</PrimaryCard>
    ),
};

export const Default: Story = {
    args: { ...defaultProps },
    ...Template,
};
