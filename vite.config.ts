import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    dts({ insertTypesEntry: true }),
    visualizer(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AutoForm',
      formats: ['es', 'cjs'],
      fileName: (format) => `AutoForm.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-hook-form', 'protobufjs'],
    },
    sourcemap: true,
  },
});
