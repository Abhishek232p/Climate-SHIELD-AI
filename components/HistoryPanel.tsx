import React from 'react';
import type { HistoricalPrediction } from '../types';

interface HistoryPanelProps {
    history: HistoricalPrediction[];
    onLoad: (item: HistoricalPrediction) => void;
    onDelete: (id: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, onAnalyze, isAnalyzing }) => {
  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4 text-brand-text flex items-center">
        <HistoryIcon />
        Assessment History
      </h2>

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || history.length < 2}
        className="w-full bg-brand-primary/80 text-white font-bold py-2 px-4 rounded-md hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary disabled:bg-brand-secondary disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
      >
        {isAnalyzing ? (
            <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
            </>
        ) : "Analyze Trends"}
      </button>

      {history.length === 0 ? (
        <div className="text-center text-brand-secondary py-8">
          <p>Your past assessments will appear here.</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
          {history.map((item) => (
            <div key={item.id} className="bg-brand-bg p-3 rounded-md border border-brand-border/50 flex justify-between items-center group">
              <div>
                <p className="font-semibold text-brand-text">{item.location}</p>
                <p className="text-sm text-brand-secondary">{item.disasterType} - {new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onLoad(item)} className="p-1 text-brand-secondary hover:text-brand-primary" aria-label={`Load assessment for ${item.location}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={() => onDelete(item.id)} className="p-1 text-brand-secondary hover:text-red-400" aria-label={`Delete assessment for ${item.location}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
