import React from 'react';
import KeycloakService from '../services/keycloak';

export const LoginButton: React.FC = () => {
  const handleLogin = () => {
    KeycloakService.keycloak.login();
  };

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold py-2 px-5 rounded-xl text-sm transition-all duration-200 cursor-pointer"
    >
      Login
    </button>
  );
};

export default LoginButton;
