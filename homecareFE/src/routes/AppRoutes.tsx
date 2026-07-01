import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from '../pages/auth/HomePage';
import DashboardPage from '../pages/auth/DashboardPage';
import Contact from '../pages/auth/Contact';
import HowItWorks from '../pages/auth/HowItWorks';
import OurCaregivers from '../pages/auth/OurCaregivers';
import Service from '../pages/auth/Service';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout';
import FamilyLayout from '../components/layouts/FamilyLayout';
import Welcome from '../pages/family/welcome';
import FamilyDashboard from '../pages/family/dashboard';
import FamilyProfile from '../pages/family/familyProfile';
import PatientList from '../pages/family/PatientList';
import PatientDetail from '../pages/family/PatientDetail';
import Schedule from '../pages/family/schedule';
import Services from '../pages/family/services';
import Requests from '../pages/family/requests';
import Contracts from '../pages/family/contracts';
import RequestDetail from '../pages/family/RequestDetail';
import CreateRequest from '../pages/family/CreateRequest';
import CreateContract from '../pages/family/CreateContract';
import FamilyPaymentPage from '../pages/family/FamilyPaymentPage';
import Payments from '../pages/family/payments';
import AdminRequestsContracts from '../pages/admin/RequestsContracts';
import HealthReport from '../pages/family/healthReport';
import Feedback from '../pages/family/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminDashboard from '../pages/admin/adminDashboard';
import AdminProfile from '../pages/admin/adminProfile';
import AdminUsers from '../pages/admin/user';
import AdminPatients from '../pages/admin/Patients';
import AdminCaregivers from '../pages/admin/Caregivers';
import OperatorCaregivers from '../pages/operator/Caregivers';
import KeycloakService from '../services/keycloak';
import { XCircle } from 'lucide-react';
import BlockedPage from '../pages/auth/BlockedPage';
import AdminAppeals from '../pages/admin/AdminAppeals';

const CaregiversRouteDispatcher: React.FC = () => {
  const roles = KeycloakService.keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.some(r => r.toUpperCase() === 'ADMIN');
  return isAdmin ? <AdminCaregivers /> : <OperatorCaregivers />;
};

export const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* 1. Public Layout (Navbar & Footer included) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/caregivers" element={<OurCaregivers />} />
        <Route path="/services" element={<Service />} />

        {/* Main User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Standalone Blocked Page */}
      <Route
        path="/blocked"
        element={
          <ProtectedRoute>
            <BlockedPage />
          </ProtectedRoute>
        }
      />

      {/* 2. Family Layout (Custom Sidebar & Topbar, no default footer) */}
      <Route
        path="/family"
        element={
          <ProtectedRoute>
            <FamilyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FamilyDashboard />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="profile" element={<FamilyProfile />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/detail/:id" element={<PatientDetail />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="services" element={<Services />} />
        <Route path="requests" element={<Requests />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="requests/new" element={<CreateRequest />} />
        <Route path="requests/create" element={<CreateRequest />} />
        <Route path="contracts/create" element={<CreateContract />} />
        <Route path="requests/:id" element={<RequestDetail />} />
        <Route path="payment/:id" element={<FamilyPaymentPage />} />
        <Route path="payments" element={<Payments />} />
        <Route path="health-report" element={<HealthReport />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* 3. Admin Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="caregivers" element={<CaregiversRouteDispatcher />} />
        <Route path="requests" element={<AdminRequestsContracts />} />
        <Route path="appeals" element={<AdminAppeals />} />
        <Route path="schedule" element={<div className="p-8"><div className="bg-white p-8 rounded-[2rem] border border-stone-150"><h2>Schedule Management (Admin View - Under Construction)</h2></div></div>} />
        <Route path="reports" element={<div className="p-8"><div className="bg-white p-8 rounded-[2rem] border border-stone-150"><h2>Reports & Analytics (Admin View - Under Construction)</h2></div></div>} />
        <Route path="settings" element={<div className="p-8"><div className="bg-white p-8 rounded-[2rem] border border-stone-150"><h2>Settings (Admin View - Under Construction)</h2></div></div>} />
        <Route path="help" element={<div className="p-8"><div className="bg-white p-8 rounded-[2rem] border border-stone-150"><h2>Help Center (Admin View - Under Construction)</h2></div></div>} />
      </Route>

      {/* 4. Catch-all Not Found Page */}
      <Route
        path="*"
        element={
          <div className="max-w-md mx-auto text-center py-16 px-4">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
            <p className="text-slate-500 mt-2">The path you requested does not exist or has been removed.</p>
            <Link to="/" className="inline-block mt-6 text-[#0d8ca5] hover:text-[#0a7d94] font-medium">
              Back to Home
            </Link>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
