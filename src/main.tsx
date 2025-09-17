import { createRoot } from 'react-dom/client';
import App from './App';
import '@assets/fonts/pretendard/pretendard.css';
import '@styles/reset.css';
import '@styles/global.css';
import AppErrorBoundary from '@app/providers/AppErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
