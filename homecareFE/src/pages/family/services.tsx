import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '@/lib/api';
import ScrollAnimation from "@/components/ui/scroll-animation";

export const SERVICES = [
    // Daily Care
    {
        id: 's1',
        name: 'Elderly Daily Care',
        category: 'Daily Care',
        price: 35,
        unit: 'hr',
        features: ['Meal preparation & feeding', 'Personal hygiene assistance', 'Mobility and light exercise'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGy5cMNWCr7Ku-nyCsQrrnDOJXIlLFVsjToWDuzNpyw_mfL3L8Vz8yceFCdmqGG5W2J4FqtXZ6BUenAN5o-S7qxIXeUSwacB0aGN_W0wAfFp5cCf-0Iyqbk3EMzkzOBlyWjXD3SOO90iZr9GZhSKKT4FAZGqf8xPhHIONUfIa1AwenY6dsR26ouo5Ia6nj57D4mv1nzLqpXhWbp4bCqqrTTUaENrCfqmzWBaKK_t9FvYz6lf150zJhF6DrTSjH8qSiugqA3A2Vk0lJ',
        recommended: true
    },
    {
        id: 's4',
        name: 'Overnight Monitoring',
        category: 'Daily Care',
        price: 40,
        unit: 'night',
        features: ['Sleep monitoring', 'Emergency assistance', 'Nighttime toileting help'],
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's5',
        name: 'Mobility Assistance',
        category: 'Daily Care',
        price: 30,
        unit: 'hr',
        features: ['Walking support', 'Transfer assistance', 'Fall prevention'],
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=300&auto=format&fit=crop',
    },

    // Specialized Medical
    {
        id: 's2',
        name: 'Post-Surgical Support',
        category: 'Specialized Medical',
        price: 45,
        unit: 'hr',
        features: ['Wound dressing & cleaning', 'Medication management', 'Vital signs logging'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7bXbLMUTbBrJPT3TPyLZgdbTp8yb17tWtK8hy4wXcli3WoFzpZb8L9_tKIBhWZzaIxgKAIhmOSUdOCtZ-65bmtHclET6xCqK4qfUvMlBaN4fwPKP7uqo3euf36MuXu7auEcBW-Dg5x7C-1Q11nqb72g1OcvXhjy4J5zMuJ0MwZbF-MpIYUSHCUQiY3FyKNBdd9ZgvFlZFx9Aa4ZBEoRoUX0AFuJo9MuQd1M4JiQE8zw2jeFR8v9W-FtBxtVNpTomXiemhIg5IBnFk'
    },
    {
        id: 's6',
        name: 'Physical Therapy',
        category: 'Specialized Medical',
        price: 60,
        unit: 'session',
        features: ['Rehabilitation exercises', 'Pain management', 'Strength training'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop',
        recommended: true
    },
    {
        id: 's7',
        name: 'Dementia Care',
        category: 'Specialized Medical',
        price: 50,
        unit: 'hr',
        features: ['Memory care activities', 'Behavioral support', 'Safe environment maintenance'],
        image: 'https://images.unsplash.com/photo-1581578731522-aa7c04ae596d?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's10',
        name: 'Nursing Care',
        category: 'Specialized Medical',
        price: 55,
        unit: 'hr',
        features: ['Injections & IV', 'Catheter care', 'Health monitoring'],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's11',
        name: 'Palliative Care',
        category: 'Specialized Medical',
        price: 65,
        unit: 'hr',
        features: ['Pain relief', 'Emotional support', 'Family guidance'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300&auto=format&fit=crop',
    },

    // Companionship
    {
        id: 's3',
        name: 'Social Companionship',
        category: 'Companionship',
        price: 25,
        unit: 'hr',
        features: ['Social visits & reading', 'Errands and grocery runs', 'Leisure activities & games'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm1FlCSZENYhexKeOXS569RhrClNnoXRvdcsbiIrkN_y2NXFV5X8qdPy1cqtHPGcB51EcgL2ZnWCBTQ2K6ohkP8yPKCyN9RcNqXU9oqJ-W5wwC459dxKwywaM1OoAGCq3S8XAe1tZedRj693GMMiZlr7OLjt8iEP_z5L5NEqPeoSpNmHDFBbvjMqa5lUOpk0KT5dTodrEOfgbPGG-EWycnPeOgx419GV_bOnDAuBrWjF5kI3tHfXpqnTKNqim27IQpBZjJvOj2YOIE'
    },
    {
        id: 's8',
        name: 'Medical Escort',
        category: 'Companionship',
        price: 30,
        unit: 'trip',
        features: ['Transport to appointments', 'Note-taking during visits', 'Pharmacy pickup'],
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's9',
        name: 'Leisure Outings',
        category: 'Companionship',
        price: 28,
        unit: 'hr',
        features: ['Park visits', 'Cultural events', 'Assisted shopping'],
        image: 'https://images.unsplash.com/photo-1463947628408-f8581a2f4aca?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's12',
        name: 'Technology Assistance',
        category: 'Companionship',
        price: 20,
        unit: 'hr',
        features: ['Video calls help', 'Device setup', 'Digital literacy'],
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's13',
        name: 'Pet Care Support',
        category: 'Companionship',
        price: 22,
        unit: 'hr',
        features: ['Pet feeding', 'Dog walking', 'Vet visits'],
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=300&auto=format&fit=crop',
    },
    {
        id: 's14',
        name: 'Reading & Hobbies',
        category: 'Companionship',
        price: 24,
        unit: 'hr',
        features: ['Book reading', 'Knitting/Crafts', 'Gardening help'],
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=300&auto=format&fit=crop',
    }
];

const categories = ['Daily Care', 'Specialized Medical', 'Companionship'];

const BookingService = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Daily Care');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await serviceApi.getAll();
                // Map API response or merge with custom SERVICES data to ensure complete content catalog
                const apiServices = data && data.length > 0 ? data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    category: s.category || (s.type === 'Specialized' ? 'Specialized Medical' : 'Daily Care'),
                    price: s.basePrice || s.pricePerHour || s.price || 150000,
                    unit: '/ giờ',
                    features: s.features || (s.description ? [s.description] : []),
                    image: s.image || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400',
                    skillLevel: s.skillLevel || (s.basePrice > 400000 ? 'Expert' : s.basePrice > 200000 ? 'Intermediate' : 'Basic'),
                    durationAllowed: s.durationAllowed || (s.type === 'Specialized' ? '4h / 12h' : '2h / 4h'),
                    recommended: s.recommended || false
                })) : [];

                const mappedMockServices = SERVICES.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    price: s.price < 1000 ? s.price * 10000 : s.price,
                    unit: s.unit === 'hr' ? '/ giờ' : s.unit === 'night' ? '/ đêm' : s.unit === 'trip' ? '/ chuyến' : '/ buổi',
                    features: s.features,
                    image: s.image,
                    skillLevel: s.price > 50 ? 'Expert' : s.price > 30 ? 'Intermediate' : 'Basic',
                    durationAllowed: s.category === 'Specialized Medical' ? '4h / 12h' : '2h / 4h',
                    recommended: s.recommended || false
                }));

                // Combine keeping API services first, then appending unique mock services
                const combined = [...apiServices];
                mappedMockServices.forEach(mockS => {
                    if (!combined.some(apiS => apiS.name.toLowerCase() === mockS.name.toLowerCase())) {
                        combined.push(mockS);
                    }
                });

                setServices(combined);
            } catch (err: any) {
                console.error('Failed to fetch services:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleShortTerm = (service: any) => {
        navigate(`/family/requests/create?service_id=${service.id}`);
    };

    const handleLongTerm = (service: any) => {
        navigate(`/family/contracts/create?service_id=${service.id}`);
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse pb-12 pt-4 font-['Public_Sans'] px-6 md:px-12">
                <div className="bg-stone-200 rounded-2xl h-24"></div>
                <div className="bg-stone-200 rounded-[2rem] h-[400px]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error</span>
                <p className="text-red-600 font-medium">Failed to load services</p>
                <p className="text-stone-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="font-['Public_Sans'] space-y-8 pb-12 pt-4 bg-transparent animate-fade-in-up px-6 md:px-12">

            {/* 1. Header & Search - Clean Split */}
            <div className="flex flex-col xl:flex-row justify-between items-end gap-6 px-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#5fa5ba] text-2xl">medical_services</span>
                        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Service Marketplace</h1>
                    </div>
                    <p className="text-stone-500 font-medium max-w-lg">Browse and book professional care services for your family members.</p>
                </div>

                {/* Search Bar */}
                <div className="w-full xl:w-auto min-w-[300px] 2xl:min-w-[400px]">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#5fa5ba] transition-colors">search</span>
                        <input
                            className="w-full bg-white border border-stone-200 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#99C5D3] focus:border-transparent outline-none text-stone-800 placeholder:text-stone-400 transition-all shadow-sm"
                            placeholder="Find a service..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Main Content Surface */}
            <ScrollAnimation animation="fade-up">
                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm relative min-h-[600px] flex flex-col md:flex-row items-start">

                    {/* Left Sidebar: Categories */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-100 bg-stone-50/50 p-6 flex flex-col gap-2 md:sticky md:top-24 rounded-t-[2rem] md:rounded-tr-none md:rounded-l-[2rem]">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Categories</h3>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === cat ? 'bg-[#5fa5ba] text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {cat === 'Daily Care' ? 'wb_sunny' : cat === 'Specialized Medical' ? 'stethoscope' : 'diversity_1'}
                                </span>
                                {cat}
                            </button>
                        ))}

                        <div className="mt-8 p-4 bg-[#E0F2F1] rounded-2xl border border-[#B2EBF2] hidden md:block">
                            <div className="flex items-center gap-2 mb-2 text-[#00695C]">
                                <span className="material-symbols-outlined">verified_user</span>
                                <span className="font-bold text-xs uppercase tracking-wide">Guarantee</span>
                            </div>
                            <p className="text-[11px] text-[#004D40] leading-relaxed font-medium">
                                All our caregivers are certified and background-checked for your peace of mind.
                            </p>
                        </div>
                    </div>

                    {/* Right Content: Services List */}
                    <div className="flex-1 p-0 w-full">
                        {/* List Header */}
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-stone-900">{activeTab} Services</h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                                <span>Sort by:</span>
                                <button className="flex items-center gap-1 text-stone-600 hover:text-[#5fa5ba]">
                                    Recommended <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {services
                                .filter(service => service.category === activeTab)
                                .filter(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((service, index) => (
                                    <div key={service.id} className="py-4 px-6 md:px-8 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-stone-50 transition-colors group relative">
                                        {/* Thumbnail - Compact */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-stone-200 shrink-0 overflow-hidden relative shadow-inner">
                                            <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            {service.recommended && (
                                                <div className="absolute top-0 right-0 bg-[#5fa5ba] w-6 h-6 flex items-center justify-center rounded-bl-xl">
                                                    <span className="material-symbols-outlined text-white text-[14px]">star</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#5fa5ba] transition-colors">{service.name}</h3>
                                                    <div className="flex flex-col gap-1 mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-stone-400 font-medium whitespace-nowrap">Skill Level:</span>
                                                            <span className="text-sm text-stone-550 font-bold opacity-75">{service.skillLevel}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-stone-400 font-medium whitespace-nowrap">Duration:</span>
                                                            <span className="text-sm text-stone-600 font-bold">{service.durationAllowed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right md:hidden mt-2">
                                                    <p className="text-2xl font-black text-stone-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}<span className="text-sm font-medium text-stone-400"> / giờ</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action - Right Side */}
                                        <div className="flex flex-col gap-3 w-full md:w-auto justify-center mt-4 md:mt-0 pl-0 md:pl-8 md:border-l border-stone-100 min-w-[180px]">
                                            <div className="hidden md:block text-right mb-2">
                                                <p className="text-3xl font-black text-stone-900 tracking-tight">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">/ Giờ</p>
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 w-full">
                                                <button
                                                    onClick={() => handleShortTerm(service)}
                                                    data-testid="book-service-one-time"
                                                    className="flex-1 px-4 py-2.5 bg-white border-2 border-[#5fa5ba] text-[#5fa5ba] rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#5fa5ba] hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                                >
                                                    One-Time
                                                </button>
                                                <button
                                                    onClick={() => handleLongTerm(service)}
                                                    className="flex-1 px-4 py-2.5 bg-stone-900 text-white border-2 border-stone-900 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-black hover:border-black transition-all shadow-md active:scale-95 whitespace-nowrap"
                                                >
                                                    Long-Term Plan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
};

export default BookingService;
