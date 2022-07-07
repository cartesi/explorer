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
import ProductionIntervalStat from '../../../components/stake/stats/ProductionIntervalStat';

export default {
    title: 'Stake/Stats/ProductionIntervalStat',
    component: ProductionIntervalStat,
    argTypes: {},
} as ComponentMeta<typeof ProductionIntervalStat>;

const Template: ComponentStory<typeof ProductionIntervalStat> = (args) => (
    <ProductionIntervalStat {...args} />
);

export const Default = Template.bind({});
Default.args = {
    totalBlocks: 100,
    productionInterval: 10000,
    location: 'Stara Zagora, Bulgaria',
};

export const WithoutLocation = Template.bind({});
WithoutLocation.args = {
    ...Default.args,
    location: undefined,
};
