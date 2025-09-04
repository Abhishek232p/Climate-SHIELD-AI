import React from 'react';
import { Settings, RiskLevel } from '../types';

interface SettingsPanelProps {
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
    
    const handleThresholdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSettingsChange({
            ...settings,
            alertThreshold: e.target.value as RiskLevel,
        });
    };
    
    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-brand-text flex items-center">
                <SettingsIcon />
                Settings
            </h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="alert-threshold" className="block text-sm font-medium text-brand-secondary mb-1">
                        Alert Notification Threshold
                    </label>
                    <select
                        id="alert-threshold"
                        value={settings.alertThreshold}
                        onChange={handleThresholdChange}
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary text-brand-text"
                    >
                        <option value={RiskLevel.Moderate}>Moderate+</option>
                        <option value={RiskLevel.High}>High+</option>
                        <option value={RiskLevel.Severe}>Severe</option>
                    </select>
                    <p className="text-xs text-brand-secondary mt-2">
                        Receive a banner notification for risks at this level or higher.
                    </p>
                </div>
            </div>
        </div>
    );
};