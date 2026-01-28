import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': './src',
      '@/lib': './lib',
    },
  },
  plugins: [pluginReact()],
  html: {
    template: './src/index.html',
  },
  output: {
    distPath: {
      root: './dist',
    },
  },
});
