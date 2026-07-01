import api from '../services/api.service';
import KeycloakService from '../services/keycloak';
import { mockStats, mockActivities } from '@/data/admin/dashboard';

export const caregiverApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/caregiver', { skipToast: true } as any);
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
      const response = await api.get('/api/v1/patients');
      return response.data;
    } catch (error) {
      console.warn("Patients endpoint not implemented. Returning empty list.", error);
      return [];
    }
  },
  createPatient: async (data: any) => {
    const response = await api.post('/api/v1/patients', data);
    return response.data;
  },
  updatePatient: async (id: number, data: any) => {
    const response = await api.put(`/api/v1/patients/${id}`, data);
    return response.data;
  },
  deletePatient: async (id: number) => {
    const response = await api.delete(`/api/v1/patients/${id}`);
    return response.data;
  }
};

export const adminApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/v1/admin/stats', { skipToast: true } as any);
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
      const response = await api.get(`/api/v1/admin/activities?limit=${limit}`, { skipToast: true } as any);
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
  },
  getPatients: async (params?: any) => {
    try {
      const response = await api.get('/api/v1/patients', { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch patients", error);
      return [];
    }
  },
  createPatient: async (data: any) => {
    const response = await api.post('/api/v1/patients', data);
    return response.data;
  },
  updatePatient: async (id: number, data: any) => {
    const response = await api.put(`/api/v1/patients/${id}`, data);
    return response.data;
  },
  deletePatient: async (id: number) => {
    const response = await api.delete(`/api/v1/patients/${id}`);
    return response.data;
  },
  getCaregivers: async () => {
    const response = await api.get('/api/v1/caregiver');
    return response.data;
  },
  createCaregiver: async (data: any) => {
    const response = await api.post('/api/v1/caregiver', data);
    return response.data;
  },
  updateCaregiver: async (id: number, data: any) => {
    const response = await api.put(`/api/v1/caregiver/${id}`, data);
    return response.data;
  },
  deleteCaregiver: async (id: number) => {
    const response = await api.delete(`/api/v1/caregiver/${id}`);
    return response.data;
  },
  verifyCertifications: async (id: number, verified: boolean) => {
    const response = await api.post(`/api/v1/caregiver/${id}/verify-certifications?verified=${verified}`);
    return response.data;
  },
  updateCaregiverSkillsAndAvailability: async (id: number, skills?: string, status?: string) => {
    const response = await api.put(`/api/v1/caregiver/${id}/operator-update`, null, {
      params: { skills, status }
    });
    return response.data;
  }
};

export const scheduleApi = {
  getByPatient: async (patientId: string | number) => {
    try {
      const response = await api.get(`/api/v1/schedules/patient/${patientId}`, { skipToast: true } as any);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch schedules. Returning empty array.", error);
      return [];
    }
  }
};

export const incidentApi = {
  getByPatient: async (patientId: string | number) => {
    try {
      const response = await api.get(`/api/v1/incidents/patient/${patientId}`, { skipToast: true } as any);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch incidents. Returning empty array.", error);
      return [];
    }
  }
};

export const serviceApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/bookings/services');
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch services", error);
      return [];
    }
  }
};

export const careRequestApi = {
  getMy: async () => {
    const response = await api.get('/api/v1/bookings/care-requests/my');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/api/v1/bookings/care-requests');
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await api.get(`/api/v1/bookings/care-requests/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/bookings/care-requests', data);
    return response.data;
  },
  updateStatus: async (id: string | number, status: string) => {
    const response = await api.put(`/api/v1/bookings/care-requests/${id}/status?status=${status}`);
    return response.data;
  },
  assignCaregiver: async (id: string | number, caregiverId: string | number) => {
    const response = await api.put(`/api/v1/bookings/care-requests/${id}/assign?caregiverId=${caregiverId}`);
    return response.data;
  },
  checkAvailability: async (caregiverId: string | number, date: string, startTime: string, endTime: string) => {
    const response = await api.get(`/api/v1/bookings/caregivers/${caregiverId}/availability`, {
      params: { date, startTime, endTime }
    });
    return response.data;
  }
};

export const contractApi = {
  getMy: async () => {
    const response = await api.get('/api/v1/bookings/contracts/my');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/api/v1/bookings/contracts');
    return response.data;
  },
  sign: async (id: string | number) => {
    const response = await api.put(`/api/v1/bookings/contracts/${id}/sign`);
    return response.data;
  },
  approve: async (id: string | number) => {
    const response = await api.put(`/api/v1/bookings/contracts/${id}/approve`);
    return response.data;
  }
};

export const appealApi = {
  submit: async (message: string) => {
    const response = await api.post('/api/v1/users/profile/appeal', { message });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/api/v1/users/appeals');
    return response.data;
  },
  reply: async (id: number | string, replyContent: string) => {
    const response = await api.post(`/api/v1/users/appeals/${id}/reply`, { replyContent });
    return response.data;
  }
};

export default caregiverApi;


