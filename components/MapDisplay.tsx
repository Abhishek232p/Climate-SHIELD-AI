import React, { useEffect, useRef } from 'react';
import type { PredictionResult, RiskLevel } from '../types';

declare const L: any; // Use Leaflet from the global scope

interface MapDisplayProps {
  prediction: PredictionResult | null;
  location: string;
  isLoading: boolean;
}

const getRiskRadius = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
        case 'Low': return 5000;
        case 'Moderate': return 10000;
        case 'High': return 20000;
        case 'Severe': return 35000;
        default: return 1000;
    }
};

const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
        case 'Low': return '#22c55e'; // green-500
        case 'Moderate': return '#facc15'; // yellow-400
        case 'High': return '#f97316'; // orange-500
        case 'Severe': return '#ef4444'; // red-500
        default: return '#6b7280'; // gray-500
    }
}


const MapSkeletonLoader = () => (
    <div className="h-[400px] rounded-md bg-brand-bg animate-pulse"></div>
);

const MapPlaceholder = () => (
    <div className="h-[400px] rounded-md bg-brand-bg flex items-center justify-center">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2 text-sm text-brand-secondary">Map will be displayed here.</p>
        </div>
    </div>
);

export const MapDisplay: React.FC<MapDisplayProps> = ({ prediction, location, isLoading }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            // Initialize map
            mapInstance.current = L.map(mapRef.current).setView([34.0522, -118.2437], 5); // Default to LA
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
        }

        if (prediction && mapInstance.current) {
            const { lat, lon } = prediction.coordinates;
            const riskRadius = getRiskRadius(prediction.riskLevel);
            const riskColor = getRiskColor(prediction.riskLevel);

            mapInstance.current.flyTo([lat, lon], 9, {
                animate: true,
                duration: 1.5
            });

            // Update marker
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lon]);
            } else {
                markerRef.current = L.marker([lat, lon]).addTo(mapInstance.current);
            }
             markerRef.current.bindPopup(`<b>${location}</b><br>Risk: ${prediction.riskLevel}`).openPopup();


            // Update circle
            if (circleRef.current) {
                circleRef.current.setLatLng([lat, lon]).setRadius(riskRadius).setStyle({ color: riskColor, fillColor: riskColor });
            } else {
                circleRef.current = L.circle([lat, lon], {
                    color: riskColor,
                    fillColor: riskColor,
                    fillOpacity: 0.2,
                    radius: riskRadius
                }).addTo(mapInstance.current);
            }
        }
        
    }, [prediction, location, isLoading]);


    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-brand-text">Interactive Map</h2>
            {isLoading ? (
                <MapSkeletonLoader />
            ) : prediction ? (
                <div className="h-[400px] rounded-md overflow-hidden bg-brand-bg" ref={mapRef}></div>
            ) : (
                <MapPlaceholder />
            )}
        </div>
    );
};