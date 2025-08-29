import React, { useState, useEffect } from 'react';
import { Account, GeoFence, TimeRestriction } from '../types';
import { MapPinIcon, ClockIcon, SearchIcon } from './icons';
import { MapContainer, TileLayer, Circle, useMap, useMapEvents } from 'react-leaflet';

interface SendMoneyProps {
    accounts: Account[];
    onSend: (fromAccountId: string, to: string, amount: number, description: string, geoFence: GeoFence | undefined, timeRestriction: TimeRestriction | undefined) => void;
}

// Helper component to change map view programmatically
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

const SendMoney: React.FC<SendMoneyProps> = ({ accounts, onSend }) => {
    const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [useGeoFence, setUseGeoFence] = useState(false);
    const [useTimeRestriction, setUseTimeRestriction] = useState(false);
    const [hours, setHours] = useState('24');
    
    // State for map
    const [locationQuery, setLocationQuery] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC
    const [fenceRadius, setFenceRadius] = useState(5); // In km
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [locationName, setLocationName] = useState('');

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setMarkerPosition([e.latlng.lat, e.latlng.lng]);
                 // Optional: Reverse geocode to get address from coordinates
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.display_name) {
                            setLocationName(data.display_name);
                            setLocationQuery(data.display_name.split(',')[0]);
                        }
                    });
            },
        });
        return null;
    };

    const handleLocationSearch = async () => {
        if (!locationQuery) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setMapCenter(newCenter);
                setMarkerPosition(newCenter);
                setLocationName(display_name);
            } else {
                alert('Location not found.');
            }
        } catch (error) {
            console.error("Error searching for location:", error);
            alert('Failed to search for location.');
        } finally {
            setIsSearching(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAccountId || !recipient || !amount || parseFloat(amount) <= 0 || !description) {
            alert('Please fill all required fields correctly.');
            return;
        }

        const fromAccount = accounts.find(acc => acc.id === fromAccountId);
        if (fromAccount && (fromAccount.balance === null || fromAccount.balance < parseFloat(amount))) {
            alert("Insufficient funds.");
            return;
        }

        let geoFence: GeoFence | undefined = undefined;
        if (useGeoFence && markerPosition) {
            geoFence = { 
                latitude: markerPosition[0],
                longitude: markerPosition[1],
                radiusKm: fenceRadius,
                locationName: locationName || "Selected Area"
            };
        }

        let timeRestriction: TimeRestriction | undefined = undefined;
        if (useTimeRestriction && hours) {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + parseInt(hours, 10));
            timeRestriction = { expiresAt: expiryDate };
        }

        onSend(fromAccountId, recipient, parseFloat(amount), description, geoFence, timeRestriction);
        setRecipient('');
        setAmount('');
        setDescription('');
    };

    return (
        <div className="p-4 md:p-6 bg-cyan-950/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-cyan-300 mb-6">Send Money Securely</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-300 mb-1">From Account</label>
                        <select id="fromAccount" name="fromAccount" value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition">
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id} disabled={acc.balance === null}>
                                    {acc.name} - {acc.balance !== null ? `$${acc.balance.toFixed(2)}` : 'Balance N/A'}
                                </option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                        <input type="number" id="amount" name="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" autoComplete="transaction-amount" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">Recipient (Email or @username)</label>
                    <input type="text" id="recipient" name="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="buddy@example.com" autoComplete="email" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input type="text" id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Dinner last night" autoComplete="off" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                             <MapPinIcon className="w-6 h-6 text-lime-400"/>
                             <span className="font-semibold text-white">Add Geofence</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={useGeoFence} onChange={() => setUseGeoFence(!useGeoFence)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-lime-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                        </label>
                    </div>
                    {useGeoFence && (
                        <div className="pl-2 pr-2 md:pl-4 md:pr-4 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="text" 
                                    id="location-search"
                                    name="location-search"
                                    aria-label="Search for a location for the geofence"
                                    value={locationQuery} 
                                    onChange={e => setLocationQuery(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && handleLocationSearch()} 
                                    placeholder="e.g., San Francisco, CA"
                                    autoComplete="off"
                                    className="flex-grow w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" 
                                />
                                <button type="button" onClick={handleLocationSearch} disabled={isSearching} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold rounded-lg transition-colors disabled:opacity-50">
                                    <SearchIcon className="w-5 h-5 mr-2"/>
                                    {isSearching ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                            <div className="h-72 w-full rounded-lg overflow-hidden border-2 border-lime-400/30 shadow-lg">
                                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                                    <ChangeView center={mapCenter} zoom={markerPosition ? 13 : 8} />
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                                    <MapClickHandler />
                                    {markerPosition && <Circle center={markerPosition} pathOptions={{ color: '#a3e635', fillColor: '#a3e635', fillOpacity: 0.3 }} radius={fenceRadius * 1000} />}
                                </MapContainer>
                            </div>
                            <div>
                                <label htmlFor="radius" className="block text-sm font-medium text-gray-300 mb-2">Fence Radius: <span className="font-bold text-lime-300">{fenceRadius} km</span></label>
                                <input id="radius" name="radius" type="range" min="1" max="50" step="1" value={fenceRadius} onChange={e => setFenceRadius(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-lime-500" />
                                <p className="text-xs text-gray-400 mt-2">Click on the map to set the center of the geofence.</p>
                            </div>
                        </div>
                    )}
                     <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <ClockIcon className="w-6 h-6 text-lime-400"/>
                            <span className="font-semibold text-white">Add Time Restriction</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" checked={useTimeRestriction} onChange={() => setUseTimeRestriction(!useTimeRestriction)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-lime-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                        </label>
                    </div>
                     {useTimeRestriction && (
                         <div className="pl-4">
                            <label htmlFor="hours" className="block text-sm font-medium text-gray-300 mb-1">Claim within (hours)</label>
                            <input type="number" id="hours" name="hours" value={hours} onChange={e => setHours(e.target.value)} placeholder="24" autoComplete="off" className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-lime-400 focus:border-lime-400 transition" />
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-lime-500 hover:bg-lime-400 text-purple-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-500/20 flex items-center justify-center space-x-2">
                    <span>Send Payment</span>
                </button>
            </form>
        </div>
    );
};

export default SendMoney;