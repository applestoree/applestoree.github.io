import React from 'react';
import { createRoot } from 'react-dom/client';
import { App as KonstaApp } from 'konsta/react';
import App from '../App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KonstaApp theme="material">
      <App />
    </KonstaApp>
  </React.StrictMode>,
);
