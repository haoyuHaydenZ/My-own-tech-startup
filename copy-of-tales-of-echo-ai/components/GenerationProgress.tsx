import React from 'react';

interface GenerationProgressProps {
  isGenerating: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ isGenerating }) => {
  if (!isGenerating) return null;

  return (
    <div className="w-full max-w-3xl mx-auto my-4 px-4 animate-fadeIn">
      <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 uppercase tracking-wider font-semibold">
        <span>Processing Audio Data</span>
        <span className="animate-pulse">Analyzing...</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
        {/* The width animation is handled by Tailwind custom keyframes defined in index.html/config */}
        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full animate-progress" style={{ width: '0%' }}></div>
      </div>
    </div>
  );
};

export default GenerationProgress;