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
import { familyApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LocationPickerMap from '@/components/LocationPickerMap';

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

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
    onPatientUpdated: () => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({ isOpen, onClose, patient, onPatientUpdated }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        medicalHistory: '',
        relation: 'Patient',
        address: '',
        latitude: 10.762622,
        longitude: 106.660172
    });

    useEffect(() => {
        if (patient) {
            // Format date string to YYYY-MM-DD for date input
            let formattedDob = '';
            const rawDob = patient.dateOfBirth || patient.dob;
            if (rawDob) {
                try {
                    formattedDob = new Date(rawDob).toISOString().split('T')[0];
                } catch {
                    formattedDob = rawDob;
                }
            }

            setFormData({
                fullName: patient.fullName || '',
                dateOfBirth: formattedDob,
                gender: patient.gender || 'Male',
                medicalHistory: patient.medicalHistory || '',
                relation: patient.relation || 'Patient',
                address: patient.address || '',
                latitude: patient.latitude || 10.762622,
                longitude: patient.longitude || 106.660172
            });
        }
    }, [patient, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patient) return;
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
                medicalConditions: formData.medicalHistory
            };
            await familyApi.updatePatient(patient.id, payload);
            toast.success("Patient profile updated successfully!");
            onPatientUpdated();
        } catch (err: any) {
            console.error('Error updating patient profile:', err);
            toast.error(err.response?.data?.message || err.message || "Failed to update patient profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="max-w-md">
            <DialogContent className="max-w-md bg-white rounded-[2rem] border-stone-100 p-8 font-['Public_Sans']">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-stone-900 tracking-tight">Edit Profile</DialogTitle>
                    <DialogDescription className="text-stone-400 text-xs">
                        Update the profile details of your family member.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Relation (e.g. Father, Mother)</label>
                        <Input
                            name="relation"
                            placeholder="e.g. Mother, Grandfather, Child"
                            value={formData.relation}
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
                            placeholder="Allergies, chronic illness, current medications..."
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            rows={3}
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
                            className="rounded-xl bg-[#5fa5ba] hover:bg-[#488e9f] text-white font-bold text-xs shadow-md px-6"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPatientModal;
