import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';

const strictMode = true;
console.log(`App Mode: ${import.meta.env.MODE}`);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  (window as any).beforeInstallPromptEvent = event;
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  strictMode ? (
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  ) : (
    <Main />
  )
);
