import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-brand-secondary">
        <p className="font-semibold text-amber-400">
          Disclaimer: This application is for informational and educational purposes only.
        </p>
        <p className="text-sm mt-1">
          The predictions are simulated by an AI and should not be used for real-life decision-making. Always consult official emergency services and local authorities during a natural disaster.
        </p>
        <p className="text-sm mt-4">
          © {new Date().getFullYear()} Climate Shield AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};