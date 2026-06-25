import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm w-full">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-slate-800">Loading Data</h2>
        <p className="text-slate-500 text-sm mt-1 text-center font-medium">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
