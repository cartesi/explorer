import { fixupConfigRules } from '@eslint/compat';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import { globalIgnores } from 'eslint/config';

export default [
    // build artifact written by `pnpm gen:abi` (wagmi cli), see wagmi.config.ts
    globalIgnores(['src/services/contracts/generated.ts']),
    js.configs.recommended,
    tseslint.configs['flat/eslint-recommended'],
    ...tseslint.configs['flat/recommended'],
    // eslint-plugin-react 7.37.5 still calls context.getFilename(), removed in
    // ESLint 10, and declares no v10 peer support. The compat fixup shims it;
    // it can go once the plugin ships an ESLint 10 release.
    ...fixupConfigRules(react.configs.flat.recommended),
    reactHooks.configs.flat.recommended,
    prettierRecommended,
    ...storybook.configs['flat/recommended'],
    {
        files: ['**/*.ts', '**/*.tsx'],

        plugins: {
            import: importPlugin,
        },

        languageOptions: {
            parser: tsParser,
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            // ethers and the @cartesi contract packages are devDependencies
            // used only by the ABI generator; the app runs on viem and the
            // generated ABIs. wagmi.config.ts is the one file exempted below.
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['ethers', 'ethers/*', '@ethersproject/*'],
                            message:
                                'ethers is a devDependency for ABI generation only; use viem.',
                        },
                        {
                            group: [
                                '@cartesi/pos',
                                '@cartesi/pos-1.0',
                                '@cartesi/staking-pool',
                                '@cartesi/token',
                                '@cartesi/util',
                                '@cartesi/*/export/*',
                            ],
                            message:
                                'Contract packages are devDependencies for ABI generation only; import from src/services/contracts/generated.',
                        },
                    ],
                },
            ],
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-expressions': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/no-children-prop': 'warn',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            'react/jsx-key': 'off',
            'react-hooks/rules-of-hooks': 'warn',
            'no-undef': 'off',

            // TODO(deps-sweep): eslint-plugin-react-hooks v7 enables the React
            // Compiler rules in its recommended preset. They report 55 errors
            // against the current code, which is a separate piece of work from
            // this dependency upgrade. Disabled deliberately, not inherited.
            'react-hooks/config': 'off',
            'react-hooks/error-boundaries': 'off',
            'react-hooks/gating': 'off',
            'react-hooks/globals': 'off',
            'react-hooks/immutability': 'off',
            'react-hooks/incompatible-library': 'off',
            'react-hooks/preserve-manual-memoization': 'off',
            'react-hooks/purity': 'off',
            'react-hooks/refs': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/set-state-in-render': 'off',
            'react-hooks/static-components': 'off',
            'react-hooks/unsupported-syntax': 'off',
            'react-hooks/use-memo': 'off',
        },
    },
    {
        files: ['wagmi.config.ts'],
        rules: {
            'no-restricted-imports': 'off',
        },
    },
    globalIgnores(['next-env.d.ts']),
];
