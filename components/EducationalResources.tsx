import React, { useState, useCallback } from 'react';
import { DISASTER_TYPES } from '../constants';
import { DisasterType, EducationalResource } from '../types';
import { getEducationalContent } from '../services/geminiService';
import { Spinner } from './Spinner';

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


export const EducationalResources: React.FC = () => {
    const [selectedDisaster, setSelectedDisaster] = useState<DisasterType | null>(null);
    const [content, setContent] = useState<EducationalResource | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async (disaster: DisasterType) => {
        if (selectedDisaster === disaster && content && !error) return;
        
        setSelectedDisaster(disaster);
        setIsLoading(true);
        setError(null);
        setContent(null);

        try {
            const result = await getEducationalContent(disaster);
            setContent(result);
        } catch (err) {
            setError("Failed to load educational content. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedDisaster, content, error]);

    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-brand-text flex items-center">
                <BookIcon />
                Disaster Preparedness Guides
            </h2>
            <div className="border-b border-brand-border mb-4">
                <div role="tablist" aria-label="Disaster Types" className="flex space-x-1 overflow-x-auto pb-2">
                    {DISASTER_TYPES.map(type => (
                        <button
                            key={type}
                            id={`tab-${type}`}
                            role="tab"
                            aria-selected={selectedDisaster === type}
                            aria-controls={`tabpanel-${type}`}
                            onClick={() => fetchContent(type)}
                            className={`whitespace-nowrap py-2 px-4 font-medium text-sm rounded-t-md transition-colors duration-200 ${
                                selectedDisaster === type
                                    ? 'bg-brand-bg text-brand-primary'
                                    : 'text-brand-secondary hover:text-brand-text'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[300px]">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full pt-10">
                        <Spinner size="lg" />
                        <p className="mt-4 text-brand-secondary">Loading guide for {selectedDisaster}...</p>
                    </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                
                <div
                    id={`tabpanel-${selectedDisaster}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${selectedDisaster}`}
                    hidden={isLoading || !!error || !content}
                >
                    {content && (
                        <div className="animate-fade-in">
                            <p className="text-brand-text mb-6 leading-relaxed">{content.summary}</p>
                            <div className="space-y-4">
                                {content.keyTopics.map((topic, index) => (
                                    <div key={index}>
                                        <h4 className="font-semibold text-lg text-brand-primary mb-1">{topic.topic}</h4>
                                        <p className="text-brand-text leading-relaxed">{topic.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                 {!isLoading && !error && !content && (
                    <div className="text-center text-brand-secondary py-10">
                        <p>Select a disaster type above to view a preparedness guide.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
