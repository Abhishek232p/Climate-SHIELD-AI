import React from 'react';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const LiveIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 text-red-400 font-semibold">
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span>LIVE</span>
    </div>
);


export const Header: React.FC<{ isLive: boolean }> = ({ isLive }) => {
  return (
    <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-70">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldIcon />
          <h1 className="text-2xl font-bold text-brand-text">
            Climate Shield AI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
            {isLive && <LiveIndicator />}
            <p className="text-brand-secondary hidden md:block">AI-Powered Disaster Preparedness</p>
        </div>
      </div>
    </header>
  );
};