import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': './src',
      '@assets': './src/assets',
      '@components': './src/components',
      '@styles': './src/styles',
      '@utils': './src/utils',
      '@types': './src/types',
      '@electron-main': './src/electron-main',
      '@electron-renderer': './src/electron-renderer',
      '@electron-preload': './src/electron-preload',
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
