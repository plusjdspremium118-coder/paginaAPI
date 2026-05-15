/**
 * index.js — Punto de entrada principal de la SPA.
 * Monta el árbol de componentes React en el DOM (#root).
 * React.StrictMode activa advertencias adicionales en desarrollo,
 * ayudando a detectar efectos secundarios inesperados (buena práctica).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
// Bootstrap CSS importado desde node_modules (npm) — consistencia de versión garantizada
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
