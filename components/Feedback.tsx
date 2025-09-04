import React, { useState } from 'react';

const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.223M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
);

const ThumbsDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l2.714-4.223M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
    </svg>
);


export const Feedback: React.FC = () => {
    const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

    const handleFeedback = () => {
        setFeedbackSent(true);
    };

    if (feedbackSent) {
        return (
            <div className="text-center text-brand-secondary text-sm animate-fade-in w-full sm:w-auto">
                Thank you for your feedback!
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center space-x-4 w-full sm:w-auto animate-fade-in">
            <span className="text-sm text-brand-secondary">Was this helpful?</span>
            <button
                onClick={handleFeedback}
                className="text-brand-secondary hover:text-green-400 transition-colors p-1 rounded-full hover:bg-brand-surface"
                aria-label="Helpful"
            >
                <ThumbsUpIcon />
            </button>
            <button
                onClick={handleFeedback}
                className="text-brand-secondary hover:text-red-400 transition-colors p-1 rounded-full hover:bg-brand-surface"
                aria-label="Not helpful"
            >
                <ThumbsDownIcon />
            </button>
        </div>
    );
};