// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Stack, VStack } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Card, CardProps, WalletIcon } from '../components';

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
            direction={{ base: 'column' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            justifyContent={['flex-start', 'center']}
        >
            <Card id="card-1" {...args} />;
            {/* <Card id="card-2" {...args} />;
            <Card id="card-3" {...args} />;
            <Card id="card-4" {...args} />;
            <Card id="card-5" {...args} />;
            <Card id="card-6" {...args} />; */}
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

export const WithSimpleTooltipContent = Template.bind({});

WithSimpleTooltipContent.args = {
    title: 'Simple title',
    tooltip: 'Simple tooltip string content.',
    subtitle: 'A simple subtitle',
    buttonText: 'create simple stuff',
    icon: <WalletIcon color="blue.500" w={6} h={6} />,
    iconBg: 'blue.100',
} as CardProps;

export const WithOrderedTooltipContent = Template.bind({});

const orderedText = [
    'Make sure the Noether node is online and works properly 24x7.',
    'Pay the Ethereum fees that are necessary for block production and also maintenance operations.',
];

WithOrderedTooltipContent.args = {
    title: 'Run a private node',
    tooltip: (
        <VStack
            alignItems="flex-start"
            py={{ base: 2, md: 5 }}
            px={{ base: 3, md: 7 }}
        >
            <p>Main responsibilities:</p>
            <Box as="ol" pl={{ base: 4, md: 8 }} type="1">
                {orderedText.map((content, i) => (
                    <li id={`text-${i}}`} key={i}>
                        {content}
                    </li>
                ))}
            </Box>
        </VStack>
    ),
    subtitle: 'Run your own node',
    buttonText: 'CREATE A NODE',
    icon: <WalletIcon color="yellow.500" w={6} h={6} />,
    iconBg: 'yellow.100',
} as CardProps;
