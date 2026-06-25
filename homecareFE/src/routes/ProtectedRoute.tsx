import React, { useEffect } from 'react';
import KeycloakService from '../services/keycloak';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route protection component (ProtectedRoute) located in routes folder.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authenticated = KeycloakService.keycloak.authenticated;

  useEffect(() => {
    if (!authenticated) {
      console.log("User not logged in. Proceeding to redirect via keycloak.login()...");
      KeycloakService.keycloak.login();
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-bold text-slate-800">Authentication Required</h2>
          <p className="text-slate-500 text-sm mt-1 text-center">
            You are being securely redirected to the system login portal...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
