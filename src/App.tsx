import { FrameContext } from '#/helpers/frame';
import { useContext, useEffect } from 'react';
// App-specific imports
import Routes from './Routes';

function App() {
  const frame = useContext(FrameContext);

  // Check for showUnpublishedRecords flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('showUnpublishedRecords') === 'true') {
      // Open the unpublished records dialog
      frame.open(`${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList`, 'Unpublished Records');

      // Remove the query param
      params.delete('showUnpublishedRecords');
      window.history.replaceState(
        null,
        '',
        window.location.origin + window.location.pathname + params.toString(),
      );
    }
  }, []);

  return <Routes />;
}

export default App;
