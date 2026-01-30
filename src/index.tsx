import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/global/reset.css';
import '@styles/global/index.css';
import Main from '@renderer/components/Main/Main';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
