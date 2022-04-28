// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SetAllowance from '../../components/node/steps/SetAllowance';

export default {
    title: 'Private Node/Set Allowance',
    component: SetAllowance,
    argTypes: {},
} as ComponentMeta<typeof SetAllowance>;

const Template: ComponentStory<typeof SetAllowance> = (args) => {
    return (
        <Stack
            bg="gray.80"
            spacing={8}
            px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
            py={{ base: 8, sm: 'yvw' }}
            direction="column"
            alignItems="stretch"
        >
            <SetAllowance stepNumber={4} />
        </Stack>
    );
};

export const Default = Template.bind({});
