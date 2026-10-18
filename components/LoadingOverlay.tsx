
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 text-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-3xl font-bold comic-font text-yellow-400 tracking-wider mb-4">HEROIC EFFORT IN PROGRESS</h2>
      <p className="text-xl text-slate-300 max-w-md animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
