import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
import { isFrame } from 'helpers/funcs';

const strictMode = true;
console.log(`App Mode: ${import.meta.env.MODE}`);

if (isFrame()) {
  setTimeout(() => {
    window.top?.postMessage('downloaded', '*');
    console.log('message posted');
  }, 2000);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  strictMode ? (
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  ) : (
    <Main />
  )
);
