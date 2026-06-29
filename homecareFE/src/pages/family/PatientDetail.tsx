import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollAnimation from "@/components/ui/scroll-animation";
import { familyApi, scheduleApi, incidentApi } from '@/lib/api';
import EditPatientModal from './EditPatientModal';
import LocationPickerMap from '@/components/LocationPickerMap';

interface Patient {
    id: number;
    fullName: string;
    dob: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory: string;
    medicalConditions: string;
    relation: string;
    status: string;
    address: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    latitude?: number;
    longitude?: number;
}

const PatientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [patientsData, schedulesData, incidentsData] = await Promise.all([
                familyApi.getPatients(),
                scheduleApi.getByPatient(id).catch(() => []),
                incidentApi.getByPatient(id).catch(() => [])
            ]);

            const foundPatient = patientsData?.find((p: any) => p.id === parseInt(id));
            setPatient(foundPatient || null);

            setSchedules(schedulesData?.filter((s: any) => s.patientId === parseInt(id)).slice(0, 4) || []);
            setIncidents(incidentsData || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching patient detail data:', err);
            setError(err.message || 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <span className="material-symbols-outlined text-6xl text-stone-300 mb-4">error</span>
                <p className="text-stone-500 mb-4">{error || "Patient not found"}</p>
                <Link to="/family/patients" className="text-[#5fa5ba] font-bold hover:underline">
                    ← Back to directory
                </Link>
            </div>
        );
    }

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

    // Parse medical conditions if stored as JSON
    const getMedicalConditions = () => {
        const cond = patient.medicalConditions || patient.medicalHistory;
        if (!cond) return [];
        if (Array.isArray(cond)) return cond;
        try {
            const parsed = JSON.parse(cond);
            if (Array.isArray(parsed)) return parsed;
            return [parsed];
        } catch {
            return cond.split(',').map((c: string) => c.trim());
        }
    };

    const conditions = getMedicalConditions();

    return (
        <div className="space-y-10 animate-fade-in-up pb-12 font-['Public_Sans'] p-8 max-w-7xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-bold text-stone-400">
                <Link to="/family/patients" className="hover:text-[#5fa5ba]">Patients</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-stone-800">{patient.fullName}</span>
            </div>

            {/* Profile Header Card */}
            <ScrollAnimation animation="fade-in">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E0F2F1]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-[#E0F2F1]/70 transition-colors duration-700"></div>

                    <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-[#5fa5ba] flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white shrink-0">
                                {patient.fullName?.[0] || 'P'}
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{patient.fullName}</h1>
                                <p className="text-xl font-medium text-stone-500 mt-1">
                                    {patient.relation || 'Relative'} • {getAge(patient.dateOfBirth || patient.dob)} years
                                </p>
                            </div>

                            {conditions.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {conditions.map((condition: string, i: number) => (
                                        <div key={i} className="px-5 py-2.5 bg-[#E0F2F1] rounded-2xl border border-[#B2EBF2] flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00695C] text-sm">medical_services</span>
                                            <span className="text-sm font-bold text-[#00695C]">{condition}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {patient.medicalHistory && (
                                <p className="text-stone-600 leading-relaxed font-medium max-w-2xl px-1">
                                    {patient.medicalHistory}
                                </p>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px] hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollAnimation>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Patient Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ScrollAnimation animation="fade-up" delay={0.1}>
                            <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">cake</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Date of Birth</p>
                                    <p className="text-lg font-black text-stone-900">
                                        {patient.dateOfBirth || patient.dob
                                            ? new Date(patient.dateOfBirth || patient.dob).toLocaleDateString('en-US')
                                            : 'Not updated'}
                                    </p>
                                </div>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation animation="fade-up" delay={0.2}>
                            <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">wc</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Gender</p>
                                    <p className="text-lg font-black text-stone-900">
                                        {patient.gender || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>

                    {/* Recent Schedules */}
                    <ScrollAnimation animation="fade-up">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-stone-900">Recent Care Schedule</h3>
                                <Link to="/family/schedule" className="text-stone-900 text-sm font-bold hover:underline bg-stone-100 px-4 py-2 rounded-full border border-stone-200">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {schedules.length > 0 ? schedules.map((schedule, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border bg-white border-stone-100 hover:border-stone-300 hover:shadow-md transition-all">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E0F2F1] text-[#00695C]">
                                            <span className="material-symbols-outlined">calendar_today</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-base text-stone-800">
                                                {new Date(schedule.scheduledDate).toLocaleDateString('en-US')}
                                            </p>
                                            <p className="text-xs font-bold text-stone-400">
                                                {schedule.startTime} - {schedule.endTime}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${schedule.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            schedule.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {schedule.status}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-center text-stone-400 py-8 font-medium">No recent care sessions found</p>
                                )}
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Incident History - NEW */}
                    <ScrollAnimation animation="fade-up">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-red-100 shadow-sm shadow-red-50/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                                        <span className="material-symbols-outlined">report_problem</span>
                                    </div>
                                    <h3 className="text-xl font-black text-stone-900">Safety & Incidents</h3>
                                </div>
                                {incidents.filter(i => i.status !== 'Resolved').length > 0 && (
                                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full animate-pulse uppercase tracking-widest">
                                        {incidents.filter(i => i.status !== 'Resolved').length} Active
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {incidents.length > 0 ? incidents.map((incident, i) => (
                                    <Link
                                        to={`/family/incidents/detail/${incident.id}`}
                                        key={i}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${incident.status === 'Resolved'
                                            ? 'bg-white border-stone-100 hover:border-stone-300'
                                            : 'bg-red-50/30 border-red-100 hover:border-red-200 shadow-sm'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${incident.severity === 'Critical' ? 'bg-red-600 text-white' :
                                            incident.severity === 'High' ? 'bg-red-100 text-red-600' :
                                                'bg-stone-100 text-stone-500'
                                            }`}>
                                            <span className="material-symbols-outlined">
                                                {incident.severity === 'Critical' ? 'emergency' : 'warning'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-extrabold text-base text-stone-800 group-hover:text-[#5fa5ba] transition-colors line-clamp-1">
                                                    {incident.title}
                                                </p>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${incident.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {incident.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-stone-400">
                                                {new Date(incident.occurredAt).toLocaleDateString('vi-VN')} • Reported by {incident.caregiverName}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-stone-300 group-hover:text-[#5fa5ba] transition-all group-hover:translate-x-1">
                                            arrow_forward_ios
                                        </span>
                                    </Link>
                                )) : (
                                    <div className="text-center py-10 bg-stone-50 rounded-[2rem] border border-stone-100 border-dashed">
                                        <span className="material-symbols-outlined text-4xl text-stone-200 mb-2">check_circle</span>
                                        <p className="text-stone-400 font-bold">No safety incidents reported</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <ScrollAnimation animation="slide-left">
                        <div className="bg-[#5fa5ba] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#5fa5ba]/20 min-h-[300px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

                            <div>
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <span className="material-symbols-outlined text-xl">contact_page</span>
                                    </div>
                                    <h3 className="text-lg font-bold">Contact Information</h3>
                                </div>

                                <div className="space-y-6 relative z-10 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <p className="text-[10px] font-black uppercase tracking-widest">Care Address</p>
                                        </div>
                                        <p className="font-bold text-sm leading-relaxed pl-6">{patient.address || 'Address not listed'}</p>
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/20 shadow-md">
                                            <LocationPickerMap
                                                latitude={patient.latitude}
                                                longitude={patient.longitude}
                                                address={patient.address}
                                                readOnly={true}
                                                height="160px"
                                            />
                                        </div>
                                        {(!patient.latitude || !patient.longitude || patient.latitude === 0 || patient.longitude === 0) && (
                                            <p className="text-[10px] text-[#FFE082] font-semibold pl-6 flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[12px]">warning</span>
                                                Chưa cập nhật định vị bản đồ.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                                            <p className="text-[10px] font-black uppercase tracking-widest">Emergency Contact</p>
                                        </div>
                                        <div className="pl-6">
                                            {patient.emergencyContact || patient.emergencyPhone ? (
                                                <>
                                                    {patient.emergencyContact && <p className="font-bold text-sm">{patient.emergencyContact}</p>}
                                                    {patient.emergencyPhone && (
                                                        <p className="text-sm font-black mt-1 opacity-90">{patient.emergencyPhone}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium opacity-70 italic">No contact information</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/family/requests?service_id=1&patient_id=${patient.id}`}
                                className="block w-full py-4 bg-white text-[#5fa5ba] rounded-2xl font-black text-[11px] uppercase tracking-[2px] mt-8 hover:bg-stone-50 transition-all text-center shadow-lg active:scale-95"
                            >
                                Create Care Request
                            </Link>
                        </div>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slide-left" delay={0.1}>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
                            <h3 className="text-lg font-bold text-stone-900 mb-6">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link to="/family/health-report" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">monitoring</span>
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900">View Health Reports</span>
                                </Link>
                                <Link to="/family/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">calendar_month</span>
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900">Care Schedule</span>
                                </Link>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                patient={patient}
                onPatientUpdated={() => fetchData()}
            />
        </div>
    );
};

export default PatientDetail;
