import api from '../services/api.service';
import KeycloakService from '../services/keycloak';
import { mockStats, mockActivities } from '@/data/admin/dashboard';

export const caregiverApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/caregiver');
      return response.data;
    } catch (error) {
      console.warn("Failed to connect to caregiver-service. Falling back to mock data...", error);
      return [];
    }
  }
};

export const authApi = {
  getCurrentUser: () => {
    const kc = KeycloakService.keycloak;
    if (kc.authenticated) {
      const roles = kc.tokenParsed?.realm_access?.roles || [];
      const isAdmin = roles.some(r => r.toUpperCase() === 'ADMIN');
      const isOpAdmin = roles.some(r => r.toUpperCase() === 'OPERATION_ADMIN' || r.toUpperCase() === 'OPERATOR');
      
      return {
        email: kc.tokenParsed?.email || kc.tokenParsed?.preferred_username || '',
        name: kc.tokenParsed?.name || kc.tokenParsed?.preferred_username || '',
        fullName: kc.tokenParsed?.name || kc.tokenParsed?.preferred_username || '',
        role: isAdmin ? 'Admin' : isOpAdmin ? 'OperationAdmin' : 'User',
        imageUrl: undefined
      };
    }
    return null;
  },
  logout: () => {
    KeycloakService.keycloak.logout({ redirectUri: window.location.origin });
  }
};

export const familyApi = {
  getProfile: async () => {
    const response = await api.get('/api/v1/users/profile');
    return response.data;
  },
  getPatients: async () => {
    try {
      const response = await api.get('/api/v1/users/profile/patients');
      return response.data;
    } catch (error) {
      console.warn("Patients endpoint not implemented. Returning empty list.", error);
      return [];
    }
  }
};

export const adminApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/v1/admin/stats');
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch admin stats from backend. Falling back to 0 values...", error);
      return {
        totalPatients: 0,
        totalCaregivers: 0,
        totalFamilies: 0,
        activeContracts: 0,
        todaySchedules: 0,
        completedToday: 0,
        monthlyRevenue: 0,
        pendingPayments: 0
      };
    }
  },
  getRecentActivities: async (limit: number) => {
    try {
      const response = await api.get(`/api/v1/admin/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch admin activities from backend. Falling back to empty array...", error);
      return [];
    }
  },
  getUsers: async () => {
    const response = await api.get('/api/v1/users');
    return response.data.map((u: any) => ({
      ...u,
      isActive: u.status === 'ACTIVE'
    }));
  },
  createUser: async (newUser: any) => {
    const response = await api.post('/api/v1/users', newUser);
    return response.data;
  },
  toggleUserStatus: async (id: number, isActive: boolean) => {
    const response = await api.put(`/api/v1/users/${id}/status?active=${isActive}`);
    return response.data;
  },
  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
};

export default caregiverApi;

