// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { InfoBanner } from '../../components/stake/InfoBanner';

export default {
    title: 'Stake/InfoBanner',
    component: InfoBanner,
    argTypes: {},
} as Meta<typeof InfoBanner>;

type Story = StoryObj<typeof InfoBanner>;

const Template: Story = {
    render: (args) => <InfoBanner {...args} />,
};

export const Default: Story = {
    args: {
        isOpen: true,
        isClosable: true,
        isExpandable: false,
        isExpanded: false,
        content: (
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Assumenda consequuntur debitis delectus, laudantium nostrum
                numquam odit officiis quas. Consequuntur doloribus hic illum
                minima minus odit, velit voluptatibus. Aspernatur, enim, libero.
            </div>
        ),
    },
    ...Template,
};

export const Expanded: Story = {
    args: {
        ...Default.args,
        isClosable: false,
        isExpandable: true,
        isExpanded: true,
    },
    ...Template,
};

export const Collapsed: Story = {
    args: {
        ...Default.args,
        isClosable: false,
        isExpandable: true,
        isExpanded: false,
    },
    ...Template,
};
