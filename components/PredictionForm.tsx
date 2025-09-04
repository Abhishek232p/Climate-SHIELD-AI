import React, { useState } from 'react';
import { DISASTER_TYPES } from '../constants';
import type { DisasterType } from '../types';
import { getCityFromCoords } from '../services/geminiService';

interface PredictionFormProps {
  onPredict: (location: string, disaster: DisasterType) => void;
  isLoading: boolean;
}

const Button: React.FC<{ children: React.ReactNode; onClick: () => void; disabled: boolean; className?: string }> = ({ children, onClick, disabled, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary disabled:bg-brand-secondary disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 ${className}`}
    >
        {children}
    </button>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


export const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, isLoading }) => {
  const [location, setLocation] = useState('');
  const [disaster, setDisaster] = useState<DisasterType>(DISASTER_TYPES[0]);
  const [error, setError] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);

  const handleSubmit = () => {
    if (!location.trim()) {
      setError('Location cannot be empty.');
      return;
    }
    setError('');
    onPredict(location, disaster);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
    }
    
    setIsGeolocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const city = await getCityFromCoords(position.coords.latitude, position.coords.longitude);
                setLocation(city);
            } catch (err) {
                setError('Could not fetch location name. Please enter it manually.');
            } finally {
                setIsGeolocating(false);
            }
        },
        () => {
            setError('Unable to retrieve your location. Please check your browser permissions.');
            setIsGeolocating(false);
        }
    );
  };

  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4 text-brand-text">Disaster Risk Assessment</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-brand-secondary mb-1">
            Location (e.g., "San Francisco, CA")
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
             </div>
             <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-md py-2 pl-10 pr-10 focus:ring-brand-primary focus:border-brand-primary text-brand-text"
                placeholder="Enter a city or region"
                disabled={isGeolocating}
                aria-describedby="location-error"
            />
            <button 
                onClick={handleGeolocate} 
                disabled={isGeolocating || isLoading} 
                className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-secondary hover:text-brand-primary disabled:opacity-50"
                aria-label="Use my location"
            >
                {isGeolocating ? (
                    <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <LocationIcon />
                )}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="disaster" className="block text-sm font-medium text-brand-secondary mb-1">
            Disaster Type
          </label>
          <select
            id="disaster"
            value={disaster}
            onChange={(e) => setDisaster(e.target.value as DisasterType)}
            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary text-brand-text"
          >
            {DISASTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {error && <p id="location-error" className="text-red-400 text-sm">{error}</p>}
        <div className="pt-2">
            <Button onClick={handleSubmit} disabled={isLoading || isGeolocating}>
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : 'Assess Risk'}
            </Button>
        </div>
      </div>
    </div>
  );
};
