import React from 'react';

interface CyberpunkLogoProps {
  size?: number;
  className?: string;
}

export const CyberpunkLogo: React.FC<CyberpunkLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
       {/* Echorya Symbol: Harmonic Resonance (Stylized E / Wave) */}
       <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
             <linearGradient id="echoryaGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#0F766E" />
             </linearGradient>
             <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
          </defs>
          
          {/* Main Harmonic Curve */}
          <path 
             d="M10 28C10 28 8 12 20 12C32 12 30 20 20 20C10 20 12 36 26 32" 
             stroke="url(#echoryaGradient)" 
             strokeWidth="3.5" 
             strokeLinecap="round" 
             strokeLinejoin="round"
             filter="url(#glow)"
          />
          
          {/* Secondary Resonance Line (Echo) */}
          <path 
             d="M14 28C14 28 13 16 20 16C27 16 26 20 20 20" 
             stroke="#5EEAD4" 
             strokeWidth="1.5" 
             strokeOpacity="0.5"
             strokeLinecap="round" 
          />
       </svg>
    </div>
  );
};