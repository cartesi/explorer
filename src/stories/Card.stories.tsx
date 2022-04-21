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
import { Card, CardProps } from '../components/Card';
import { WalletIcon } from '../components/Icons';

export default {
    title: 'Card',
    component: Card,
    argTypes: {},
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => {
    return (
        <Stack
            bg="gray.80"
            spacing={8}
            px={{ base: '3vw', lg: '12vw', xl: '18vw' }}
            pt={{ base: 8, sm: '3vw' }}
            pb={{ base: 8, sm: '5vw' }}
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            justifyContent={['flex-start', 'center']}
        >
            <Card id="card-1" {...args} />;
            <Card id="card-2" {...args} />;
        </Stack>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: 'Run a private node',
    subtitle: 'explanation UI copy',
    buttonText: 'CREATE A NODE',
    icon: <WalletIcon color="yellow.500" w={6} h={6} />,
    iconBg: 'yellow.100',
} as CardProps;
