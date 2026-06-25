import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  HelpCircle,
  User
} from "lucide-react";

export interface SidebarItem {
  path: string;
  label: string;
  icon: any;
  roles?: string[];
}

export const menuItems: SidebarItem[] = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: User },
  { path: "/admin/patients", label: "Patients", icon: Users },
  { path: "/admin/caregivers", label: "Caregivers", icon: UserCheck },
  { path: "/admin/contracts", label: "Contracts", icon: FileText },
  { path: "/admin/schedule", label: "Schedule", icon: Calendar },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 }
];

export const bottomItems: SidebarItem[] = [
  { path: "/admin/settings", label: "Settings", icon: Settings },
  { path: "/admin/help", label: "Help", icon: HelpCircle }
];
