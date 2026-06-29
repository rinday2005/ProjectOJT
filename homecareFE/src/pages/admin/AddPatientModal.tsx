import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LocationPickerMap from '@/components/LocationPickerMap';

interface FamilyUser {
    id: number;
    fullName?: string;
    email: string;
    role: string;
}

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPatientAdded: () => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onPatientAdded }) => {
    const [submitting, setSubmitting] = useState(false);
    const [families, setFamilies] = useState<FamilyUser[]>([]);
    const [loadingFamilies, setLoadingFamilies] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        medicalHistory: '',
        relation: 'Patient',
        address: '',
        latitude: 10.762622,
        longitude: 106.660172,
        status: 'ACTIVE',
        currentCondition: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchFamilies();
        }
    }, [isOpen]);

    const fetchFamilies = async () => {
        try {
            setLoadingFamilies(true);
            const users = await adminApi.getUsers();
            const filtered = users.filter((u: any) => u.role?.toUpperCase() === 'FAMILY');
            setFamilies(filtered);
        } catch (err) {
            console.error('Error fetching families:', err);
            toast.error("Failed to load family accounts");
        } finally {
            setLoadingFamilies(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFamilyId) {
            toast.error("Please select a Family Account owner.");
            return;
        }
        if (!formData.fullName.trim() || !formData.dateOfBirth || !formData.address.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                name: formData.fullName,
                dob: formData.dateOfBirth,
                medicalConditions: formData.medicalHistory,
                familyId: parseInt(selectedFamilyId)
            };

            // To create patient associated with a familyId, we can post to admin API.
            // Wait, we need to pass a jwt token of admin, and specify the owner. 
            // In the backend PatientServiceImpl:
            // "if ('FAMILY'.equalsIgnoreCase(user.getRole())) { ... }
            // else if ('OPERATOR' or 'ADMIN') { ... }"
            // Wait! In PatientServiceImpl:
            // "if (!'FAMILY'.equalsIgnoreCase(user.getRole())) {
            //     throw new AccessDeniedException('Chỉ tài khoản Gia đình (FAMILY) mới được phép tạo hồ sơ bệnh nhân!');
            // }"
            // Oh! Let's check: can an Admin/Operator create a patient profile?
            // In `PatientServiceImpl`, we threw AccessDeniedException if the requester was NOT Family!
            // Wait! Let's make sure our backend service allows Admins and Operators to create patients as well if they specify `familyId` in the request body!
            // That's a crucial detail! Let's check `PatientServiceImpl` line 27:
            // "if (!'FAMILY'.equalsIgnoreCase(user.getRole())) {
            //     throw new AccessDeniedException('Chỉ tài khoản Gia đình (FAMILY) mới được phép tạo hồ sơ bệnh nhân!');
            // }"
            // If the admin needs to add a new patient, we must allow `ADMIN` or `OPERATOR` to create a patient profile as long as a valid `familyId` is provided in the request body!
            // Let's modify `PatientServiceImpl.java` to support this! 
            // Yes, let's allow Admin/Operator to pass `familyId` in request and assign the patient to that family user, while Family gets their family ID automatically from security context.
            // Let's see: this is a great improvement! We will modify the backend implementation of `createPatient` in a subsequent step.

            await adminApi.createPatient(payload);
            toast.success("Patient registered successfully!");
            setSelectedFamilyId('');
            setFormData({
                fullName: '',
                dateOfBirth: '',
                gender: 'Male',
                medicalHistory: '',
                relation: 'Patient',
                address: '',
                latitude: 10.762622,
                longitude: 106.660172,
                status: 'ACTIVE',
                currentCondition: ''
            });
            onPatientAdded();
        } catch (err: any) {
            console.error('Error adding patient profile:', err);
            toast.error(err.response?.data?.message || err.message || "Failed to create patient profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="max-w-md">
            <DialogContent className="max-w-md bg-white rounded-[2rem] border-stone-100 p-8 font-['Public_Sans']">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-stone-900 tracking-tight">Add New Patient</DialogTitle>
                    <DialogDescription className="text-stone-400 text-xs">
                        Create a patient record and assign it to a Family account.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Family Account Owner *</label>
                        <Select
                            value={selectedFamilyId}
                            onValueChange={setSelectedFamilyId}
                        >
                            <SelectTrigger className="rounded-xl border-stone-200 bg-white">
                                <SelectValue placeholder={loadingFamilies ? "Loading families..." : "Select Family Account"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-stone-100 rounded-xl max-h-[200px]">
                                {families.map(fam => (
                                    <SelectItem key={fam.id} value={fam.id.toString()}>
                                        {fam.fullName || fam.email} ({fam.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Full Name *</label>
                        <Input
                            name="fullName"
                            placeholder="Full name of patient"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="rounded-xl border-stone-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Date of Birth *</label>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                                className="rounded-xl border-stone-200"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Gender</label>
                            <Select
                                value={formData.gender}
                                onValueChange={(val) => handleSelectChange('gender', val)}
                            >
                                <SelectTrigger className="rounded-xl border-stone-200 bg-white">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-stone-100 rounded-xl">
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Relation</label>
                            <Input
                                name="relation"
                                placeholder="Relation to family owner"
                                value={formData.relation}
                                onChange={handleInputChange}
                                className="rounded-xl border-stone-200"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Patient Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => handleSelectChange('status', val)}
                            >
                                <SelectTrigger className="rounded-xl border-stone-200 bg-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-stone-100 rounded-xl">
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="ON HOLD">On Hold</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Current Health Condition (e.g. Critical, Monitor)</label>
                        <Input
                            name="currentCondition"
                            placeholder="e.g. Monitor, Stable, Urgent Care"
                            value={formData.currentCondition}
                            onChange={handleInputChange}
                            className="rounded-xl border-stone-200"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Care Address *</label>
                        <Input
                            name="address"
                            placeholder="Patient's home address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="rounded-xl border-stone-200"
                        />
                        <div className="mt-2">
                            <LocationPickerMap
                                latitude={formData.latitude}
                                longitude={formData.longitude}
                                address={formData.address}
                                onChange={(lat, lon, addr) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lon,
                                        address: addr
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Medical Notes & History</label>
                        <textarea
                            name="medicalHistory"
                            placeholder="Allergies, chronic conditions..."
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full text-sm rounded-xl border border-stone-200 p-3 outline-none focus:border-[#99C5D3] resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl font-bold text-xs"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-md px-6"
                            disabled={submitting}
                        >
                            {submitting ? 'Registering...' : 'Register Patient'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPatientModal;
