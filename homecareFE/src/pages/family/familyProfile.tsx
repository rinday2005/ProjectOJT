import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../services/api.service';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Loader2, Save, Camera } from 'lucide-react';

interface ProfileData {
  id: number;
  keycloakId: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  address: string;
  avatar?: string;
}

interface ProfileFormInputs {
  fullName: string;
  phone: string;
  address: string;
  avatar: string;
}

export const FamilyProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // 1. Fetch Profile Data
  const { data: profile, isLoading, isError } = useQuery<ProfileData>({
    queryKey: ['familyProfile'],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/profile');
      return response.data;
    }
  });

  // 2. React Hook Form Setup
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormInputs>({
    values: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      avatar: profile?.avatar || '',
    }
  });

  // Set initial avatar preview when data loads
  useEffect(() => {
    if (profile?.avatar) {
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  // Handle Avatar Click to trigger hidden input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Upload file to backend and update profile avatar
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit size to 2MB
        toast.error('Kích thước ảnh phải nhỏ hơn 2MB');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadToast = toast.loading('Đang tải ảnh đại diện lên...');
      try {
        const response = await api.post('/api/v1/users/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const updatedUser = response.data;
        setAvatarPreview(updatedUser.avatar || '');
        setValue('avatar', updatedUser.avatar || '');
        
        // Refresh familyProfile queries in React Query to update the topbar/sidebar in real-time
        queryClient.invalidateQueries({ queryKey: ['familyProfile'] });
        
        toast.success('Cập nhật ảnh đại diện thành công!', { id: uploadToast });
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Lỗi khi tải ảnh lên. Vui lòng thử lại!';
        toast.error(`Lỗi: ${errorMsg}`, { id: uploadToast });
        console.error(err);
      }
    }
  };


  // 3. Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (inputs: ProfileFormInputs) => {
      const response = await api.put('/api/v1/users/profile', inputs);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Your profile has been updated successfully!');
      // Update cache
      queryClient.setQueryData(['familyProfile'], data);
    }
  });

  const onSubmit = (inputs: ProfileFormInputs) => {
    updateProfileMutation.mutate(inputs);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-40 bg-stone-200 dark:bg-stone-850 rounded-[2rem] mb-8"></div>
        <div className="space-y-6">
          <div className="h-6 bg-stone-200 dark:bg-stone-850 rounded w-1/4"></div>
          <div className="h-10 bg-stone-200 dark:bg-stone-850 rounded w-full"></div>
          <div className="h-10 bg-stone-200 dark:bg-stone-850 rounded w-full"></div>
          <div className="h-10 bg-stone-200 dark:bg-stone-850 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-xl font-bold text-stone-800 dark:text-white">Unable to load profile info</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm">
          An error occurred while connecting to the server. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-manrope">
      {/* Banner / Header Card */}
      <div className="relative bg-gradient-to-r from-[#0d8ca5] to-[#5fa5ba] rounded-[2rem] overflow-hidden p-8 text-white shadow-xl shadow-teal-100/10 mb-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            {/* Avatar Container with Upload on Click */}
            <div 
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-extrabold border border-white/50 cursor-pointer relative overflow-hidden group transition-all duration-300 hover:scale-105"
              title="Click to upload avatar"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0).toUpperCase() || 'U'
              )}
              {/* Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <Camera size={22} className="text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-stone-900 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black">{profile?.fullName || 'User'}</h1>
            <p className="text-white/80 text-xs tracking-wider uppercase mt-1.5 font-bold">Family Manager Profile</p>
            <p className="text-white/70 text-xs font-medium mt-1">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white dark:bg-stone-950 p-8 sm:p-10 rounded-[2.5rem] border border-teal-50/50 dark:border-stone-800 shadow-xl shadow-teal-100/5">
        <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-stone-100 dark:border-stone-850">
          <span className="material-symbols-outlined text-[#0d8ca5] text-xl">manage_accounts</span>
          <h2 className="font-extrabold text-stone-900 dark:text-white text-lg">Account Details</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-450 dark:text-stone-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full Name cannot be empty' })}
                  className={`w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-900/50 border ${
                    errors.fullName ? 'border-red-500 animate-shake' : 'border-stone-100 dark:border-stone-800'
                  } rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0d8ca5]`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-450 dark:text-stone-500">
                  <Phone size={16} />
                </div>
                <input
                  type="text"
                  {...register('phone', {
                    required: 'Phone Number cannot be empty',
                    pattern: {
                      value: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-900/50 border ${
                    errors.phone ? 'border-red-500 animate-shake' : 'border-stone-100 dark:border-stone-800'
                  } rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0d8ca5]`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email (Read only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Email Address (Cannot be changed)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-450 dark:text-stone-500">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-stone-100/50 dark:bg-stone-900/20 border border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 rounded-2xl text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Contact Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-450 dark:text-stone-500">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="e.g., 123 Nguyen Trai Street, District 1, Ho Chi Minh City"
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0d8ca5]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-[#0d8ca5] hover:bg-[#0a7d94] text-white pl-6 pr-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-teal-100/10 hover:shadow-teal-100/20 transition-all flex items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 transition-transform group-hover:scale-115" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamilyProfile;
