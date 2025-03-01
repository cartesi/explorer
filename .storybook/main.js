const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        'storybook-addon-apollo-client',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@chromatic-com/storybook',
        '@storybook/experimental-addon-test',
    ],
    framework: {
        name: '@storybook/experimental-nextjs-vite',
        options: {},
    },
    staticDirs: ['../public'],
};
export default config;
