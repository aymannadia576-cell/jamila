import React from 'react';

interface MihrabArchFrameProps {
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const MihrabArchFrame: React.FC<MihrabArchFrameProps> = ({
  children,
  className = '',
  animate = true,
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 w-full max-w-4xl mx-auto ${className}`}>
      {/* Background Architectural Vector Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 700 840"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer Hairline Box */}
        <rect
          x="12"
          y="12"
          width="676"
          height="816"
          stroke="#5c3d2e"
          strokeWidth="0.75"
          opacity="0.3"
        />
        <rect
          x="18"
          y="18"
          width="664"
          height="804"
          stroke="#5c3d2e"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity="0.2"
        />

        {/* Spandrels / Corner Inlays */}
        <path
          d="M 18 18 L 120 18 C 80 45 45 80 18 120 Z"
          fill="none"
          stroke="#5c3d2e"
          strokeWidth="0.6"
          opacity="0.25"
        />
        <circle cx="52" cy="52" r="2.5" stroke="#5c3d2e" strokeWidth="0.5" opacity="0.3" />

        <path
          d="M 682 18 L 580 18 C 620 45 655 80 682 120 Z"
          fill="none"
          stroke="#5c3d2e"
          strokeWidth="0.6"
          opacity="0.25"
        />
        <circle cx="648" cy="52" r="2.5" stroke="#5c3d2e" strokeWidth="0.5" opacity="0.3" />

        {/* Primary Pointed Arch Profile (Mihrab) with Animated Stroke-Draw */}
        <path
          d="M 56 816 L 56 360 C 56 195 175 85 350 25 C 525 85 644 195 644 360 L 644 816"
          stroke="#5c3d2e"
          strokeWidth="1.3"
          strokeLinecap="round"
          className={animate ? 'animate-arch-stroke' : ''}
        />

        {/* Secondary Inner Arch with dashed line */}
        <path
          d="M 74 816 L 74 370 C 74 215 185 110 350 50 C 515 110 626 215 626 370 L 626 816"
          stroke="#5c3d2e"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.5"
        />

        {/* Third Inner Hairline Arch */}
        <path
          d="M 90 816 L 90 380 C 90 230 195 130 350 72 C 505 130 610 230 610 380 L 610 816"
          stroke="#5c3d2e"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Apex Finial Star & Pendant */}
        <circle cx="350" cy="25" r="3" fill="#5c3d2e" />
        <line x1="350" y1="10" x2="350" y2="25" stroke="#5c3d2e" strokeWidth="0.8" />
        <polygon
          points="350,4 353,9 358,9 354,12 356,17 350,14 344,17 346,12 342,9 347,9"
          fill="#5c3d2e"
        />

        {/* Capital Band Accents */}
        <line x1="46" y1="360" x2="84" y2="360" stroke="#5c3d2e" strokeWidth="1" />
        <line x1="46" y1="364" x2="84" y2="364" stroke="#5c3d2e" strokeWidth="0.5" />
        <line x1="616" y1="360" x2="654" y2="360" stroke="#5c3d2e" strokeWidth="1" />
        <line x1="616" y1="364" x2="654" y2="364" stroke="#5c3d2e" strokeWidth="0.5" />

        {/* Base Plinths */}
        <line x1="42" y1="816" x2="90" y2="816" stroke="#5c3d2e" strokeWidth="1.2" />
        <line x1="610" y1="816" x2="658" y2="816" stroke="#5c3d2e" strokeWidth="1.2" />
      </svg>

      {/* Content Container with Royal Breathing Room */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-12 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16">
        {children}
      </div>
    </div>
  );
};
