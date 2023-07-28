import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
import { isFrame } from 'helpers/funcs';

const strictMode = true;
console.log(`App Mode: ${import.meta.env.MODE}`);

if (isFrame()) {
  setTimeout(
    () => window.top?.postMessage({ event: 'download-complete' }, '*'),
    2000
  );

  // Define a message handler to listen for download events
  const messageHandler = (
    event: MessageEvent<{
      event: 'credentials';
      data: { userId: string; token: string };
    }>
  ) => {
    console.log('FRAME EVENT', event.data);
  };

  // Subscribe & setup unmount callback
  window.addEventListener('message', messageHandler);
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
