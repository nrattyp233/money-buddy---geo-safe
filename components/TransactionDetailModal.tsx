import React, { useEffect } from 'react';
import Modal from './Modal';
import { Transaction, TransactionStatus, GeoFence } from '../types';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { MapPinIcon, ClockIcon } from './icons';

interface TransactionDetailModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

// Helper to recenter map when modal opens
function RecenterMap({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
            map.invalidateSize();
        }
    }, [center, zoom, map]);
    return null;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, isOpen, onClose }) => {
    if (!transaction) return null;

    const { type, amount, from_details, to_details, date, status, geoFence, timeRestriction, description } = transaction;
    
    const getStatusInfo = () => {
        const statuses: Record<TransactionStatus, { text: string; color: string }> = {
            [TransactionStatus.COMPLETED]: { text: "Completed", color: "text-green-400" },
            [TransactionStatus.PENDING]: { text: "Pending", color: "text-yellow-400" },
            [TransactionStatus.FAILED]: { text: "Failed", color: "text-red-400" },
            [TransactionStatus.RETURNED]: { text: "Returned", color: "text-blue-400" },
            [TransactionStatus.LOCKED]: { text: "Locked", color: "text-purple-400" },
            [TransactionStatus.DECLINED]: { text: "Declined", color: "text-gray-400" },
        };
        return statuses[status] || { text: status, color: "text-white" };
    };

    const isDebit = type === 'send' || type === 'penalty' || type === 'request';
    const amountColor = isDebit ? 'text-red-400' : 'text-lime-400';
    const sign = type === 'receive' ? '+' : '-';


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
            <div className="space-y-6 text-gray-200">
                <div className="text-center pb-4 border-b border-white/10">
                    <p className="text-sm text-gray-400">{description}</p>
                    <p className={`text-5xl font-bold ${amountColor}`}>
                        {sign}
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                    </p>
                    <p className={`font-semibold ${getStatusInfo().color}`}>{getStatusInfo().text}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-900/50 p-3 rounded-md">
                        <p className="text-gray-400 font-semibold">From</p>
                        <p className="font-mono truncate">{from_details}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-md">
                        <p className="text-gray-400 font-semibold">To</p>
                        <p className="font-mono truncate">{to_details}</p>
                    </div>
                     <div className="bg-gray-900/50 p-3 rounded-md">
                        <p className="text-gray-400 font-semibold">Date</p>
                        <p>{date.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-md">
                        <p className="text-gray-400 font-semibold">Transaction ID</p>
                        <p className="font-mono text-xs">{transaction.id}</p>
                    </div>
                </div>

                {geoFence && (
                    <div className="space-y-2">
                         <div className="flex items-center space-x-2 text-lime-300">
                            <MapPinIcon className="w-5 h-5"/>
                            <h4 className="font-semibold">Geofence Active</h4>
                        </div>
                        <p className="text-xs text-gray-400">Claimable within {geoFence.radiusKm}km of {geoFence.locationName}</p>
                         <div className="h-48 w-full rounded-lg overflow-hidden border border-lime-400/30">
                            <MapContainer center={[geoFence.latitude, geoFence.longitude]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                <RecenterMap center={[geoFence.latitude, geoFence.longitude]} zoom={11} />
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' />
                                <Circle center={[geoFence.latitude, geoFence.longitude]} pathOptions={{ color: '#a3e635', fillColor: '#a3e635', fillOpacity: 0.3 }} radius={geoFence.radiusKm * 1000} />
                            </MapContainer>
                        </div>
                    </div>
                )}

                 {timeRestriction && (
                    <div className="space-y-2">
                         <div className="flex items-center space-x-2 text-lime-300">
                            <ClockIcon className="w-5 h-5"/>
                            <h4 className="font-semibold">Time Restriction Active</h4>
                        </div>
                        <p className="text-xs text-gray-400">Must be claimed before {new Date(timeRestriction.expiresAt).toLocaleString()}</p>
                    </div>
                )}

                <div className="pt-4 text-right">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default TransactionDetailModal;