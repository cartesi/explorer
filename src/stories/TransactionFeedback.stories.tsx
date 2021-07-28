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

import TransactionFeedback from '../components/TransactionFeedback';

export default {
    title: 'TransactionFeedback',
    component: TransactionFeedback,
    argTypes: {},
} as ComponentMeta<typeof TransactionFeedback>;

const Template: ComponentStory<typeof TransactionFeedback> = (args) => (
    <TransactionFeedback {...args} />
);

export const NoHashYet = Template.bind({});
NoHashYet.args = {
    title: 'Creating pool...',
    chainId: 5,
    progress: 0,
};

export const WithHash = Template.bind({});
WithHash.args = {
    title: 'Creating pool...',
    chainId: 5,
    hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
    progress: 0,
};

export const Confirmations = Template.bind({});
Confirmations.args = {
    title: 'Creating pool...',
    chainId: 5,
    hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
    progress: 1 / 3,
};

export const Done = Template.bind({});
Done.args = {
    title: 'Creating pool...',
    chainId: 5,
    hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
    progress: 1,
};

export const Error = Template.bind({});
Error.args = {
    title: 'Creating pool...',
    chainId: 5,
    progress: 0,
    error: 'Invalid fee',
};

export const ErrorRevert = Template.bind({});
ErrorRevert.args = {
    title: 'Creating pool...',
    chainId: 5,
    hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
    progress: 0,
    error: 'Invalid fee',
};
