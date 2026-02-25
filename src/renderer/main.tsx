import { setup } from 'goober';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './components/features/Main/Main';
import { ErrorBoundary, setupRendererErrorHandlers } from './lib/error-boundary';
import { injectGlobalStyles } from './lib/styled';

setupRendererErrorHandlers();

setup(React.createElement);

injectGlobalStyles();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  </React.StrictMode>
);
