import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
import './index.css';

const strictMode = true;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  strictMode ? (
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  ) : (
    <Main />
  )
);
