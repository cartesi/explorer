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

import PageHeader from '../components/PageHeader';
import SearchInput from '../components/SearchInput';

export default {
    title: 'PageHeader',
    component: PageHeader,
    argTypes: {},
} as ComponentMeta<typeof PageHeader>;

const Template: ComponentStory<typeof PageHeader> = (args) => (
    <PageHeader title="Blocks" {...args} />
);

export const Simple = Template.bind({});
Simple.args = {};

export const WithSearch = Template.bind({});
WithSearch.args = {
    children: [<SearchInput w={[100, 200, 400, 400]} />],
};
