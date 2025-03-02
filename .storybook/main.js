// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
    staticDirs: ['../public'],
    features: {
        postcss: false,
        buildStoriesJson: true,
    },
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    typescript: {
        reactDocgen: 'react-docgen-typescript-plugin',
    },
    addons: [
        'storybook-addon-apollo-client',
        'storybook-addon-performance/register',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-next-router',
    ],
    webpackFinal: async (config) => {
        config.module.rules = config.module.rules.map((r) =>
            r.test.toString().includes('jsx')
                ? {
                      ...r,
                      exclude: (filename) => {
                          return (
                              /node_modules/.test(filename) &&
                              !/@chakra-ui/.test(filename) &&
                              !/@zag-js/.test(filename) &&
                              !/ethers/.test(filename) &&
                              !/@walletconnect/.test(filename) &&
                              !/@web3modal/.test(filename) &&
                              !/valtio\/vanilla/.test(filename) &&
                              !/@safe-global/.test(filename) &&
                              !/viem/.test(filename) &&
                              !/@web3-onboard/.test(filename) &&
                              !/abitype/.test(filename) &&
                              !/unstorage/.test(filename) &&
                              !/ox/.test(filename)
                          );
                      },
                  }
                : r
        );

        config.module.rules = [
            ...config.module.rules,
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ];

        config.node = { fs: 'empty' };

        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                    '@ledgerhq/devices/hid-framing': toPath(
                        '../../node_modules/@ledgerhq/devices/lib/hid-framing'
                    ),
                    '@ledgerhq/cryptoassets/data/erc20-signatures': toPath(
                        '../../node_modules/@ledgerhq/cryptoassets/lib/data/erc20-signatures'
                    ),
                    '@ledgerhq/cryptoassets/data/eip712': toPath(
                        '../../node_modules/@ledgerhq/cryptoassets/lib/data/eip712'
                    ),
                    '@toruslabs/torus-embed': toPath(
                        '../../node_modules/@toruslabs/torus-embed/dist/torus.umd.min.js'
                    ),
                },
            },
        };
    },
    babel: async (options) => ({
        ...options,
        plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
    }),
};
