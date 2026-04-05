/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, include: ['src'] })
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Quire',
      fileName: (format) => `index.js`,
      formats: ['es']
    },
    target: 'esnext',
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime']
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
});
