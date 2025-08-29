import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const MapBackground: React.FC = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: '100%', zIndex: 0, filter: 'grayscale(70%) opacity(0.6)' }}>
            <MapContainer
                center={[20, 10]}
                zoom={2.5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                attributionControl={false}
                touchZoom={false}
                boxZoom={false}
                keyboard={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
            </MapContainer>
        </div>
    );
};

export default MapBackground;
