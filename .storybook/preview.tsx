import { MockedProvider } from '@apollo/client/testing/react';
import { ChakraProvider } from '@chakra-ui/react';
import type { Preview, StoryFn } from '@storybook/react';
import { StoryContext } from '@storybook/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { FC } from 'react';
import { Fonts } from '../src/components/Fonts';
import { SelectedChain } from '../src/components/header';
import { ColorModeProvider } from '../src/components/ui/color-mode';
import Web3Container from '../src/components/Web3Container';
import theme from '../src/styles/theme';
import ColorMode from './ColorMode';

const withChakra = (Story: FC, context: StoryContext) => {
    console.info(`withChakra`);
    const colorModeValue = context.globals.backgrounds?.value ?? 'dark';
    console.info(`Color Mode: ${colorModeValue}`);

    return (
        <ChakraProvider value={theme}>
            <Fonts />
            <ColorModeProvider>
                <ColorMode value={colorModeValue} />
                <Web3Container>
                    <SelectedChain />
                    <Story />
                </Web3Container>
            </ColorModeProvider>
        </ChakraProvider>
    );
};

const withApolloProvider = (Story: StoryFn, context: StoryContext) => {
    const PARAM_KEY = 'apolloClient';
    const props = context.parameters[PARAM_KEY];

    console.info(`withApolloProvider`);

    return (
        <MockedProvider {...props}>
            {Story(context.args, context)}
        </MockedProvider>
    );
};

const preview: Preview = {
    decorators: [withApolloProvider, withChakra],
    initialGlobals: {
        backgrounds: { value: 'light' },
    },
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
    },
};

export default preview;
