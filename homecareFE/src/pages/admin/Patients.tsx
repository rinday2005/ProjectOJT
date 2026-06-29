import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Filter, UserPlus, Trash2, Eye, MoreVertical, Users, ClipboardCheck, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/layouts/AdminLayout";
import { adminApi } from "@/lib/api";
import AddPatientModal from "./AddPatientModal";
import EditPatientModal from "../family/EditPatientModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";

interface Patient {
  id: number;
  fullName: string;
  name?: string;
  dob: string;
  dateOfBirth: string;
  gender: string;
  medicalHistory: string;
  relation: string;
  status: string;
  currentCondition?: string;
  address: string;
  familyId?: number;
  familyName?: string;
}

const getRiskColor = (condition?: string) => {
  if (!condition) return 'bg-stone-100 text-stone-800 border-stone-250';
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('critical') || lowerCondition.includes('urgent') || lowerCondition.includes('emergency')) {
    return 'bg-red-50 text-red-700 border-red-200';
  }
  if (lowerCondition.includes('monitor') || lowerCondition.includes('care')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-green-50 text-emerald-700 border-emerald-200';
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-250";
    case "on hold":
      return "bg-amber-100 text-amber-800 border-amber-250";
    case "inactive":
      return "bg-stone-100 text-stone-800 border-stone-250";
    default:
      return "bg-blue-100 text-blue-800 border-blue-250";
  }
};

const getAge = (dobString: string) => {
  if (!dobString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Patients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [monitorOnly, setMonitorOnly] = useState(false);

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const isOperationAdmin = location.pathname.startsWith('/operation-admin');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPatients();
      setPatients(data || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Failed to fetch patients database");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await adminApi.deletePatient(patientToDelete.id);
      toast.success("Patient profile removed successfully!");
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      fetchPatients();
    } catch (err: any) {
      console.error("Failed to delete patient:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to remove patient profile");
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.currentCondition || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesRisk =
      !monitorOnly || (p.currentCondition || '').toLowerCase().includes("monitor") || (p.currentCondition || '').toLowerCase().includes("critical");

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status?.toUpperCase() === 'ACTIVE').length,
    highRisk: patients.filter(p => {
      const cond = (p.currentCondition || '').toLowerCase();
      return cond.includes('monitor') || cond.includes('critical') || cond.includes('urgent');
    }).length,
    newThisMonth: patients.length
  };

  const statsCards = [
    { label: "TOTAL PATIENTS", value: stats.total.toString(), icon: Users, color: "bg-blue-50/50 text-blue-600 border border-blue-100" },
    { label: "ACTIVE CARE PLANS", value: stats.active.toString(), icon: ClipboardCheck, color: "bg-emerald-50/50 text-emerald-600 border border-emerald-100" },
    { label: "NEED MONITORING", value: stats.highRisk.toString(), icon: Activity, color: "bg-amber-50/50 text-amber-600 border border-amber-100" },
    { label: "NEW THIS MONTH", value: stats.newThisMonth.toString(), icon: Sparkles, color: "bg-indigo-50/50 text-indigo-600 border border-indigo-100" },
  ];

  return (
    <div className="font-['Public_Sans'] pb-12">
      <AdminHeader
        breadcrumb="Patient Directory"
        searchPlaceholder="Search patients by name, owner, or condition..."
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Patient Directory</h1>
            <p className="text-sm text-stone-500 mt-1">Manage patient records, care levels, and family association.</p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 pl-9 rounded-xl border-stone-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-xl gap-2 border-stone-200 ${showFilters ? 'bg-stone-100 border-stone-300' : 'bg-white'}`}
            >
              <Filter className="w-4 h-4 text-stone-600" />
              Filters
            </Button>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="rounded-xl gap-2 bg-[#5fa5ba] hover:bg-[#488e9f] text-white shadow-md font-bold text-xs"
            >
              <UserPlus className="w-4 h-4" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label} className="border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-5 p-6">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">{stat.label}</p>
                    <p className="text-2xl font-black text-stone-900 mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border-stone-100 rounded-3xl p-6 bg-stone-50/50 shadow-sm animate-fade-in-up">
            <h3 className="text-sm font-bold text-stone-800 mb-4">Filter Records</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="space-y-1.5 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Patient Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-xl bg-white border-stone-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-stone-100 rounded-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on hold">On Hold</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="monitor-only"
                  checked={monitorOnly}
                  onChange={(e) => setMonitorOnly(e.target.checked)}
                  className="rounded border-stone-300 w-4 h-4 accent-[#5fa5ba] cursor-pointer"
                />
                <label htmlFor="monitor-only" className="text-sm font-bold text-stone-700 cursor-pointer select-none">
                  Needs Monitoring / High Risk Only
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Patients Table / List */}
        <Card className="border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-stone-400 font-medium">Loading database records...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-stone-200 mb-2">groups</span>
              <p className="text-stone-400 font-bold">No patient profiles match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b border-stone-100 text-stone-400 text-[10px] font-black uppercase tracking-wider">
                    <th className="py-4 px-6">Patient</th>
                    <th className="py-4 px-6">Age / Gender</th>
                    <th className="py-4 px-6">Family Owner</th>
                    <th className="py-4 px-6">Care Level / Risk</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 font-black text-stone-600 border border-stone-200 flex items-center justify-center shrink-0">
                            <span>{patient.fullName?.[0] || 'P'}</span>
                          </div>
                          <div>
                            <p className="font-extrabold text-stone-900 group-hover:text-[#5fa5ba] transition-colors">{patient.fullName}</p>
                            <p className="text-xs text-stone-400 mt-0.5 max-w-[200px] truncate">{patient.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-sm font-bold text-stone-700">{getAge(patient.dateOfBirth || patient.dob)} yrs</p>
                        <p className="text-xs text-stone-400 mt-0.5">{patient.gender}</p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-sm font-bold text-stone-700">{patient.familyName || 'System'}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Family ID: {patient.familyId || 'N/A'}</p>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRiskColor(patient.currentCondition)}`}>
                          {patient.currentCondition || 'Standard'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(patient.status)}`}>
                          {patient.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(patient)}
                            className="p-2 rounded-lg bg-stone-50 text-stone-500 hover:bg-[#99C5D3] hover:text-white transition-all shadow-sm"
                            title="Edit profile"
                          >
                            <span className="material-symbols-outlined text-sm flex">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="p-2 rounded-lg bg-stone-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete profile"
                          >
                            <span className="material-symbols-outlined text-sm flex">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <AddPatientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onPatientAdded={() => {
          setIsAddOpen(false);
          fetchPatients();
        }}
      />

      {selectedPatient && (
        <EditPatientModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          patient={selectedPatient}
          onPatientUpdated={() => {
            setIsEditOpen(false);
            fetchPatients();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} className="max-w-md">
        <DialogContent className="max-w-md bg-white rounded-[2rem] border-stone-100 p-8 font-['Public_Sans']">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="text-stone-500 text-sm mt-2">
              Are you sure you want to remove the health profile for <strong>{patientToDelete?.fullName}</strong>? This will soft-delete their records and prevent scheduling further checkups.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md px-6"
            >
              Remove Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
