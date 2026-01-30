import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': './src',
      '@assets': './src/assets',
      '@renderer': './src/renderer',
      '@renderer/components': './src/renderer/components',
      '@renderer/types': './src/renderer/types',
      '@renderer/utils': './src/renderer/utils',
      '@renderer/lib': './src/renderer/lib',
      '@renderer/hooks': './src/renderer/hooks',
      '@renderer/data': './src/renderer/data',
      '@styles': './src/styles',
      '@utils': './src/utils',
      '@lib': './src/lib',
      '@electron-main': './src/electron-main',
      '@electron-main/lib': './src/electron-main/lib',
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
