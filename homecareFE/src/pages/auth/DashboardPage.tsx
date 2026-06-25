import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Shield, CheckCircle2, XCircle, Lock, Info } from 'lucide-react';
import api from '../../services/api.service';
import KeycloakService from '../../services/keycloak';

export const DashboardPage: React.FC = () => {
  const kc = KeycloakService.keycloak;
  const roles = kc.tokenParsed?.realm_access?.roles || [];
  
  if (roles.includes('FAMILY') || roles.includes('family')) {
    return <Navigate to="/family/welcome" replace />;
  }

  if (roles.some(r => ['ADMIN', 'admin', 'OPERATOR', 'operator'].includes(r))) {
    return <Navigate to="/admin" replace />;
  }

  const [testResult, setTestResult] = useState<string | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // Call backend test API via Gateway
  const handleTestBackend = async () => {
    setLoadingTest(true);
    setTestResult(null);
    setTestError(null);
    try {
      // Gateway forwards /api/v1/admin/** to user-service
      const response = await api.get('/api/v1/admin/admin-dashboard');
      setTestResult(response.data);
    } catch (err: any) {
      console.error(err);
      setTestError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to connect to the backend or access is denied (403)"
      );
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Member Dashboard</h1>
          <p className="text-slate-500">Manage your account details and review backend microservices connectivity.</p>
        </div>
        <button
          onClick={() => handleTestBackend()}
          disabled={loadingTest}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {loadingTest ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Shield size={18} />
          )}
          <span>Test Auth with User-Service</span>
        </button>
      </div>

      {/* Connection Test Result */}
      {(testResult || testError) && (
        <div className="mb-8 animate-fade-in">
          {testResult && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
              <CheckCircle2 className="text-green-600 mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-bold">Backend Connection Successful!</h4>
                <p className="text-sm mt-1 text-green-700 font-mono bg-white/50 p-2 rounded border border-green-100">
                  {testResult}
                </p>
              </div>
            </div>
          )}
          {testError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
              <XCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-bold">Connection Test Failed!</h4>
                <p className="text-sm mt-1 text-red-700">{testError}</p>
                <p className="text-xs text-red-500 mt-1">
                  Tip: Make sure the API Gateway (8080) and User-Service (8081) are running, and that your Keycloak token has the ADMIN or OPERATOR role.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Keycloak Account Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <User size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Account Details</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Preferred Username</span>
              <strong className="text-slate-700 font-medium text-base">{kc.tokenParsed?.preferred_username || 'Not updated'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Email Address</span>
              <strong className="text-slate-700 font-medium">{kc.tokenParsed?.email || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Full Name</span>
              <strong className="text-slate-700 font-medium">{kc.tokenParsed?.name || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Keycloak Sub ID (Subject)</span>
              <span className="text-slate-500 font-mono text-xs break-all bg-slate-50 p-1.5 rounded block mt-1">{kc.subject}</span>
            </div>
          </div>
        </div>

        {/* Decoded JWT Token Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Session Inspection (JWT Token)</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-slate-400 block text-xs mb-1">Permissions / Roles (Realm Access Roles)</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {(kc.tokenParsed?.realm_access?.roles || []).map((role: string) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    ROLE_{role}
                  </span>
                ))}
                {(kc.tokenParsed?.realm_access?.roles || []).length === 0 && (
                  <span className="text-slate-400 italic">No roles found.</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-xs mb-1">AccessToken (Truncated)</span>
              <pre className="text-xs font-mono bg-slate-50 text-slate-500 p-3 rounded-lg overflow-x-auto border border-slate-100 break-all select-all">
                {kc.token ? `${kc.token.substring(0, 80)}...[TRUNCATED]...${kc.token.substring(kc.token.length - 80)}` : 'No Token Available'}
              </pre>
            </div>

            <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-blue-800">
              <Info size={16} className="shrink-0" />
              <p className="text-xs">
                The Axios client automatically appends this token to all requests sent to the backend through the API Gateway. The interceptor automatically extends the token before it expires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
