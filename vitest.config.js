/// <reference types="vitest" />
import { defineConfig } from 'vite'

// Determine if we're in a CI environment
const isCI = process.env.CI === 'true'

export default defineConfig({
    test: {
        // Conditionally exclude the directory for CI environments
        exclude: isCI ? ['**/RenderEngine/**'] : [],
        // Other Vitest options can be configured here
    },
})
