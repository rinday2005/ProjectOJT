import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.service';
import KeycloakService from '../../services/keycloak';
import NotificationBell from '../NotificationBell';
import AIChatBox from '../AIChatBox';

export const FamilyLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['familyProfile'],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/profile');
      return response.data;
    }
  });
  
  const location = useLocation();
  const kc = KeycloakService.keycloak;
  
  // Extract user details dynamically from profile or fallback to Keycloak token
  const userFullName = profile?.fullName || kc.tokenParsed?.name || kc.tokenParsed?.preferred_username || 'User';
  const displayProfileImage = profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      localStorage.setItem('sidebarOpen', String(!prev));
      return !prev;
    });
  };

  const handleLogout = () => {
    kc.logout({ redirectUri: window.location.origin });
  };

  const navItems = [
    { path: '/family', label: 'Dashboard', icon: 'grid_view' },
    { path: '/family/patients', label: 'Patients', icon: 'groups' },
    { path: '/family/schedule', label: 'Care Schedule', icon: 'calendar_today' },
    { path: '/family/services', label: 'Services', icon: 'medical_services' },
    { path: '/family/requests', label: 'Requests', icon: 'list_alt' },
    { path: '/family/contracts', label: 'Contracts', icon: 'description' },
    { path: '/family/payments', label: 'Payments', icon: 'payments' },
    { path: '/family/health-report', label: 'Health Report', icon: 'monitor_heart' },
    { path: '/family/feedback', label: 'Feedback', icon: 'star' }
  ];

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-stone-900 font-manrope text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#f9fbfc] dark:bg-stone-950 border-r border-teal-50/50 dark:border-stone-800 z-50 flex flex-col transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-[280px]' : 'w-[80px]'
        }`}
      >
        <div className={`p-6 flex-grow flex flex-col ${!sidebarOpen && 'items-center'}`}>
          {/* Logo */}
          <Link
            to="/family/welcome"
            className={`flex items-center gap-3 text-[#0d8ca5] mb-12 hover:opacity-80 transition-opacity whitespace-nowrap ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <div className="w-10 h-10 bg-[#0d8ca5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0d8ca5]/10 shrink-0">
              <span className="material-symbols-outlined text-2xl">home_health</span>
            </div>
            <span
              className={`text-2xl font-extrabold tracking-tight transition-opacity duration-200 ${
                !sidebarOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'
              }`}
            >
              HomeCare
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 w-full overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${
                    sidebarOpen ? 'gap-4 px-5' : 'justify-center px-2'
                  } py-3.5 rounded-2xl transition-all duration-300 font-semibold whitespace-nowrap overflow-hidden ${
                    isActive
                      ? 'bg-[#0d8ca5] text-white shadow-md shadow-[#0d8ca5]/20'
                      : 'text-stone-550 dark:text-stone-400 hover:bg-teal-50/50 dark:hover:bg-stone-900 hover:text-[#0d8ca5]'
                  }`
                }
                end={item.path === '/family'}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="material-symbols-outlined text-[22px] shrink-0">
                  {item.icon}
                </span>
                <span
                  className={`text-xs tracking-wide transition-all duration-200 ${
                    !sidebarOpen ? 'opacity-0 w-0 hidden' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Support widget at bottom */}
        <div className="p-6 mt-auto">
          <div
            onClick={() => setIsChatOpen(true)}
            className={`bg-white dark:bg-stone-900 rounded-3xl border border-teal-50/40 dark:border-stone-800 shadow-sm transition-all duration-300 cursor-pointer group hover:border-[#0d8ca5]/30 hover:shadow-md ${
              sidebarOpen ? 'p-5' : 'p-3 flex justify-center'
            }`}
          >
            <div className={`flex items-center ${sidebarOpen ? 'gap-4' : 'justify-center'}`}>
              <div className="w-10 h-10 rounded-2xl bg-teal-50/50 dark:bg-stone-800 flex items-center justify-center text-[#0d8ca5] shrink-0 transition-colors group-hover:bg-[#0d8ca5] group-hover:text-white">
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">support_agent</span>
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[1.5px] leading-tight mb-0.5 whitespace-nowrap">Support</p>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap">Help Center</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        {/* Top Navbar */}
        <nav className="sticky top-0 bg-[#fafbfc]/95 dark:bg-stone-900/95 backdrop-blur-md z-40 px-8 py-3.5 flex items-center justify-between border-b border-teal-50/20 dark:border-stone-850">
          <div className="flex items-center gap-4">
            <button
              className={`p-2 text-stone-450 hover:text-[#0d8ca5] hover:bg-teal-50/50 dark:hover:bg-stone-800 rounded-xl transition-all ${
                !sidebarOpen && 'bg-teal-50/50 text-[#0d8ca5] ring-2 ring-teal-100/50'
              }`}
              onClick={toggleSidebar}
            >
              <span className="material-symbols-outlined text-2xl">menu_open</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />

            <Link
              to="/family/profile"
              className="flex items-center gap-3.5 ml-2 border-l pl-6 border-stone-100 dark:border-stone-800 hover:opacity-80 transition-all group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-850 dark:text-stone-200 leading-tight group-hover:text-[#0d8ca5] transition-colors">
                  {userFullName}
                </p>
                <p className="text-[10px] text-[#0d8ca5] font-black uppercase tracking-wider mt-0.5">Family Manager</p>
              </div>
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-white dark:border-stone-900 shadow-md ring-1 ring-teal-100 dark:ring-stone-800 group-hover:ring-[#0d8ca5] transition-all"
                  src={displayProfileImage}
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-stone-950 rounded-full"></div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 p-2.5 text-stone-450 hover:text-red-500 hover:bg-red-50 dark:hover:bg-stone-800 rounded-xl transition-all"
              title="Logout"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </nav>

        {/* Child Router Views */}
        <div className="w-full flex-grow">
          <Outlet context={[displayProfileImage, () => {}]} />
        </div>
      </div>

      {/* AI Chat Drawer component */}
      <AIChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default FamilyLayout;
