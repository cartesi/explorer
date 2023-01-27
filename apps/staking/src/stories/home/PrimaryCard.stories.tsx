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
import { ChartIcon } from '@explorer/ui';

import PrimaryCard from '../../components/home/PrimaryCard';

const defaultProps = {
    children: 'Primary Card',
    icon: ChartIcon,
};

export default {
    title: 'Home/PrimaryCard',
    component: PrimaryCard,
    argTypes: {},
} as ComponentMeta<typeof PrimaryCard>;

const Template: ComponentStory<typeof PrimaryCard> = ({
    children,
    ...restProps
}) => <PrimaryCard {...restProps}>{children}</PrimaryCard>;

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};
