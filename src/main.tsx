import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AuthGate from './components/AuthGate.tsx';
import './index.css';

import { AppProvider } from './context/AppContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AuthGate>{(user) => <App authUser={user} />}</AuthGate>
    </AppProvider>
  </StrictMode>,
);
