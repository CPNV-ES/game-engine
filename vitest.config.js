/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from "path";

// Determine if we're in a CI environment
const isCI = process.env.CI === 'true'

export default defineConfig({
    test: {
        // Conditionally exclude the directory for CI environments
        exclude: isCI ? ['**/RenderEngine/**'] : [],
        // Other Vitest options can be configured here
    },
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/Core'),
            '@extensions': path.resolve(__dirname, './src/Extensions'),
            '@test': path.resolve(__dirname, './test'),
        },
    },
})
