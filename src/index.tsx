import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
import type { BeforeInstallPromptEvent } from './globals';

const strictMode = true;
console.log(`App Mode: ${import.meta.env.MODE}`);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.beforeInstallPromptEvent = event as unknown as BeforeInstallPromptEvent;
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  strictMode ? (
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  ) : (
    <Main />
  ),
);
