import React from 'react';
import KeycloakService from '../services/keycloak';

export const RegisterButton: React.FC = () => {
  const handleRegister = () => {
    KeycloakService.keycloak.register();
  };

  return (
    <button
      onClick={handleRegister}
      className="inline-flex items-center justify-center bg-[#0d8ca5] hover:bg-[#0d8ca5]/90 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      Register
    </button>
  );
};

export default RegisterButton;
