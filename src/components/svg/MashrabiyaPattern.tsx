import React from 'react';

interface MashrabiyaPatternProps {
  opacity?: number;
  className?: string;
}

export const MashrabiyaPattern: React.FC<MashrabiyaPatternProps> = ({
  opacity = 0.08,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="jamila-mashrabiya-pattern"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Box */}
            <rect width="72" height="72" fill="none" stroke="#5c3d2e" strokeWidth="0.75" />
            
            {/* Diagonal Grid Intersections */}
            <line x1="0" y1="0" x2="72" y2="72" stroke="#5c3d2e" strokeWidth="0.6" />
            <line x1="72" y1="0" x2="0" y2="72" stroke="#5c3d2e" strokeWidth="0.6" />
            
            {/* Center Octagon & Diamond */}
            <polygon
              points="36,18 54,36 36,54 18,36"
              fill="none"
              stroke="#5c3d2e"
              strokeWidth="0.85"
            />
            <circle cx="36" cy="36" r="12" fill="none" stroke="#5c3d2e" strokeWidth="0.6" strokeDasharray="2 2" />
            
            {/* Corner Petals */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="#5c3d2e" strokeWidth="0.55" />
            <circle cx="72" cy="0" r="10" fill="none" stroke="#5c3d2e" strokeWidth="0.55" />
            <circle cx="0" cy="72" r="10" fill="none" stroke="#5c3d2e" strokeWidth="0.55" />
            <circle cx="72" cy="72" r="10" fill="none" stroke="#5c3d2e" strokeWidth="0.55" />

            {/* Small decorative nodes */}
            <circle cx="36" cy="36" r="2" fill="#5c3d2e" />
            <circle cx="0" cy="36" r="1.5" fill="#5c3d2e" />
            <circle cx="72" cy="36" r="1.5" fill="#5c3d2e" />
            <circle cx="36" cy="0" r="1.5" fill="#5c3d2e" />
            <circle cx="36" cy="72" r="1.5" fill="#5c3d2e" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jamila-mashrabiya-pattern)" />
      </svg>
    </div>
  );
};
