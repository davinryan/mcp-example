import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createProxyRoute } from './scripts/proxyConfig';

const apiTarget = 'http://localhost:3000';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': createProxyRoute(apiTarget)
        }
    },
    plugins: [react(), tsconfigPaths()],
    test: {
        root: 'src',
        watch: false,
        include: ['**/?(*.)+(spec|test|unit|micro).[jt]s?(x)'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./scripts/vitestSetup.ts'],
        reporters: ['basic', 'html'],
        outputFile: {
            html: '../reports/test/test.unit.html'
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['html'],
            reportsDirectory: '../reports/coverage'
        }
    }
} as any);
