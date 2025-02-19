// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import Pagination from '../components/Pagination';

export default {
    title: 'Pagination',
    component: Pagination,
    argTypes: {},
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => (
    <Pagination {...args} />
);

export const FirstPage = Template.bind({});
FirstPage.args = { pages: 5, currentPage: 1 };

export const MiddlePage = Template.bind({});
MiddlePage.args = { pages: 5, currentPage: 3 };

export const LastPage = Template.bind({});
LastPage.args = { pages: 5, currentPage: 5 };

export const OnePage = Template.bind({});
OnePage.args = { pages: 1 };

export const NoPages = Template.bind({});
NoPages.args = { pages: 0 };

export const WithNumbers = Template.bind({});
WithNumbers.args = {
    pages: 10,
    currentPage: 0,
    showPageNumbers: true,
};
