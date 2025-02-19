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
import HireNode from '../../components/node/steps/HireNode';

export default {
    title: 'Private Node/Hire Node',
    component: HireNode,
    argTypes: {},
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof HireNode>;

const Template: ComponentStory<typeof HireNode> = (args) => {
    return (
        <Stack
            bg="gray.80"
            spacing={8}
            px={{ base: 0, lg: '12vw', xl: '18vw' }}
            py={{ base: 0, sm: 'yvw' }}
            direction="column"
            alignItems="stretch"
        >
            <HireNode stepNumber={3} inFocus />
        </Stack>
    );
};

export const Desktop = Template.bind({});
