import React, { useState, useEffect } from 'react';
import { X, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditCaregiverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    caregiver: any;
}

const EditCaregiverModal: React.FC<EditCaregiverModalProps> = ({ isOpen, onClose, onSuccess, caregiver }) => {
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState('');
    const [status, setStatus] = useState('Offline');

    useEffect(() => {
        if (caregiver) {
            setSkills(caregiver.skills || '');
            setStatus(caregiver.status || 'Offline');
        }
    }, [caregiver, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminApi.updateCaregiverSkillsAndAvailability(caregiver.id, skills, status);
            toast.success("Cập nhật thông tin kỹ năng & trạng thái thành công!");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error("Lỗi cập nhật: " + (error.message || "Không xác định"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="max-w-md">
            <DialogContent className="p-6 bg-white dark:bg-[#1a282b]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Edit className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Cập nhật Vận hành</DialogTitle>
                            <p className="text-xs text-muted-foreground">Cập nhật thông tin kỹ năng và trạng thái cho {caregiver?.fullName}</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Họ và tên</label>
                        <Input value={caregiver?.fullName || ''} disabled className="bg-stone-50 dark:bg-stone-800" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={caregiver?.email || ''} disabled className="bg-stone-50 dark:bg-stone-800" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng thái hoạt động</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="Online">Online (Sẵn sàng nhận việc)</option>
                            <option value="On-Duty">On-Duty (Đang bận làm việc)</option>
                            <option value="Offline">Offline (Ngoại tuyến)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kỹ năng chuyên môn (cách nhau bằng dấu phẩy)</label>
                        <textarea
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="Ví dụ: Physical Therapy, Elderly Care, Wound Care"
                            className="w-full min-h-[80px] p-3 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCaregiverModal;
