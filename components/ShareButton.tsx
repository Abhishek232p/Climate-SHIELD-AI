import React, { useState } from 'react';
import type { PredictionResult } from '../types';

interface ShareButtonProps {
    prediction: PredictionResult;
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const CheckIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export const ShareButton: React.FC<ShareButtonProps> = ({ prediction }) => {
    const [copied, setCopied] = useState(false);

    const shareData = {
        title: 'Climate Shield AI - Disaster Risk Assessment',
        text: `${prediction.shortSummary} Find out more about disaster preparedness with Climate Shield AI.`,
        url: window.location.href,
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback to copy to clipboard
            const clipboardText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(clipboardText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-2 border border-brand-border rounded-md text-sm font-medium text-brand-secondary hover:bg-brand-surface hover:text-brand-text transition-colors w-full sm:w-auto"
            aria-label="Share analysis"
        >
            {copied ? (
                <>
                    <CheckIcon />
                    <span className="ml-2">Copied to clipboard!</span>
                </>
            ) : (
                <>
                    <ShareIcon />
                    <span className="ml-2">Share Analysis</span>
                </>
            )}
        </button>
    );
};