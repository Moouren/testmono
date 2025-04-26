/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { copyFileSync, mkdirSync } from 'fs';

// Create a simple plugin to copy CSS files
const copyStylesPlugin = () => {
  return {
    name: 'copy-styles',
    closeBundle() {
      // Create the directory if it doesn't exist
      mkdirSync('./dist/styles', { recursive: true });
      // Copy the CSS file
      copyFileSync('./src/utils/global.css', './dist/styles/global.css');
      console.log('✓ CSS file copied to dist/styles/global.css');
    }
  };
};

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/shell',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
    copyStylesPlugin(), // Add our custom plugin
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: '@nx/shell',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
}));