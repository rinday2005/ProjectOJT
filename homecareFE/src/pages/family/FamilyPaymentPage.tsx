import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { careRequestApi } from '@/lib/api';
import { formatTimeSpan } from '@/lib/utils';
import ScrollAnimation from "@/components/ui/scroll-animation";
import { toast } from 'react-hot-toast';

const FamilyPaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setLoading(true);
                const data = await careRequestApi.getById(id!);
                setRequest(data);
            } catch (error) {
                console.error("Failed to load care request details", error);
                toast.error("Failed to load details for payment");
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const handleConfirmPayment = async () => {
        try {
            setPaying(true);
            // Simulate API request delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Update request status to 'Paid' (or 'Approved' depending on backend flow; let's call updateStatus with 'Paid')
            await careRequestApi.updateStatus(id!, 'Paid');
            toast.success("Payment completed successfully!");
            navigate('/family/requests');
        } catch (error: any) {
            console.error("Failed to complete payment", error);
            toast.error(error.message || "Failed to process payment");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#5fa5ba] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-stone-500 font-medium">Preparing invoice...</p>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-20 font-['Public_Sans']">
                <p className="text-stone-500 mb-4">Invoice not found or invalid care request.</p>
                <Link to="/family/requests" className="text-[#5fa5ba] hover:underline font-bold">Return to requests</Link>
            </div>
        );
    }

    const requestedDate = request.requestedDate || request.startDate;
    const startTime = request.startTime ? (request.startTime.length > 5 ? request.startTime.substring(0, 5) : request.startTime) : '09:00';
    const endTime = request.endTime ? (request.endTime.length > 5 ? request.endTime.substring(0, 5) : request.endTime) : '11:00';

    return (
        <div className="max-w-4xl mx-auto pb-24 font-['Public_Sans'] px-6 md:px-12 py-6 space-y-8 animate-fade-in-up">
            <div>
                <Link to="/family/requests" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-[#5fa5ba] mb-4 transition-colors">
                    <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
                    Back to requests
                </Link>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight">Invoice Payment</h1>
                <p className="text-stone-500 font-medium mt-1">Complete payment to finalize care scheduling for request #{request.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: payment detail */}
                <div className="lg:col-span-2 space-y-6">
                    <ScrollAnimation animation="fade-up">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#5fa5ba]">receipt</span>
                                    Billing Summary
                                </h3>
                                <table className="w-full text-sm text-stone-600 font-medium">
                                    <tbody>
                                        <tr className="border-b border-stone-50"><td className="py-3 font-bold text-stone-400 uppercase text-[10px]">Service Package</td><td className="py-3 text-right text-stone-850 font-bold">{request.serviceName}</td></tr>
                                        <tr className="border-b border-stone-50"><td className="py-3 font-bold text-stone-400 uppercase text-[10px]">Patient Name</td><td className="py-3 text-right text-stone-850 font-bold">{request.patientName}</td></tr>
                                        <tr className="border-b border-stone-50"><td className="py-3 font-bold text-stone-400 uppercase text-[10px]">Work Date</td><td className="py-3 text-right text-stone-850 font-bold">{new Date(requestedDate).toLocaleDateString('vi-VN')}</td></tr>
                                        <tr className="border-b border-stone-50"><td className="py-3 font-bold text-stone-400 uppercase text-[10px]">Time Slot</td><td className="py-3 text-right text-stone-850 font-bold">{formatTimeSpan(startTime)} - {formatTimeSpan(endTime)}</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#5fa5ba]">payment</span>
                                    Payment Method
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all border-[#5fa5ba] bg-[#E0F2F1]/30">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={() => setPaymentMethod('credit_card')}
                                            className="text-[#5fa5ba] focus:ring-[#5fa5ba]"
                                        />
                                        <div>
                                            <p className="font-bold text-stone-800">Credit Card / Debit Card</p>
                                            <p className="text-xs text-stone-400">Visa, Mastercard, JCB</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all border-stone-100 hover:border-[#B2EBF2]">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={() => setPaymentMethod('bank_transfer')}
                                            className="text-[#5fa5ba] focus:ring-[#5fa5ba]"
                                        />
                                        <div>
                                            <p className="font-bold text-stone-800">Bank Transfer / QR Code</p>
                                            <p className="text-xs text-stone-400">Domestic banks QR pay</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Right side: Summary & Pay action */}
                <div className="space-y-6">
                    <ScrollAnimation animation="slide-left">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Payment Summary</h3>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-stone-400">Subtotal</span>
                                <span className="text-stone-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(request.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-stone-400">Service Fee</span>
                                <span className="text-stone-700">0đ</span>
                            </div>
                            <div className="border-t border-stone-100 pt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">TOTAL AMOUNT</p>
                                    <p className="text-3xl font-black text-[#5fa5ba]">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(request.totalPrice)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmPayment}
                                disabled={paying}
                                className="w-full bg-[#5fa5ba] hover:bg-[#4d8ca0] text-white font-bold py-4 rounded-full shadow-xl shadow-[#5fa5ba]/25 hover:-translate-y-0.5 transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                <span>{paying ? 'Processing payment...' : 'Pay Simulated Cost'}</span>
                                {!paying && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </div>
    );
};

export default FamilyPaymentPage;
