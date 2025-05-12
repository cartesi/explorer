import type { Preview } from '@storybook/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { MockedProvider } from '@apollo/client/testing';
import { ChakraProvider } from '@chakra-ui/react';
import Web3Container from '../src/components/Web3Container';
import theme from '../src/styles/theme';
import React, { FC } from 'react';
import ColorMode from './ColorMode';
import { ColorModeProvider } from '../src/components/ui/color-mode';
import withFeatureFlags from './withFeatureFlags';
import { StoryContext } from '@storybook/react';
import { Fonts } from '../src/components/Fonts';
import { SelectedChain } from '../src/components/header';

const withChakra = (Story: FC, context: StoryContext) => {
    return (
        <ChakraProvider value={theme}>
            <Fonts />
            <ColorModeProvider>
                <ColorMode globals={context.globals} />
                <Web3Container>
                    <SelectedChain />
                    <Story />
                </Web3Container>
            </ColorModeProvider>
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
        nextjs: { appDirectory: true },
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
