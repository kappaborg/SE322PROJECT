import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Disable StrictMode completely to avoid double rendering and terminal disposal
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

