import { setup } from 'goober';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './components/features/Main/Main';
import { injectGlobalStyles } from './lib/styled';

// Setup goober with React.createElement
setup(React.createElement);

// Inject global styles
injectGlobalStyles();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
