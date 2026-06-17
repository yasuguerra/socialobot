import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AuthGate from './components/AuthGate.tsx';
import './index.css';

import { GlobalProviders } from './context/GlobalProviders.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalProviders>
      <AuthGate>{(user) => <App authUser={user} />}</AuthGate>
    </GlobalProviders>
  </StrictMode>,
);
