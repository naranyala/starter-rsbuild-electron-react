import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/global/reset.css';
import './assets/styles/global/index.css';
import './assets/styles/components/TabFilter.css';
import './assets/styles/components/App.css';
import Main from './components/features/Main/Main';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
