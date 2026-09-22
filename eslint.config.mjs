import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'prettier',
        ),
    ),
    {
        plugins: {
            import: fixupPluginRules(_import),
            '@typescript-eslint': fixupPluginRules(typescriptEslint),
            prettier: fixupPluginRules(prettier),
            react: fixupPluginRules(react),
            'react-hooks': fixupPluginRules(reactHooks),
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
            'prettier/prettier': 'error',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/no-children-prop': 'warn',
            'react-hooks/rules-of-hooks': 'warn',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            '@next/next/no-html-link-for-pages': 'off',
            'react/jsx-key': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',

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
    globalIgnores(['next-env.d.ts']),
];
