import React, { useState } from 'react';
import type { PredictionResult, ApiError, SafetyMeasures } from '../types';
import { RiskLevel } from '../types';
import { Spinner } from './Spinner';
import { ShareButton } from './ShareButton';
import { Feedback } from './Feedback';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: ApiError | null;
}

const getRiskLevelStyles = (riskLevel: RiskLevel | undefined) => {
    switch (riskLevel) {
        case RiskLevel.Low:
            return {
                bg: 'bg-green-500/10',
                border: 'border-green-500/30',
                text: 'text-green-300',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            };
        case RiskLevel.Moderate:
            return {
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/30',
                text: 'text-yellow-300',
                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            };
        case RiskLevel.High:
            return {
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/30',
                text: 'text-orange-300',
                icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            };
        case RiskLevel.Severe:
            return {
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
                text: 'text-red-300',
                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            };
        default:
            return {
                bg: 'bg-gray-500/10',
                border: 'border-gray-500/30',
                text: 'text-gray-300',
                icon: ''
            };
    }
}

const SafetyMeasuresTabs: React.FC<{ measures: SafetyMeasures }> = ({ measures }) => {
    const [activeTab, setActiveTab] = useState<keyof SafetyMeasures>('before');
    
    const tabs: { key: keyof SafetyMeasures; label: string; icon: JSX.Element }[] = [
        { key: 'before', label: 'Before', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg> },
        { key: 'during', label: 'During', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> },
        { key: 'after', label: 'After', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> },
    ];

    return (
        <div>
            <div className="border-b border-brand-border mb-4">
                <div role="tablist" className="-mb-px flex space-x-6" aria-label="Safety Measures">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            id={`tab-${tab.key}`}
                            role="tab"
                            aria-selected={activeTab === tab.key}
                            aria-controls={`tabpanel-${tab.key}`}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
                                activeTab === tab.key
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-brand-secondary hover:text-brand-text hover:border-gray-500'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {tabs.map(tab => (
                 <div
                    key={tab.key}
                    id={`tabpanel-${tab.key}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${tab.key}`}
                    className={`animate-fade-in ${activeTab === tab.key ? 'block' : 'hidden'}`}
                 >
                    <ul className="space-y-3 pl-5 list-disc text-brand-text marker:text-brand-primary">
                        {measures[tab.key].map((measure, index) => (
                            <li key={index}>{measure}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};


export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
                <p className="mt-4 text-brand-secondary">AI is analyzing the risk...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 p-6 rounded-lg border border-red-500/50 shadow-lg flex flex-col items-center justify-center min-h-[400px] text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold mt-4 text-red-300">{error.title || 'Analysis Failed'}</h3>
                <p className="mt-2 text-red-400">{error.message}</p>
            </div>
        );
    }
    
    if (!prediction) {
        return (
            <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg flex flex-col items-center justify-center min-h-[400px] text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-xl font-bold mt-4">Awaiting Analysis</h3>
                <p className="mt-2 text-brand-secondary">Fill out the form to get a simulated disaster risk assessment.</p>
            </div>
        );
    }
    
    const { riskLevel, analysis, safetyMeasures } = prediction;
    const styles = getRiskLevelStyles(riskLevel);

    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg animate-slide-in-up">
            <h3 className="text-xl font-bold mb-4">Analysis Result</h3>

            <div className={`p-4 rounded-lg border flex items-center space-x-4 mb-6 ${styles.bg} ${styles.border}`}>
                <div className={`flex-shrink-0 ${styles.text}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={styles.icon}/>
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-brand-secondary">Simulated Risk Level</p>
                    <p className={`text-2xl font-bold ${styles.text}`}>{riskLevel}</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${styles.text}`}>Risk Analysis</h4>
                <p className="text-brand-text leading-relaxed">{analysis}</p>
            </div>
            
            <div className="mb-8">
                <h4 className={`font-semibold mb-4 ${styles.text}`}>Recommended Safety Measures</h4>
                <SafetyMeasuresTabs measures={safetyMeasures} />
            </div>

            <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <Feedback />
                <ShareButton prediction={prediction} />
            </div>
        </div>
    );
};
