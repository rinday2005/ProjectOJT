import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import KeycloakService from './services/keycloak'

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render React App after Keycloak initialization is complete
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Initialize Keycloak first
KeycloakService.initKeycloak(renderApp);