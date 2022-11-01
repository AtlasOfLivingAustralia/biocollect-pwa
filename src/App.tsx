import { AuthProvider } from 'react-oidc-context';
import Routes from './Routes';
import config from 'helpers/config';

function App() {
  return (
    <AuthProvider {...config.auth}>
      <Routes />
    </AuthProvider>
  );
}

export default App;
