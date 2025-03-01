// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import Pagination from '../components/Pagination';

export default {
    title: 'Pagination',
    component: Pagination,
    argTypes: {},
} as Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

const Template: Story = {
    render: (args) => <Pagination {...args} />,
};

export const FirstPage: Story = {
    args: { pages: 5, currentPage: 1 },
    ...Template,
};

export const MiddlePage: Story = {
    args: { pages: 5, currentPage: 3 },
    ...Template,
};

export const LastPage: Story = {
    args: { pages: 5, currentPage: 5 },
    ...Template,
};

export const OnePage: Story = {
    args: { pages: 1 },
    ...Template,
};

export const NoPages: Story = {
    args: { pages: 0 },
    ...Template,
};

export const WithNumbers: Story = {
    args: {
        pages: 10,
        currentPage: 0,
        showPageNumbers: true,
    },
    ...Template,
};
