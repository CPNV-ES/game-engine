/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

// Determine if we're in a CI environment
const isCI = process.env.CI === 'true';

export default defineConfig({
    test: {
        // Exclude node_modules and conditionally exclude specific directories
        exclude: [
            '**/node_modules/**', // Exclude all files in node_modules
            ...(isCI ? ['**/RenderEngine/**'] : []), // Conditionally exclude RenderEngine in CI
        ],
    },
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/Core'),
            '@extensions': path.resolve(__dirname, './src/Extensions'),
            '@test': path.resolve(__dirname, './test'),
        },
    },
});