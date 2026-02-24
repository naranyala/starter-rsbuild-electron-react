import { setup } from 'goober';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './components/features/Main/Main';
import { createContainer, DIProvider } from './lib/services';
import { injectGlobalStyles } from './lib/styled';

setup(React.createElement);

injectGlobalStyles();

const container = createContainer();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <DIProvider container={container}>
      <Main />
    </DIProvider>
  </React.StrictMode>
);
