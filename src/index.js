import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ponto de entrada da aplicação React
// Busca o elemento com id 'root' no HTML e renderiza o componente principal <App />
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Função para medir performance (opcional)
reportWebVitals();