import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import NotificationBell from "../NotificationBell";
import { menuItems, bottomItems } from "@/data/admin/layout";
import { authApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api.service";

// ============================================================================
// SECTION 1: ADMIN SIDEBAR COMPONENT
// ============================================================================
interface AdminSidebarProps {
  sidebarOpen?: boolean;
  profile?: any;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen = true, profile }) => {
  const location = useLocation();
  const user = authApi.getCurrentUser();
  const userRole = user?.role || "User"; // Backend role e.g. "Admin", "OperationAdmin"
  const displayName = profile?.fullName || user?.fullName || user?.email?.split('@')[0] || "User";

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const filteredBottomItems = bottomItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-[80px]'} bg-[#fafbf7] border-r border-teal-50 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50`}>
      <div className={`p-4 border-b border-teal-50 ${!sidebarOpen && 'flex justify-center'}`}>
        <Link to="/admin" className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-9 h-9 bg-[#0d8ca5] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="text-lg font-bold block leading-tight text-slate-800">HomeCare</span>
              <span className="text-xs text-muted-foreground">{displayName}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                `flex items-center ${sidebarOpen ? 'gap-4 px-5' : 'justify-center px-2'} py-3.5 rounded-2xl transition-all font-semibold whitespace-nowrap overflow-hidden`,
                isActive
                  ? "bg-[#0d8ca5] text-white shadow-xl shadow-teal-200/50"
                  : "text-stone-500 hover:bg-teal-50 hover:text-[#0d8ca5]"
              )}
              data-testid={`admin-sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="p-3 space-y-2 border-t border-teal-50">
        {filteredBottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                `flex items-center ${sidebarOpen ? 'gap-4 px-5' : 'justify-center px-2'} py-3.5 rounded-2xl transition-all font-semibold whitespace-nowrap overflow-hidden`,
                isActive
                  ? "bg-[#0d8ca5] text-white shadow-xl shadow-teal-200/50"
                  : "text-stone-500 hover:bg-teal-50 hover:text-[#0d8ca5]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

// ============================================================================
// SECTION 2: ADMIN HEADER COMPONENT
// ============================================================================
interface AdminHeaderProps {
  breadcrumb: string;
  searchPlaceholder?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ breadcrumb, searchPlaceholder = "Search..." }) => {
  const user = authApi.getCurrentUser();

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <nav className="text-sm text-stone-500">
          <span>{user?.role === 'OperationAdmin' ? 'Operation Admin' : 'Admin'}</span>
          <span className="mx-2">›</span>
          <span className="text-stone-900 font-medium">{breadcrumb}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input 
            placeholder={searchPlaceholder} 
            className="pl-10 bg-stone-50 border-stone-200"
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// SECTION 3: ADMIN LAYOUT COMPONENT
// ============================================================================
export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const { data: profile } = useQuery<any>({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/profile');
      return response.data;
    },
    enabled: !!user
  });

  const displayName = profile?.fullName || user?.fullName || user?.email?.split('@')[0] || 'Admin';
  const profileImage = profile?.avatar || user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=5fa5ba&color=fff&size=128`;
  const homePath = "/admin";

  const handleLogout = () => {
    authApi.logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-manrope">
      <AdminSidebar sidebarOpen={sidebarOpen} profile={profile} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        <nav className="sticky top-0 bg-stone-50/90 backdrop-blur-md z-40 px-8 py-2 flex items-center justify-between border-b border-teal-50/50">
          <div className="flex items-center gap-4">
            <button
              className={`p-2.5 text-stone-400 hover:text-[#0d8ca5] hover:bg-teal-50 rounded-xl transition-all ${!sidebarOpen && 'bg-teal-50 text-[#0d8ca5] ring-2 ring-teal-100'}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined text-2xl">menu_open</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <Link to="/admin/profile" className="flex items-center gap-3.5 ml-2 border-l pl-6 border-stone-100 hover:opacity-80 transition-opacity group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-stone-900 leading-tight group-hover:text-[#5fa5ba] transition-colors">{displayName}</p>
              </div>
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-teal-100 group-hover:ring-[#5fa5ba] transition-all"
                  src={profileImage}
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </nav>
        <div className="px-6 py-4 md:px-12 md:py-6 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
