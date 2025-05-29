// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { MdOutlineContentCopy } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import Banner from '../components/Banner';

export default {
    title: 'Banner',
    component: Banner,
    argTypes: {},
} as Meta<typeof Banner>;

type Story = StoryObj<typeof Banner>;

const Template: Story = {
    render: (args) => <Banner {...args} />,
};

const defaultProps = {
    Icon: <Icon as={MdOutlineContentCopy} w={5} h={5} />,
    Title: <span>Default title</span>,
    children: <span>44</span>,
};

export const Default: Story = {
    args: {
        ...defaultProps,
    },
    ...Template,
};

export const WithoutIcon: Story = {
    args: {
        ...defaultProps,
        Icon: undefined,
    },
    ...Template,
};
