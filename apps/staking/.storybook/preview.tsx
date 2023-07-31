// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import { Fonts, SelectedChain } from '@explorer/ui';
import '@fontsource/rubik';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { StoryContext } from '@storybook/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { withPerformance } from 'storybook-addon-performance';
import Web3Container from '../src/components/Web3Container';
import theme from '../src/styles/theme';
import withColorMode from './withColorMode';
import withFeatureFlags from './withFeatureFlags';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    viewport: {
        viewports: MINIMAL_VIEWPORTS,
    },
    apolloClient: {
        MockedProvider,
    },
};

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
            icon: 'circlehollow',
            items: ['light', 'dark'],
        },
    },
};

const withChakra = (Story: Function, context: StoryContext) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Fonts />
            <Web3Container>
                <SelectedChain />
                <Story />
            </Web3Container>
        </ChakraProvider>
    );
};

export const decorators = [
    withColorMode,
    withChakra,
    withPerformance,
    withFeatureFlags,
];
