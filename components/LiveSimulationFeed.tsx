import React from 'react';

export interface LiveEvent {
    timestamp: string;
    message: string;
}

interface LiveSimulationFeedProps {
    events: LiveEvent[];
}

const FeedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);


export const LiveSimulationFeed: React.FC<LiveSimulationFeedProps> = ({ events }) => {
    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg" aria-live="polite" aria-atomic="true">
            <h2 className="text-xl font-bold mb-4 text-brand-text flex items-center">
                <FeedIcon/>
                Live Event Feed
            </h2>
            <div className="max-h-80 overflow-y-auto pr-2 space-y-3 flex flex-col-reverse">
                {/* We reverse the flex direction to keep the scrollbar at the bottom while new items appear at the top */}
                <div className="space-y-3">
                    {events.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3 text-sm animate-fade-in">
                            <div className="text-brand-secondary flex-shrink-0 w-20 text-right font-mono">
                                {event.timestamp}
                            </div>
                            <div className="flex-shrink-0 text-brand-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div className="text-brand-text">{event.message}</div>
                        </div>
                    ))}
                </div>
            </div>
            {events.length === 0 && (
                 <div className="text-center text-brand-secondary py-4">
                    <p>Initializing live feed...</p>
                </div>
            )}
        </div>
    );
};
