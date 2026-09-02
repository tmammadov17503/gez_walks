import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GezExperience } from '@/app/gez-experience';
import '@/app/globals.css';

const root = document.getElementById('root');

if (!root) throw new Error('GƏZ root element was not found.');

createRoot(root).render(
  <StrictMode>
    <GezExperience />
  </StrictMode>,
);
