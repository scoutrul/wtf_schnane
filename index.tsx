import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';
import { getStorage } from './services/yandexStorage';

// Инициализация Яндекс SDK и storage с persistence
if (typeof window !== 'undefined') {
  // Предварительная инициализация storage для обеспечения persistence
  getStorage().catch((err) => {
    console.warn('Storage initialization failed:', err);
  });
  
  // Инициализация Яндекс SDK
  if ((window as any).YaGames) {
    (window as any).YaGames.init().then((ysdk: any) => {
      (window as any).ysdk = ysdk;
      console.log('Yandex SDK initialized');
      // Убеждаемся, что storage инициализирован с SDK
      getStorage();
    }).catch((err: any) => {
      console.warn('Yandex SDK init failed:', err);
    });
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
