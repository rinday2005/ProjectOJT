import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import KeycloakService from '../services/keycloak';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const kc = KeycloakService.keycloak;
  const authenticated = kc.authenticated;

  const handleLogout = () => {
    console.log("Logging out of Keycloak...");
    kc.logout({ redirectUri: window.location.origin });
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/caregivers", label: "Caregivers" },
    { to: "/services", label: "Services" },
    { to: "/how-it-works", label: "How it Works" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#101f22]/95 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0d8ca5] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">HomeCare</span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.to
                  ? "text-[#0d8ca5] dark:text-[#0d8ca5]"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#0d8ca5] dark:hover:text-[#0d8ca5]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {authenticated && (
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === "/dashboard"
                  ? "text-[#0d8ca5] dark:text-[#0d8ca5]"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#0d8ca5] dark:hover:text-[#0d8ca5]"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Section: Auth */}
        <div className="flex items-center gap-3">
          {authenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-bold text-sm">
                  {kc.tokenParsed?.preferred_username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {kc.tokenParsed?.preferred_username || 'User'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {kc.tokenParsed?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 cursor-pointer"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <LoginButton />
              <RegisterButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
