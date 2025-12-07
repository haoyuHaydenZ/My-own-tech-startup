import React from 'react';

export const CyberpunkMic = ({ size = 24, className = "", isRecording = false }: { size?: number, className?: string, isRecording?: boolean }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Tech/Cyber Accents - Left (Cyan) & Right (Magenta) brackets */}
    <path 
      d="M19 10V11C19 14.866 15.866 18 12 18" 
      stroke="#06b6d4" 
      strokeWidth="1.5" 
      strokeLinecap="square" 
      className={isRecording ? "animate-pulse" : ""}
    />
    <path 
      d="M5 10V11C5 14.866 8.13401 18 12 18" 
      stroke="#d946ef" 
      strokeWidth="1.5" 
      strokeLinecap="square" 
      className={isRecording ? "animate-pulse" : ""}
    />
    
    {/* Base Stand */}
    <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 22H15" stroke="currentColor" strokeWidth="1.5" />
    
    {/* The Capsule (Hexagonal Futuristic Shape) */}
    <path 
      d="M12 2L15.5 5.5V10.5L12 14L8.5 10.5V5.5L12 2Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinejoin="bevel" 
      fill={isRecording ? "currentColor" : "none"}
      fillOpacity={isRecording ? "0.1" : "0"}
    />
    
    {/* Grille Lines */}
    <path d="M8.5 8H15.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M10 11H14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

    {/* Recording / Signal Indicators */}
    {isRecording && (
      <>
        <circle cx="12" cy="8" r="1.5" fill="#ef4444" className="animate-ping" />
        <path d="M21 7L23 5" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 7L1 5" stroke="#d946ef" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);