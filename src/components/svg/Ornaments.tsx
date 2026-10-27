import React from 'react';

interface Star8PointProps {
  size?: number;
  className?: string;
  color?: string;
}

export const Star8Point: React.FC<Star8PointProps> = ({
  size = 20,
  className = '',
  color = '#5c3d2e',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Intersecting squares forming 8-point Islamic star */}
    <rect x="20" y="20" width="60" height="60" stroke={color} strokeWidth="2.5" fill="none" transform="rotate(0 50 50)" />
    <rect x="20" y="20" width="60" height="60" stroke={color} strokeWidth="2.5" fill="none" transform="rotate(45 50 50)" />
    {/* Center circle and dot */}
    <circle cx="50" cy="50" r="5.5" fill={color} />
    <circle cx="50" cy="50" r="14" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
  </svg>
);

interface StarDividerProps {
  label?: string;
  className?: string;
}

export const StarDivider: React.FC<StarDividerProps> = ({
  label,
  className = '',
}) => (
  <div className={`flex items-center justify-center my-10 md:my-14 w-full max-w-2xl mx-auto px-4 ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#5c3d2e]/30 to-[#5c3d2e]/60" />
    <div className="mx-4 flex items-center gap-3">
      <div className="w-1.5 h-1.5 rotate-45 border border-[#5c3d2e]" />
      <Star8Point size={20} className="text-[#5c3d2e] opacity-90 transition-transform duration-700 hover:rotate-45" />
      {label && (
        <span className="text-xs uppercase tracking-[0.25em] font-amiri font-bold text-[#5c3d2e]">
          {label}
        </span>
      )}
      <div className="w-1.5 h-1.5 rotate-45 border border-[#5c3d2e]" />
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#5c3d2e]/30 to-[#5c3d2e]/60" />
  </div>
);

interface CornerOrnamentProps {
  position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  color?: string;
}

export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  position = 'top-start',
  color = '#5c3d2e',
}) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-start':
        return 'top-1.5 start-1.5';
      case 'top-end':
        return 'top-1.5 end-1.5 scale-x-[-1]';
      case 'bottom-start':
        return 'bottom-1.5 start-1.5 scale-y-[-1]';
      case 'bottom-end':
        return 'bottom-1.5 end-1.5 scale-[-1]';
      default:
        return 'top-1.5 start-1.5';
    }
  };

  return (
    <div className={`absolute w-5 h-5 pointer-events-none ${getPositionClass()}`} aria-hidden="true">
      <svg viewBox="0 0 30 30" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 2 2 L 18 2" stroke={color} strokeWidth="1.2" />
        <path d="M 2 2 L 2 18" stroke={color} strokeWidth="1.2" />
        <path d="M 6 6 L 14 6" stroke={color} strokeWidth="0.8" opacity="0.6" />
        <path d="M 6 6 L 6 14" stroke={color} strokeWidth="0.8" opacity="0.6" />
        <circle cx="8" cy="8" r="1.5" fill={color} />
        <path d="M 12 2 C 12 7 7 12 2 12" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
};
