export interface DashboardStats {
  totalPatients: number;
  totalCaregivers: number;
  totalFamilies: number;
  activeContracts: number;
  todaySchedules: number;
  completedToday: number;
  monthlyRevenue: number;
  pendingPayments: number;
}

export const mockStats: DashboardStats = {
  totalPatients: 125,
  totalCaregivers: 48,
  totalFamilies: 92,
  activeContracts: 36,
  todaySchedules: 12,
  completedToday: 8,
  monthlyRevenue: 450000000,
  pendingPayments: 5
};

export interface RecentActivity {
  type: string;
  description: string;
  status: string;
  timestamp: string;
}

export const mockActivities: RecentActivity[] = [
  {
    type: "New Patient Registered",
    description: "Nguyen Van A was registered by family member",
    status: "completed",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
  },
  {
    type: "Caregiver Assigned",
    description: "Tran Thi B was assigned to schedule #1209",
    status: "inprogress",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    type: "Contract Expiring",
    description: "Contract with Le Van C expires in 3 days",
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  }
];
