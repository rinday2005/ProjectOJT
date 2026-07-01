import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careRequestApi } from '@/lib/api';
import { formatTimeSpan } from '@/lib/utils';
import ScrollAnimation from "@/components/ui/scroll-animation";
import { Clock, Calendar, User, FileText, ChevronLeft, MapPin } from "lucide-react";

const RequestDetail = () => {
    const { id } = useParams();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setLoading(true);
                const data = await careRequestApi.getById(id!);
                setRequest(data);
            } catch (err) {
                console.error("Failed to fetch request:", err);
                setError("Could not load request details. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const getStatusColorClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return "bg-amber-100 text-amber-700 border-amber-200"; // Amber for approved, awaiting payment
            case 'paid':
                return "bg-green-100 text-green-700 border-green-200";
            case 'pending':
                return "bg-amber-100 text-amber-700 border-amber-200";
            case 'rejected':
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const formatDate = (dateStr: any) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="text-center py-20 font-['Public_Sans']">
                <p className="text-stone-500 mb-4">{error || "Request not found"}</p>
                <Link to="/family/requests" className="text-[#5fa5ba] hover:underline font-bold">Return to List</Link>
            </div>
        );
    }

    const requestedDate = request.requestedDate || request.startDate;
    const location = request.location || request.address;
    const startTime = request.startTime ? (request.startTime.length > 5 ? request.startTime.substring(0, 5) : request.startTime) : '09:00';
    const endTime = request.endTime ? (request.endTime.length > 5 ? request.endTime.substring(0, 5) : request.endTime) : '11:00';

    return (
        <div className="max-w-4xl mx-auto pb-12 font-['Public_Sans'] space-y-8 animate-fade-in-up px-6 md:px-12 py-6">
            {/* Header */}
            <div>
                <Link to="/family/requests" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-[#5fa5ba] mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to requests
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Request Details</h1>
                        <p className="text-stone-500 font-medium">Created on {formatDate(request.createdAt)}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${getStatusColorClass(request.status)} border`}>
                        {request.status?.toLowerCase() === 'approved' ? 'Awaiting Payment' : request.status}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Row 1: Column 1 - Details (Spans 7 cols) */}
                <div className="lg:col-span-7">
                    <ScrollAnimation animation="fade-up">
                        <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-8 h-full">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#5fa5ba]" />
                                    Service Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Service Type</p>
                                        <p className="text-lg font-bold text-stone-800">{request.serviceName || 'General Care'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Request Type</p>
                                        <p className="text-lg font-bold text-stone-800">{request.type}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#5fa5ba]" />
                                    Schedule & Time
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Requested Date</p>
                                        <p className="text-lg font-bold text-stone-800">{formatDate(requestedDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Duration</p>
                                        <p className="text-lg font-bold text-stone-800 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-stone-400" />
                                            {formatTimeSpan(startTime)} - {formatTimeSpan(endTime)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {request.notes && (
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4">Additional Notes</h3>
                                    <div className="bg-stone-50 p-6 rounded-2xl text-stone-600 font-medium leading-relaxed">
                                        {request.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Row 1: Column 2 - Patient Info (Spans 5 cols) */}
                <div className="lg:col-span-5">
                    <ScrollAnimation animation="fade-up" delay={0.05}>
                        <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
                                    <User className="w-5 h-5 text-[#5fa5ba]" />
                                    Patient Info
                                </h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-[#E0F2F1] text-[#00695C] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
                                        {request.patientName?.[0] || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-stone-800">{request.patientName}</p>
                                        <p className="text-sm font-medium text-stone-400">Patient ID: {request.patientId}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Care Location</p>
                                <div className="flex items-start gap-3 text-sm font-medium text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    <MapPin className="w-4 h-4 text-stone-400 mt-1 shrink-0" />
                                    <span className="leading-tight">{location || 'Home Address'}</span>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Row 2: Column 3 - Assigned Caregiver & Action Banner (Spans full width - 12 cols) */}
                <div className="lg:col-span-12 mt-4">
                    <ScrollAnimation animation="fade-up" delay={0.1}>
                        <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Assigned Caregiver</h3>
                                {request.assignedCaregiverName ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center font-bold text-[#00695C] shadow-sm">
                                            {request.assignedCaregiverName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-stone-800">{request.assignedCaregiverName}</p>
                                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Professional Caregiver</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 border border-stone-200">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-600">Unassigned</p>
                                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest text-[10px]">Professional Caregiver</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action block or status */}
                            {request.status?.toLowerCase() === 'approved' ? (
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center md:text-left flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                                    <div>
                                        <h4 className="font-black text-amber-800 text-sm">Approved by Admin</h4>
                                        <p className="text-stone-500 text-xs mt-1">Please complete payment to lock in the schedule.</p>
                                    </div>
                                    <Link
                                        to={`/family/payment/${request.id}?type=request`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all uppercase tracking-wider whitespace-nowrap"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">payment</span>
                                        Pay Now
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${getStatusColorClass(request.status)} border`}>
                                        {request.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </div>
    );
};

export default RequestDetail;
