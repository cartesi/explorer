// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect } from 'react';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { Fonts } from '@explorer/ui';
import '@fontsource/rubik';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withPerformance } from 'storybook-addon-performance';
import theme from '../src/styles/theme';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    viewport: {
        viewports: MINIMAL_VIEWPORTS,
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

const withColorMode = (Story: Function, { globals: { theme = 'light' } }) => {
    const { colorMode, setColorMode } = useColorMode();

    useEffect(() => {
        if (colorMode !== theme) {
            setColorMode(theme);
        }
    }, [theme, colorMode]);

    return <Story />;
};

const withChakra = (Story: Function) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Fonts />
            <Story />
        </ChakraProvider>
    );
};

export const decorators = [withColorMode, withChakra, withPerformance];
