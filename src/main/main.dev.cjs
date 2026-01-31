// Wrapper for Electron main process during development
// This allows us to use TypeScript with ts-node

require('ts-node').register();
require('./main.ts');
