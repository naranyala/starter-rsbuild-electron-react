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
      '@assets': './src/renderer/assets',
      '@renderer': './src/renderer',
      '@renderer/components': './src/renderer/components',
      '@renderer/types': './src/renderer/types',
      '@renderer/utils': './src/renderer/utils',
      '@renderer/lib': './src/renderer/lib',
      '@renderer/hooks': './src/renderer/hooks',
      '@renderer/data': './src/renderer/data',
      '@renderer/use-cases': './src/renderer/use-cases',
      '@renderer/styles': './src/renderer/styles',
      '@styles': './src/renderer/assets/styles',
      '@utils': './src/renderer/utils',
      '@lib': './src/renderer/lib',
      '@main': './src/main',
      '@main/config': './src/main/config',
      '@main/ipc': './src/main/ipc',
      '@main/windows': './src/main/windows',
      '@main/utils': './src/main/utils',
      '@preload': './src/preload',
      '@shared': './src/shared',
      '@shared/types': './src/shared/types',
      '@shared/constants': './src/shared/constants',
    },
  },
  plugins: [pluginReact()],
  html: {
    template: './src/renderer/index.html',
  },
  output: {
    distPath: {
      root: './dist',
    },
  },
  server: {
    directory: true,
  },
});
