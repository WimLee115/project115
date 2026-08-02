import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './app/globals.css';
import { App } from './app/app';
import { AppStateProvider } from './app/app-state';
import { RouterProvider } from './lib/router';

/**
 * Instapmoment van de app.
 *
 * De volgorde van de providers is niet willekeurig: de router staat buitenom,
 * zodat een scherm dat tijdens het laden van de instellingen al navigeert niet
 * op een lege context stuit.
 */

const container = document.getElementById('root');
if (!container) throw new Error('Het element #root ontbreekt in index.html.');

createRoot(container).render(
  <StrictMode>
    <RouterProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </RouterProvider>
  </StrictMode>,
);
