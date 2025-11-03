// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', '*.tsbuildinfo']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'readonly',
                require: 'readonly',
                module: 'readonly',
                global: 'readonly'
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: false
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    },
    {
        files: ['src/client/**/*.ts', 'src/server/**/*.ts'],
        ignores: ['**/*.test.ts'],
        rules: {
            'no-console': 'error'
        }
    },
    {
        files: ['scripts/**/*.js', 'test*.js'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    },
    eslintConfigPrettier
);
