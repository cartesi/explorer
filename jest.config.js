module.exports = {
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
        '!<rootDir>/src/db/schemas.ts',
        '!<rootDir>/src/graphql/models.ts',
        '!<rootDir>/src/stories/**',
        '!<rootDir>/src/styles/**',
        '!<rootDir>/src/app/**',
        '!<rootDir>/src/types/**',
        '!<rootDir>/src/graphql/queries/**',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageReporters: ['lcov', 'text-summary'],
    coverageDirectory: '<rootDir>/coverage',
    moduleNameMapper: {
        // Handle CSS imports (with CSS modules)
        // https://jestjs.io/docs/webpack#mocking-css-modules
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

        // Handle CSS imports (without CSS modules)
        '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

        // Handle image imports
        // https://jestjs.io/docs/webpack#handling-static-assets
        '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,
    },
    testMatch: [
        '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
        '<rootDir>/.github/',
        '<rootDir>/.storybook/',
        '<rootDir>/.vscode/',
        '<rootDir>/public/',
    ],
    testEnvironment: './jsdom.ts',
    // Common setup you would usually add before each test.
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        '^.+\\.(js|jsx|ts|tsx)$': [
            'babel-jest',
            {
                presets: [
                    'next/babel',
                    /**
                     * Mitigate warning about upgrade to a modern JSX transform for faster performance.
                     *
                     * ref(https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup)
                     */
                    ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: ['@babel/plugin-proposal-private-methods'],
            },
        ],
    },
    transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$'],
};
