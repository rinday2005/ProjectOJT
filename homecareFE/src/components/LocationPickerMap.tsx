import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Rate limit helper to comply with Nominatim's strict usage policy (max 1 req/sec)
let lastRequestTime = 0;
const runRateLimited = async <T,>(fn: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
    }
    lastRequestTime = Date.now();
    return fn();
};

// Custom SVG Marker to prevent missing asset path errors in Vite/React
const customMarkerIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background-color: #e11d48;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        ">
            <div style="
                width: 14px;
                height: 14px;
                background-color: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
            "></div>
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
});

interface LocationPickerMapProps {
    latitude?: number;
    longitude?: number;
    address?: string;
    onChange?: (lat: number, lon: number, address: string) => void;
    readOnly?: boolean;
    height?: string;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
    latitude,
    longitude,
    address = '',
    onChange,
    readOnly = false,
    height = '300px'
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerInstanceRef = useRef<L.Marker | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    // Center coordinates: use prop values or default to Ho Chi Minh City
    const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && latitude !== 0 && longitude !== 0;
    const initialLat = hasCoords ? latitude! : 10.762622;
    const initialLon = hasCoords ? longitude! : 106.660172;

    // 1. Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize Map instance
        const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLon],
            zoom: hasCoords ? 16 : 13,
            zoomControl: true,
            scrollWheelZoom: true
        });
        mapInstanceRef.current = map;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add Marker
        const marker = L.marker([initialLat, initialLon], {
            icon: customMarkerIcon,
            draggable: !readOnly
        }).addTo(map);
        markerInstanceRef.current = marker;

        // Popup bind
        if (address) {
            marker.bindPopup(address).openPopup();
        }

        // Add event listeners for picking location
        if (!readOnly && onChange) {
            // Drag marker event
            marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                setStatusMessage('Đang lấy địa chỉ...');
                const resolvedAddress = await reverseGeocode(pos.lat, pos.lng);
                onChange(pos.lat, pos.lng, resolvedAddress);
            });

            // Click map event to place marker
            map.on('click', async (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                setStatusMessage('Đang lấy địa chỉ...');
                const resolvedAddress = await reverseGeocode(lat, lng);
                onChange(lat, lng, resolvedAddress);
            });
        }

        // Fix leaflet display rendering bugs inside hidden modals
        setTimeout(() => {
            map.invalidateSize();
        }, 300);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markerInstanceRef.current = null;
        };
    }, []);

    // 2. Sync Map View if external coordinates change
    useEffect(() => {
        if (!mapInstanceRef.current || !markerInstanceRef.current) return;

        const currentPos = markerInstanceRef.current.getLatLng();
        const latVal = typeof latitude === 'number' ? latitude : 0;
        const lonVal = typeof longitude === 'number' ? longitude : 0;

        const diffLat = Math.abs(currentPos.lat - latVal);
        const diffLon = Math.abs(currentPos.lng - lonVal);

        if ((diffLat > 0.0001 || diffLon > 0.0001) && latVal !== 0 && lonVal !== 0) {
            markerInstanceRef.current.setLatLng([latVal, lonVal]);
            mapInstanceRef.current.setView([latVal, lonVal], 16);
            if (address) {
                markerInstanceRef.current.bindPopup(address).openPopup();
            }
        }
    }, [latitude, longitude, address]);

    // Sync address prop to searchQuery state so they match
    useEffect(() => {
        if (address) {
            setSearchQuery(address);
        }
    }, [address]);

    // 3. Reverse Geocoding Helper (coordinates -> address string)
    const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
        return runRateLimited(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'vi,en',
                            'User-Agent': 'HomeCareOJT-PatientMapIntegration/1.0'
                        }
                    }
                );
                const data = await res.json();
                setStatusMessage('');
                return data.display_name || `Tọa độ: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            } catch (err) {
                console.error('Lỗi lấy địa chỉ ngược:', err);
                setStatusMessage('Không thể lấy địa chỉ tự động');
                return `Tọa độ: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            }
        });
    };

    // 4. Geocoding Search handler (address string -> coordinates)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.trim() || address.trim();
        if (!query || readOnly || !mapInstanceRef.current || !markerInstanceRef.current || !onChange) return;

        try {
            setSearching(true);
            setStatusMessage('Đang tìm vị trí...');

            const results = await runRateLimited(async () => {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
                    {
                        headers: {
                            'Accept-Language': 'vi,en',
                            'User-Agent': 'HomeCareOJT-PatientMapIntegration/1.0'
                        }
                    }
                );
                return res.json();
            });

            if (results && results.length > 0) {
                const { lat, lon, display_name } = results[0];
                const newLat = parseFloat(lat);
                const newLon = parseFloat(lon);

                markerInstanceRef.current.setLatLng([newLat, newLon]);
                mapInstanceRef.current.setView([newLat, newLon], 16);
                markerInstanceRef.current.bindPopup(display_name).openPopup();
                onChange(newLat, newLon, display_name);
                setStatusMessage('');
            } else {
                setStatusMessage('Không tìm thấy địa chỉ này trên bản đồ.');
            }
        } catch (err) {
            console.error('Lỗi tìm kiếm địa chỉ:', err);
            setStatusMessage('Lỗi kết nối bản đồ. Vui lòng thử lại.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-2">
            {!readOnly && (
                <div className="flex flex-col gap-1.5">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ để tìm kiếm vị trí..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 text-xs rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-[#99C5D3] bg-white text-stone-800"
                        />
                        <button
                            type="submit"
                            disabled={searching}
                            className="px-4 py-2 bg-[#5fa5ba] hover:bg-[#488e9f] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
                        >
                            <span className="material-symbols-outlined text-sm">search</span>
                            {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                        </button>
                    </form>
                    {statusMessage && (
                        <p className={`text-[10px] font-bold ${statusMessage.includes('Không') || statusMessage.includes('Lỗi') ? 'text-red-500' : 'text-blue-500'}`}>
                            {statusMessage}
                        </p>
                    )}
                </div>
            )}
            <div
                ref={mapContainerRef}
                style={{ height }}
                className="w-full rounded-2xl border border-stone-200 shadow-inner relative z-0"
            />
            {!readOnly && (
                <p className="text-[10px] text-stone-400 italic">
                    * Kéo thả Marker đỏ hoặc click chuột trực tiếp lên bản đồ để chọn định vị chính xác.
                </p>
            )}
        </div>
    );
};

export default LocationPickerMap;
