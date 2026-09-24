import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            'uploads/**',
            'gpt/**',
            'test.js',
            'tests/example.spec.js'
        ],
    },

    js.configs.recommended,

    // Серверный CommonJS-код
    {
        files: ['myserver.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },

    // Playwright
    {
        files: ['playwright.config.js', 'tests/reviews.spec.js'],
        languageOptions: {
            globals: globals.node,
        },
    },

    // Код, выполняющийся в браузере
    {
        files: [
            'views/**/*.js',
            'components/**/*.js',
            'layout/**/*.js',
            'api/**/*.js',
            'gpt/test_gpt_app.js',
        ],
        languageOptions: {
            globals: globals.browser,
        },
    },
]);
