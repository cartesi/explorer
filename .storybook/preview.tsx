import type { Preview } from '@storybook/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import Web3Container from '../src/components/Web3Container';
import theme from '../src/styles/theme';
import React, { FC } from 'react';
import ColorMode from './ColorMode';
import withFeatureFlags from './withFeatureFlags';
import { StoryContext } from '@storybook/react';
import { Fonts } from '../src/components/Fonts';
import { SelectedChain } from '../src/components/header';

const withChakra = (Story: FC, context: StoryContext) => {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <ColorMode globals={context.globals} />
            <Fonts />
            <Web3Container>
                <SelectedChain />
                <Story />
            </Web3Container>
        </ChakraProvider>
    );
};

const preview: Preview = {
    decorators: [withChakra, withFeatureFlags],
    globalTypes: {
        theme: {
            name: 'Theme',
            description: 'Global theme for components',
            defaultValue: 'dark',
            toolbar: {
                icon: 'circlehollow',
                items: ['light', 'dark'],
            },
        },
    },
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        nextRouter: {
            Provider: RouterContext.Provider,
        },
        apolloClient: {
            MockedProvider,
        },
    },
};

export default preview;
