import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      index: './src/renderer/main.tsx',
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@main': './src/main',
      '@renderer': './src/renderer',
      '@shared': './src/shared',
      '@preload': './src/preload',
    },
  },
  plugins: [pluginReact()],
  html: {
    template: './src/renderer/index.html',
    scriptLoading: 'defer',
    inject: 'body',
    crossorigin: false,
  },
  output: {
    distPath: {
      root: './dist',
    },
    filenameHash: false,
    dataUriLimit: {
      image: 0,
      media: 0,
    },
    copy: [
      {
        from: './node_modules/winbox/dist/winbox.bundle.min.js',
        to: './winbox.bundle.min.js',
      },
    ],
    legalComments: 'none',
  },
  server: {},
});
