import Keycloak from 'keycloak-js';

// Initialize Keycloak client config
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

/**
 * Initialize Keycloak with check-sso configuration.
 * 
 * Why choose check-sso instead of login-required?
 * 1. Login not required immediately upon opening: check-sso lets users access public pages
 *    (Landing page, pricing, about us...) without forcing a redirect to Keycloak login.
 * 2. Automatic Single Sign-On (SSO) checking: If the user is logged in to another application
 *    in the same Realm, check-sso automatically logs them into this system.
 * 3. Flexible routing security: Only requires login when the user clicks "Login" or
 *    accesses a Protected Route.
 */
const initKeycloak = async (onAuthenticatedCallback: () => void) => {
  let initialized = false;

  // Set a 2-second timeout to prevent UI hang (white screen) if the Keycloak server is offline
  const timeoutId = setTimeout(() => {
    if (!initialized) {
      console.warn("Keycloak initialization timed out (2s). Falling back to Guest Mode...");
      initialized = true;
      onAuthenticatedCallback();
    }
  }, 2000);

  try {
    const authenticated = await keycloak.init({ 
      onLoad: 'check-sso', //biết người dùng là ai nma không bắt login ngay, cho phép truy cập các trang công khai mà không bị redirect
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    });
    
    if (!initialized) {
      clearTimeout(timeoutId);
      initialized = true;
      console.log("Keycloak initialization successful, authentication state:", authenticated);
      onAuthenticatedCallback();
    }
  } catch (error) {
    if (!initialized) {
      clearTimeout(timeoutId);
      initialized = true;
      console.error("Keycloak initialization failed:", error);
      onAuthenticatedCallback();
    }
  }
};

export default { initKeycloak, keycloak };