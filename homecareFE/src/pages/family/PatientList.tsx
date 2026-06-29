import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollAnimation from "@/components/ui/scroll-animation";
import { familyApi } from '@/lib/api';
import AddMemberModal from './AddMemberModal';
import EditPatientModal from './EditPatientModal';
import { toast } from 'react-hot-toast';

interface Patient {
    id: number;
    fullName: string;
    dob: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory: string;
    relation: string;
    status: string;
    address: string;
    latitude?: number;
    longitude?: number;
}

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await familyApi.getPatients();
            setPatients(data || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching patients:', err);
            setError(err.message || 'Failed to load patients list');
        } finally {
            setLoading(false);
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

    const handleEditClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handlePatientAdded = () => {
        fetchPatients();
        setIsAddModalOpen(false);
        toast.success("Patient profile created successfully!");
    };

    const handlePatientUpdated = () => {
        fetchPatients();
        setIsEditModalOpen(false);
        toast.success("Patient profile updated successfully!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone-500 font-medium">Loading patients directory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 font-['Public_Sans']">
            {/* 1. Header: Section title & Add Patient Button */}
            <ScrollAnimation animation="fade-in" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">My Patients</h1>
                    <p className="text-sm text-stone-500 mt-1">Manage health profiles and details for your family members.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-black font-black uppercase text-[11px] tracking-[2px] px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 shrink-0"
                >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Add Family Member
                </button>
            </ScrollAnimation>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* 2. Patient Directory Grid */}
            <div className="space-y-4">
                {patients.length === 0 ? (
                    <ScrollAnimation animation="fade-up">
                        <div className="bg-white rounded-[2.5rem] border border-stone-150 p-12 text-center shadow-sm">
                            <span className="material-symbols-outlined text-6xl text-stone-200 mb-4">family_restroom</span>
                            <h3 className="text-lg font-bold text-stone-800 mb-1">No patients registered</h3>
                            <p className="text-stone-400 text-sm mb-6 max-w-sm mx-auto">Create profile records for your family members to start booking care requests.</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#99C5D3] text-white hover:bg-[#5fa5ba] rounded-xl font-bold text-xs shadow-md transition-colors"
                            >
                                Get Started
                            </button>
                        </div>
                    </ScrollAnimation>
                ) : (
                    patients.map((patient, index) => (
                        <ScrollAnimation key={patient.id} animation="fade-up" delay={index * 0.05}>
                            <div className="bg-white rounded-[2rem] border border-stone-100 hover:border-[#99C5D3]/50 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                <div className="flex flex-col lg:flex-row lg:items-center">
                                    {/* Left: Avatar & Identity */}
                                    <div className="p-6 flex items-center gap-4 lg:w-[30%] border-b lg:border-b-0 lg:border-r border-stone-50">
                                        <div className="w-14 h-14 rounded-2xl bg-[#99C5D3] text-white text-xl font-black flex items-center justify-center shadow-inner shrink-0">
                                            {patient.fullName?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-stone-900 group-hover:text-[#5fa5ba] transition-colors line-clamp-1">{patient.fullName}</h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="bg-stone-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-stone-500 border border-stone-100">
                                                    {patient.relation || 'Patient'}
                                                </span>
                                                <span className="text-xs text-stone-400 font-medium">{getAge(patient.dateOfBirth || patient.dob)} yrs</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Medical Context */}
                                    <div className="p-6 flex-1 flex flex-col md:flex-row gap-8 items-center justify-between">
                                        <div className="flex flex-col gap-1.5 w-full md:w-auto">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#99C5D3] rounded-full"></span>
                                                Medical Records
                                            </span>
                                            <p className="text-sm font-bold text-stone-700 flex items-center gap-2 line-clamp-1">
                                                {patient.medicalHistory || 'No records added'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1.5 w-full md:w-auto">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</span>
                                            <span className={`text-sm font-medium flex items-center gap-1 ${patient.status?.toLowerCase() === 'inactive' ? 'text-stone-500' : 'text-emerald-600'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${patient.status?.toLowerCase() === 'inactive' ? 'bg-stone-400' : 'bg-emerald-400'
                                                    }`}></span>
                                                {patient.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="p-4 flex items-center justify-end gap-2 lg:w-[25%]">
                                        <button
                                            onClick={() => handleEditClick(patient)}
                                            className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-[#99C5D3] hover:text-white transition-all shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <Link to={`/family/patients/detail/${patient.id}`} className="ml-2 pl-4 pr-1.5 py-1.5 rounded-full border border-stone-100 hover:border-[#99C5D3] bg-white group-hover:bg-[#99C5D3]/10 transition-all flex items-center gap-3">
                                            <span className="text-xs font-bold text-stone-600 group-hover:text-[#5fa5ba]">View Details</span>
                                            <span className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#5fa5ba] group-hover:text-white text-stone-500 flex items-center justify-center transition-all">
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </span>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </ScrollAnimation>
                    ))
                )}
            </div>

            {/* 3. Bottom: Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                <ScrollAnimation animation="slide-right" className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-stone-900">Quick Tips</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 group p-4 rounded-xl bg-stone-50 hover:bg-[#E0F2F1] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#99C5D3] text-white flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-800 text-sm">Add Complete Information</h4>
                                    <p className="text-xs text-stone-500 mt-1">Include health notes and allergies for better care planning.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 group p-4 rounded-xl bg-stone-50 hover:bg-[#E0F2F1] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#99C5D3] text-white flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-800 text-sm">Schedule Regular Check-ups</h4>
                                    <p className="text-xs text-stone-500 mt-1">Book appointments to ensure continuous care for your patients.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation animation="slide-left" delay={0.2} className="lg:col-span-1">
                    <div className="bg-[#5fa5ba] rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden flex flex-col justify-center shadow-lg shadow-[#5fa5ba]/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 shadow-inner">
                                <span className="material-symbols-outlined text-3xl">medical_services</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Need Assistance?</h3>
                            <p className="text-white/90 text-sm mb-6 leading-relaxed">Our medical team is available 24/7 for consultations.</p>
                            <button className="w-full py-3.5 bg-white text-[#5fa5ba] rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>

            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onPatientAdded={handlePatientAdded}
            />

            {selectedPatient && (
                <EditPatientModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    patient={selectedPatient}
                    onPatientUpdated={handlePatientUpdated}
                />
            )}
        </div>
    );
};

export default PatientList;
