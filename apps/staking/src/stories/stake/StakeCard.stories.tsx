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
import { CopyIcon } from '@chakra-ui/icons';
import StakeCard from '../../components/stake/StakeCard';

export default {
    title: 'Stake/StakeCard',
    component: StakeCard,
    argTypes: {},
} as ComponentMeta<typeof StakeCard>;

const Template: ComponentStory<typeof StakeCard> = (args) => (
    <StakeCard {...args} />
);

const defaultProps = {
    Icon: <CopyIcon w={5} h={5} />,
    Title: <span>Default title</span>,
    children: <span>44</span>,
};

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = {
    ...defaultProps,
    Icon: undefined,
};
