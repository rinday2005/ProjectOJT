import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { familyApi, serviceApi, careRequestApi } from '@/lib/api';
import { formatDateToYYYYMMDD } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import ScrollAnimation from "@/components/ui/scroll-animation";

const CreateRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const serviceIdParam = searchParams.get('service_id');

    const [patients, setPatients] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const isContract = location.pathname.includes('contract');
    const [requestType, setRequestType] = useState(isContract ? 'Recurring' : 'One-time'); // 'One-time' or 'Recurring'
    const [requestedDate, setRequestedDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(2); // hours
    const [notes, setNotes] = useState('');
    const [careAddress, setCareAddress] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientsData, servicesData] = await Promise.all([
                    familyApi.getPatients(),
                    serviceApi.getAll()
                ]);
                setPatients(patientsData || []);
                setServices(servicesData || []);

                if (patientsData?.length > 0) {
                    setSelectedPatientId(patientsData[0].id.toString());
                    setCareAddress(patientsData[0].address || '');
                }

                if (serviceIdParam) {
                    const service = servicesData.find((s: any) => s.id.toString() === serviceIdParam);
                    if (service) {
                        setSelectedService(service);
                    }
                } else if (servicesData?.length > 0) {
                    setSelectedService(servicesData[0]);
                }

                // Set default date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setRequestedDate(formatDateToYYYYMMDD(tomorrow));

            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load request data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [serviceIdParam]);

    const totalPrice = useMemo(() => {
        if (!selectedService) return 0;
        const price = selectedService.basePrice || selectedService.price || 0;
        return price * duration;
    }, [selectedService, duration]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) {
            toast.error('Please select a patient');
            return;
        }
        if (!selectedService) {
            toast.error('Please select a service');
            return;
        }

        try {
            setSubmitting(true);

            // Format start_time as HH:mm:00
            const formattedStartTime = startTime.includes(':') && startTime.split(':').length === 2
                ? `${startTime}:00`
                : startTime;

            let resolvedServiceIdStr = selectedService.id.toString();
            if (resolvedServiceIdStr.startsWith('s')) {
                resolvedServiceIdStr = resolvedServiceIdStr.replace('s', '');
            }
            const resolvedServiceId = parseInt(resolvedServiceIdStr, 10);

            const payload = {
                serviceId: resolvedServiceId,
                patientId: parseInt(selectedPatientId),
                requestedDate: requestedDate,
                startTime: formattedStartTime,
                duration: parseInt(duration.toString()),
                notes: notes || null,
                type: requestType,
                address: careAddress
            };

            await careRequestApi.create(payload);
            toast.success("Care request created successfully! Please wait for admin approval.");
            navigate('/family/requests');
        } catch (error: any) {
            console.error("Failed to create request:", error);
            toast.error("Failed to submit request: " + (error.message || error));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-500 font-medium">Loading request form...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-24 font-['Public_Sans'] px-6 md:px-12 py-6">
            {/* Header */}
            <div className="mb-12">
                <Link to="/family/requests" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-[#5fa5ba] mb-4 transition-colors">
                    <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
                    Back to Requests
                </Link>
                <h1 className="text-4xl font-black text-stone-900 tracking-tight">Create New Care Request</h1>
                <p className="text-stone-500 font-medium mt-2">Set up the perfect care plan for your family member</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in-up">

                {/* 1. Who is the care for? */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center border border-[#B2EBF2]">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <h2 className="text-xl font-bold text-stone-900">1. Who is the care for?</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {patients.length === 0 ? (
                            <div className="col-span-2 text-center py-8 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                                <p className="text-stone-500">No patients found.</p>
                                <Link to="/family/patients" className="text-[#5fa5ba] font-bold mt-2 inline-block hover:underline">Add a patient first</Link>
                            </div>
                        ) : (
                            patients.map((patient) => (
                                <div key={patient.id} className="relative group">
                                    <input
                                        checked={selectedPatientId === patient.id.toString()}
                                        onChange={() => {
                                            setSelectedPatientId(patient.id.toString());
                                            setCareAddress(patient.address || '');
                                        }}
                                        className="hidden peer"
                                        id={`patient-${patient.id}`}
                                        name="patient"
                                        type="radio"
                                    />
                                    <label
                                        className="flex items-center gap-4 p-5 bg-white border-2 border-stone-100 rounded-[2rem] cursor-pointer hover:border-[#B2EBF2] transition-all peer-checked:border-[#5fa5ba] peer-checked:bg-[#E0F2F1]/30 hover:shadow-md h-full"
                                        htmlFor={`patient-${patient.id}`}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#5fa5ba] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm">
                                            {patient.fullName?.[0] || 'P'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-stone-800 text-lg truncate">{patient.fullName || patient.name}</p>
                                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                                {patient.relation || 'Family Member'}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined ml-auto text-[#5fa5ba] opacity-0 peer-checked:opacity-100 font-bold">check_circle</span>
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 2. Selected Service Package */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center border border-[#B2EBF2]">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <h2 className="text-xl font-bold text-stone-900">2. Selected Care Template</h2>
                    </div>
                    {
                        selectedService ? (
                            <div className="bg-white border-2 border-stone-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-l-[12px] border-l-[#5fa5ba] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <span className="material-symbols-outlined text-[100px]">medical_services</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
                                    <div className="w-16 h-16 rounded-2xl bg-[#5fa5ba] flex items-center justify-center text-white shadow-lg shrink-0">
                                        <span className="material-symbols-outlined text-3xl">health_metrics</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-stone-900">{selectedService.name}</h3>
                                        <p className="text-stone-500 text-sm font-medium max-w-md mt-1 leading-relaxed">{selectedService.description}</p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                                            <span className="bg-[#E0F2F1] text-[#00695C] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#B2EBF2]">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedService.basePrice || selectedService.price || 150000)}/hour
                                            </span>
                                            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {selectedService.skillLevel || 'Basic Care'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to="/family/services"
                                    className="px-6 py-3 border-2 border-stone-200 rounded-xl text-xs font-black text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all uppercase tracking-widest flex items-center gap-2 bg-stone-50 shrink-0"
                                >
                                    <span className="material-symbols-outlined text-base">sync_alt</span>
                                    Change Service
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-red-50 p-8 rounded-[2.5rem] border-2 border-dashed border-red-200 text-center">
                                <p className="text-red-600 font-black mb-3 uppercase tracking-widest text-xs">No service selected</p>
                                <Link to="/family/services" className="bg-red-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200">Browse Marketplace</Link>
                            </div>
                        )
                    }
                </section>

                {/* 3. Scheduling & Address */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center border border-[#B2EBF2]">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <h2 className="text-xl font-bold text-stone-900">3. Care Schedule & Location</h2>
                    </div>

                    <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 block">Requested Date</label>
                                <input
                                    className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-bold text-stone-800 shadow-sm"
                                    type="date"
                                    value={requestedDate}
                                    onChange={(e) => setRequestedDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Start Time */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 block">Start Time</label>
                                <input
                                    className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-bold text-stone-800 shadow-sm"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Duration */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 block">Duration (Hours)</label>
                                <input
                                    className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-bold text-stone-800 shadow-sm"
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                                    required
                                />
                            </div>

                            {/* Request Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 block">Plan Type</label>
                                <select
                                    className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-bold text-stone-800 shadow-sm"
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value)}
                                >
                                    <option value="One-time">One-time Session</option>
                                    <option value="Recurring">Recurring / Weekly Plan</option>
                                </select>
                            </div>
                        </div>

                        {/* Location address */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 block">Care Address</label>
                            <input
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-medium text-stone-800 shadow-sm"
                                type="text"
                                placeholder="Enter specific care address"
                                value={careAddress}
                                onChange={(e) => setCareAddress(e.target.value)}
                                required
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 block">Special Notes / Requests</label>
                            <textarea
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#5fa5ba]/50 text-sm font-medium text-stone-800 shadow-sm min-h-[120px] resize-none"
                                placeholder="e.g. Patient prefers soft foods, needs physical therapy guidance..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Estimate & Submit */}
                <ScrollAnimation animation="fade-up">
                    <div className="bg-white border-2 border-stone-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">ESTIMATED TOTAL SERVICE COST</p>
                            <h3 className="text-3xl font-black text-[#5fa5ba]">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </h3>
                            <p className="text-xs text-stone-400 font-medium mt-1">Based on {duration} hours of {selectedService?.name || 'care package'}.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-4 bg-[#5fa5ba] text-white rounded-full font-bold text-sm shadow-xl shadow-[#5fa5ba]/25 hover:bg-[#4d8ca0] hover:-translate-y-0.5 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting request...' : 'Confirm Request'}
                        </button>
                    </div>
                </ScrollAnimation>

            </form>
        </div>
    );
};

export default CreateRequest;
