import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        'storybook-addon-apollo-client',
        '@storybook/addon-links',
        '@storybook/addon-onboarding',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    staticDirs: ['../public'],
};
export default config;
