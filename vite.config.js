import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/Core'),
            '@extensions': path.resolve(__dirname, './src/Extensions'),
            '@test': path.resolve(__dirname, './test'),
        },
    },
});