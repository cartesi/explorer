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
import PoolCommissionsTable from '../../../components/stake/tables/PoolCommissionsTable';
import commissionsData from './commissionsData';

export default {
    title: 'Stake/PoolCommissionsTable',
    component: PoolCommissionsTable,
    argTypes: {},
} as ComponentMeta<typeof PoolCommissionsTable>;

const Template: ComponentStory<typeof PoolCommissionsTable> = (args) => (
    <PoolCommissionsTable {...args} />
);

const defaultProps = {
    loading: false,
    data: commissionsData,
};

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};
