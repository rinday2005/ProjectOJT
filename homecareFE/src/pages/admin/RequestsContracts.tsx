import React, { useState, useEffect } from 'react';
import { careRequestApi, contractApi, adminApi } from '../../lib/api';
import { formatTimeSpan } from '@/lib/utils';
import ScrollAnimation from "@/components/ui/scroll-animation";
import { toast } from 'react-hot-toast';
import api from '../../services/api.service';

const RequestsContracts = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [contracts, setContracts] = useState<any[]>([]);
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'requests' | 'contracts'>('requests');

    // Caregiver Assignment state
    const [assigningReqId, setAssigningReqId] = useState<number | null>(null);
    const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');
    const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<any>(null);

    // Contract Viewer Modal
    const [viewingContract, setViewingContract] = useState<any>(null);
    const [contractHtml, setContractHtml] = useState<string>('');
    const [loadingHtml, setLoadingHtml] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [requestsRes, contractsRes, caregiversRes] = await Promise.all([
                careRequestApi.getAll(),
                contractApi.getAll(),
                adminApi.getCaregivers()
            ]);
            setRequests(requestsRes || []);
            setContracts(contractsRes || []);
            setCaregivers(caregiversRes || []);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColorClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'paid':
                return "bg-green-100 text-green-700 border-green-200 border";
            case 'pending':
            case 'awaitingpayment':
                return "bg-amber-100 text-amber-700 border-amber-200 border";
            case 'rejected':
                return "bg-red-100 text-red-700 border-red-200 border";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200 border";
        }
    };

    const handleApproveRequest = async (id: number) => {
        try {
            await careRequestApi.updateStatus(id, 'Approved');
            toast.success("Request approved and contract generated!");
            fetchData();
        } catch (error: any) {
            console.error("Failed to approve request", error);
            toast.error(error.message || "Failed to approve request");
        }
    };

    const handleRejectRequest = async (id: number) => {
        try {
            await careRequestApi.updateStatus(id, 'Rejected');
            toast.success("Request rejected.");
            fetchData();
        } catch (error: any) {
            console.error("Failed to reject request", error);
            toast.error(error.message || "Failed to reject request");
        }
    };

    const handleSelectCaregiver = async (cgId: string, req: any) => {
        setSelectedCaregiverId(cgId);
        if (!cgId) {
            setAvailabilityStatus(null);
            return;
        }

        setIsAvailabilityLoading(true);
        try {
            const date = req.requestedDate || req.startDate;
            const startTime = req.startTime ? (req.startTime.length > 5 ? req.startTime.substring(0, 5) : req.startTime) : '09:00';
            const endTime = req.endTime ? (req.endTime.length > 5 ? req.endTime.substring(0, 5) : req.endTime) : '11:00';
            
            const check = await careRequestApi.checkAvailability(cgId, date, startTime, endTime);
            setAvailabilityStatus(check);
            if (!check.available) {
                toast.error(`Caregiver Conflict: ${check.conflictReason}`);
            } else {
                toast.success("Caregiver is available!");
            }
        } catch (error) {
            console.error("Failed to check caregiver availability", error);
            toast.error("Could not run availability check");
        } finally {
            setIsAvailabilityLoading(false);
        }
    };

    const handleConfirmAssign = async (reqId: number) => {
        if (!selectedCaregiverId) {
            toast.error("Please select a caregiver first");
            return;
        }

        if (availabilityStatus && !availabilityStatus.available) {
            toast.error("Cannot assign caregiver: Time conflict exists!");
            return;
        }

        try {
            await careRequestApi.assignCaregiver(reqId, selectedCaregiverId);
            toast.success("Caregiver assigned successfully! Request approved.");
            setAssigningReqId(null);
            setSelectedCaregiverId('');
            setAvailabilityStatus(null);
            fetchData();
        } catch (error: any) {
            console.error("Failed to assign caregiver", error);
            toast.error(error.message || "Failed to assign caregiver");
        }
    };

    const handleApproveContract = async (contractId: number) => {
        try {
            await contractApi.approve(contractId);
            toast.success("Contract counter-signed and approved!");
            fetchData();
        } catch (error: any) {
            console.error("Failed to approve contract", error);
            toast.error(error.message || "Failed to approve contract");
        }
    };

    const handleViewContract = async (contract: any) => {
        setViewingContract(contract);
        setLoadingHtml(true);
        try {
            const response = await api.get(`/api/v1/bookings/contracts/${contract.careRequestId}/html`);
            setContractHtml(response.data);
        } catch (error) {
            console.error('Failed to fetch contract html', error);
            toast.error('Failed to load contract content');
        } finally {
            setLoadingHtml(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#0d8ca5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-manrope">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Requests & Contracts Management</h1>
                <p className="text-stone-500 font-medium text-sm mt-1">Verify care booking requests, perform caregiver conflict checks, and approve legal contracts.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-6">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-4 text-base font-bold border-b-4 transition-all ${activeTab === 'requests' ? 'border-[#0d8ca5] text-[#0d8ca5]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                >
                    Care Requests ({requests.length})
                </button>
                <button
                    onClick={() => setActiveTab('contracts')}
                    className={`pb-4 text-base font-bold border-b-4 transition-all ${activeTab === 'contracts' ? 'border-[#0d8ca5] text-[#0d8ca5]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                >
                    Service Contracts ({contracts.length})
                </button>
            </div>

            {/* Care Requests Management Tab */}
            {activeTab === 'requests' && (
                <div className="bg-white rounded-[2rem] border border-stone-150 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-150 text-xs font-bold text-stone-500 uppercase tracking-wider">
                                <th className="p-6">ID</th>
                                <th className="p-6">Patient</th>
                                <th className="p-6">Service Package</th>
                                <th className="p-6">Schedule Details</th>
                                <th className="p-6">Caregiver</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm font-semibold text-stone-700">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-stone-400 font-medium">No care requests found.</td>
                                </tr>
                            ) : requests.map((req) => {
                                const reqDate = req.requestedDate || req.startDate;
                                const reqStartTime = req.startTime ? (req.startTime.length > 5 ? req.startTime.substring(0, 5) : req.startTime) : '09:00';
                                const reqEndTime = req.endTime ? (req.endTime.length > 5 ? req.endTime.substring(0, 5) : req.endTime) : '11:00';

                                return (
                                    <tr key={req.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="p-6">#{req.id}</td>
                                        <td className="p-6">
                                            <p className="text-stone-900 font-bold">{req.patientName}</p>
                                            <p className="text-xs text-stone-400 font-medium">ID: {req.patientId}</p>
                                        </td>
                                        <td className="p-6">{req.serviceName}</td>
                                        <td className="p-6">
                                            <p>{new Date(reqDate).toLocaleDateString('vi-VN')}</p>
                                            <p className="text-xs text-stone-400 font-medium">{formatTimeSpan(reqStartTime)} - {formatTimeSpan(reqEndTime)}</p>
                                        </td>
                                        <td className="p-6">
                                            {assigningReqId === req.id ? (
                                                <div className="space-y-2 max-w-[200px]">
                                                    <select
                                                        value={selectedCaregiverId}
                                                        onChange={(e) => handleSelectCaregiver(e.target.value, req)}
                                                        className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-2"
                                                    >
                                                        <option value="">Select Caregiver</option>
                                                        {caregivers.map(cg => (
                                                            <option key={cg.id} value={cg.id}>{cg.fullName || `Caregiver #${cg.id}`}</option>
                                                        ))}
                                                    </select>
                                                    {isAvailabilityLoading && <p className="text-[10px] text-[#0d8ca5] font-bold">Checking availability...</p>}
                                                    {availabilityStatus && (
                                                        <p className={`text-[10px] font-bold ${availabilityStatus.available ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {availabilityStatus.available ? '✓ Available' : '✗ Busy overlapping ca'}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>{req.assignedCaregiverName || 'Unassigned'}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${getStatusColorClass(req.status)} uppercase tracking-wider`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right space-x-2">
                                            {assigningReqId === req.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleConfirmAssign(req.id)}
                                                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs hover:bg-emerald-600 transition-all font-bold"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAssigningReqId(null);
                                                            setSelectedCaregiverId('');
                                                            setAvailabilityStatus(null);
                                                        }}
                                                        className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs hover:bg-stone-200 transition-all font-bold"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {req.status?.toLowerCase() === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => setAssigningReqId(req.id)}
                                                                className="px-4 py-2 bg-[#0d8ca5] text-white rounded-xl text-xs hover:bg-[#0a7d94] transition-all font-bold"
                                                            >
                                                                Assign & Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(req.id)}
                                                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs hover:bg-red-100 transition-all font-bold"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Contracts Management Tab */}
            {activeTab === 'contracts' && (
                <div className="bg-white rounded-[2rem] border border-stone-150 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-150 text-xs font-bold text-stone-500 uppercase tracking-wider">
                                <th className="p-6">Contract ID</th>
                                <th className="p-6">Patient</th>
                                <th className="p-6">Service Package</th>
                                <th className="p-6">Total Price</th>
                                <th className="p-6">Signed At</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm font-semibold text-stone-700">
                            {contracts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-stone-400 font-medium">No contracts found.</td>
                                </tr>
                            ) : contracts.map((c) => (
                                <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="p-6">#{c.id}</td>
                                    <td className="p-6 font-bold">{c.patientName}</td>
                                    <td className="p-6">{c.serviceName}</td>
                                    <td className="p-6 font-bold text-emerald-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.totalPrice)}
                                    </td>
                                    <td className="p-6 text-xs text-stone-400">
                                        {c.signedAt ? new Date(c.signedAt).toLocaleString('vi-VN') : 'Unsigned'}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${getStatusColorClass(c.status)} uppercase tracking-wider`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        {c.status === 'SIGNED' && (
                                            <button
                                                onClick={() => handleApproveContract(c.id)}
                                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs hover:bg-emerald-600 transition-all font-bold"
                                            >
                                                Counter-Sign & Approve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewContract(c)}
                                            className="px-4 py-2 bg-stone-100 text-[#0d8ca5] rounded-xl text-xs hover:bg-stone-250 hover:bg-stone-100/80 transition-all font-bold border border-stone-200"
                                        >
                                            View contract
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Printable Contract Viewer Modal */}
            {viewingContract && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative animate-scale-up">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <div>
                                <h3 className="font-extrabold text-xl text-stone-900">Contract Agreement Viewer</h3>
                                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Contract ID: {viewingContract.id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        const printWindow = window.open('', '_blank');
                                        if (printWindow) {
                                            printWindow.document.write(contractHtml);
                                            printWindow.document.close();
                                            printWindow.print();
                                        }
                                    }}
                                    className="px-4 py-2 bg-stone-800 text-white rounded-xl font-bold text-xs hover:bg-stone-900 transition-all flex items-center gap-1.5 shadow"
                                >
                                    <span className="material-symbols-outlined text-sm">print</span>
                                    Print / Save PDF
                                </button>
                                <button
                                    onClick={() => setViewingContract(null)}
                                    className="p-2 bg-white rounded-full hover:bg-stone-100 transition-all border border-stone-200 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-stone-600 block">close</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-stone-50">
                            {loadingHtml ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-[#0d8ca5] border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-stone-500 font-semibold">Generating contract view...</p>
                                </div>
                            ) : (
                                <div 
                                    className="bg-white p-12 rounded-[2rem] border border-stone-200 shadow-md max-w-[800px] mx-auto min-h-[500px]"
                                    dangerouslySetInnerHTML={{ __html: contractHtml }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestsContracts;
