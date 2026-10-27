import React from 'react';

interface GarmentSketchProps {
  variant: 'qamar' | 'andalusian' | 'najd' | 'mirage' | 'yaqout' | 'rawda' | 'dunes' | 'cordoba';
  className?: string;
  stroke?: string;
}

// 1. Qamar Sketch (Mihrab Draped Royal Abaya)
const QamarSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="42" rx="14" ry="19" stroke={stroke} strokeWidth="1" opacity="0.6" strokeDasharray="3 2" />
    <path d="M 144 61 L 144 76 Q 150 78 156 76 L 156 61" stroke={stroke} strokeWidth="1.1" />
    <path d="M 136 40 C 130 55 125 75 120 100 C 115 125 118 160 122 190" stroke={stroke} strokeWidth="0.9" opacity="0.75" />
    <path d="M 164 40 C 172 55 178 78 182 105 C 185 130 184 165 178 195" stroke={stroke} strokeWidth="0.9" opacity="0.75" />
    <path d="M 140 76 Q 150 88 160 76" stroke={stroke} strokeWidth="1.2" />
    <path d="M 150 86 L 150 140" stroke={stroke} strokeWidth="1.2" />
    <circle cx="150" cy="98" r="1.5" fill={stroke} />
    <circle cx="150" cy="112" r="1.5" fill={stroke} />
    <circle cx="150" cy="126" r="1.5" fill={stroke} />
    <path d="M 140 76 C 110 82 75 110 40 160 C 35 168 38 174 46 172 C 70 165 105 158 135 155" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 160 76 C 190 82 225 110 260 160 C 265 168 262 174 254 172 C 230 165 195 158 165 155" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 38 162 L 46 174" stroke={stroke} strokeWidth="1" />
    <path d="M 262 162 L 254 174" stroke={stroke} strokeWidth="1" />
    <circle cx="42" cy="168" r="1.5" fill={stroke} />
    <circle cx="258" cy="168" r="1.5" fill={stroke} />
    <path d="M 135 155 C 130 210 115 290 70 380 C 68 384 72 386 78 386 L 222 386 C 228 386 232 384 230 380 C 185 290 170 210 165 155" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M 142 156 C 138 220 126 300 95 385" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
    <path d="M 158 156 C 162 220 174 300 205 385" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
    <path d="M 150 140 C 149 220 148 305 150 386" stroke={stroke} strokeWidth="0.9" opacity="0.7" strokeDasharray="6 3" />
    <path d="M 72 386 Q 150 388 228 386" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

// 2. Andalusian Bisht Sketch
const AndalusianSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="40" rx="13" ry="18" stroke={stroke} strokeWidth="0.9" opacity="0.5" strokeDasharray="3 2" />
    <path d="M 144 58 L 144 72 Q 150 74 156 72 L 156 58" stroke={stroke} strokeWidth="1" />
    <path d="M 140 72 L 118 100 L 115 380" stroke={stroke} strokeWidth="1.3" />
    <path d="M 160 72 L 182 100 L 185 380" stroke={stroke} strokeWidth="1.3" />
    <path d="M 144 72 L 123 100 L 120 380" stroke={stroke} strokeWidth="0.7" opacity="0.7" strokeDasharray="2 2" />
    <path d="M 156 72 L 177 100 L 180 380" stroke={stroke} strokeWidth="0.7" opacity="0.7" strokeDasharray="2 2" />
    <path d="M 135 88 Q 150 75 165 88" stroke={stroke} strokeWidth="1.1" />
    <path d="M 140 72 L 85 86 C 50 96 30 140 22 210 C 20 220 28 225 36 220 C 55 208 85 190 115 185" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 160 72 L 215 86 C 250 96 270 140 278 210 C 280 220 272 225 264 220 C 245 208 215 190 185 185" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 115 185 C 95 245 75 315 50 382 C 48 386 52 388 58 388 L 242 388 C 248 388 252 386 250 382 C 225 315 205 245 185 185" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M 150 110 L 150 385" stroke={stroke} strokeWidth="0.8" opacity="0.4" strokeDasharray="4 4" />
    <path d="M 50 388 Q 150 391 250 388" stroke={stroke} strokeWidth="1.3" />
  </svg>
);

// 3. Najd Sadal Sketch
const NajdSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <path d="M 130 65 C 128 35 140 25 150 25 C 160 25 172 35 170 65" stroke={stroke} strokeWidth="1.2" />
    <path d="M 130 65 C 125 90 100 120 75 145 C 95 150 125 152 145 150" stroke={stroke} strokeWidth="1.1" />
    <path d="M 170 65 C 175 90 200 120 225 145 C 205 150 175 152 155 150" stroke={stroke} strokeWidth="1.1" />
    <circle cx="150" cy="132" r="3" fill={stroke} />
    <path d="M 150 135 L 148 155 M 150 135 L 152 155" stroke={stroke} strokeWidth="0.9" />
    <path d="M 125 95 C 95 105 70 125 50 165 C 46 173 52 178 60 175 C 80 168 110 160 135 158" stroke={stroke} strokeWidth="1.2" />
    <path d="M 175 95 C 205 105 230 125 250 165 C 254 173 248 178 240 175 C 220 168 190 160 165 158" stroke={stroke} strokeWidth="1.2" />
    <path d="M 135 158 C 128 220 110 295 72 382 C 70 386 74 388 80 388 L 220 388 C 226 388 230 386 228 382 C 190 295 172 220 165 158" stroke={stroke} strokeWidth="1.3" />
    <path d="M 100 260 Q 150 275 200 260" stroke={stroke} strokeWidth="1.1" opacity="0.8" />
    <path d="M 74 388 Q 150 390 226 388" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

// 4. Mirage Pleated Column Sketch
const MirageSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="40" rx="12" ry="17" stroke={stroke} strokeWidth="0.9" opacity="0.5" strokeDasharray="3 2" />
    <path d="M 145 57 L 145 70 Q 150 72 155 70 L 155 57" stroke={stroke} strokeWidth="1" />
    <path d="M 142 70 L 142 78 Q 150 82 158 78 L 158 70" stroke={stroke} strokeWidth="1.2" />
    <path d="M 142 75 C 120 78 95 90 70 120 L 58 200 C 56 206 62 210 68 206 L 90 170 C 105 160 125 155 138 152" stroke={stroke} strokeWidth="1.2" />
    <path d="M 158 75 C 180 78 205 90 230 120 L 242 200 C 244 206 238 210 232 206 L 210 170 C 195 160 175 155 162 152" stroke={stroke} strokeWidth="1.2" />
    <path d="M 138 152 L 115 385 C 114 388 118 390 122 390 L 178 390 C 182 390 186 388 185 385 L 162 152" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M 150 80 L 150 390" stroke={stroke} strokeWidth="1.1" />
    <circle cx="150" cy="98" r="1.3" fill={stroke} />
    <circle cx="150" cy="120" r="1.3" fill={stroke} />
    <circle cx="150" cy="142" r="1.3" fill={stroke} />
    <line x1="135" y1="110" x2="128" y2="388" stroke={stroke} strokeWidth="0.55" opacity="0.6" strokeDasharray="8 2" />
    <line x1="145" y1="100" x2="143" y2="388" stroke={stroke} strokeWidth="0.55" opacity="0.6" strokeDasharray="8 2" />
    <line x1="155" y1="100" x2="157" y2="388" stroke={stroke} strokeWidth="0.55" opacity="0.6" strokeDasharray="8 2" />
    <line x1="165" y1="110" x2="172" y2="388" stroke={stroke} strokeWidth="0.55" opacity="0.6" strokeDasharray="8 2" />
    <line x1="116" y1="390" x2="184" y2="390" stroke={stroke} strokeWidth="1.4" />
  </svg>
);

// 5. Yaqout Embroidered Sketch
const YaqoutSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="40" rx="13" ry="18" stroke={stroke} strokeWidth="0.9" opacity="0.5" strokeDasharray="3 2" />
    <path d="M 144 58 L 144 74 Q 150 76 156 74 L 156 58" stroke={stroke} strokeWidth="1.1" />
    {/* V-Neckline with intricate diamond stitches */}
    <path d="M 136 74 L 150 115 L 164 74" stroke={stroke} strokeWidth="1.2" />
    <polygon points="150,85 153,92 150,99 147,92" stroke={stroke} strokeWidth="0.8" fill="none" />
    <polygon points="150,102 153,109 150,116 147,109" stroke={stroke} strokeWidth="0.8" fill="none" />
    {/* Cuffs with Embroidered 8-Point Stars */}
    <path d="M 136 74 C 110 82 80 115 50 170 L 62 178 C 88 140 115 135 138 142" stroke={stroke} strokeWidth="1.2" />
    <path d="M 164 74 C 190 82 220 115 250 170 L 238 178 C 212 140 185 135 162 142" stroke={stroke} strokeWidth="1.2" />
    <rect x="46" y="162" width="18" height="12" stroke={stroke} strokeWidth="0.9" fill="none" transform="rotate(-25 46 162)" />
    <rect x="236" y="162" width="18" height="12" stroke={stroke} strokeWidth="0.9" fill="none" transform="rotate(25 236 162)" />
    {/* Body Flow */}
    <path d="M 138 142 C 132 210 112 300 78 385 L 222 385 C 188 300 168 210 162 142" stroke={stroke} strokeWidth="1.3" />
    <path d="M 150 115 L 150 385" stroke={stroke} strokeWidth="0.9" opacity="0.6" strokeDasharray="5 3" />
    <path d="M 76 385 Q 150 388 224 385" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

// 6. Rawda Soft Sadal Sketch
const RawdaSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="45" rx="18" ry="22" stroke={stroke} strokeWidth="1" />
    <path d="M 132 45 C 120 70 95 110 65 140 C 90 148 120 150 142 148" stroke={stroke} strokeWidth="1.1" />
    <path d="M 168 45 C 180 70 205 110 235 140 C 210 148 180 150 158 148" stroke={stroke} strokeWidth="1.1" />
    <path d="M 125 100 C 95 115 65 150 45 190 L 58 198 C 85 170 115 162 135 160" stroke={stroke} strokeWidth="1.2" />
    <path d="M 175 100 C 205 115 235 150 255 190 L 242 198 C 215 170 185 162 165 160" stroke={stroke} strokeWidth="1.2" />
    <path d="M 135 160 C 128 225 105 310 65 385 L 235 385 C 195 310 172 225 165 160" stroke={stroke} strokeWidth="1.3" />
    <path d="M 150 148 L 150 385" stroke={stroke} strokeWidth="0.8" opacity="0.4" strokeDasharray="4 4" />
    <path d="M 64 385 Q 150 388 236 385" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

// 7. Dunes Batwing Flow Sketch
const DunesSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="40" rx="12" ry="17" stroke={stroke} strokeWidth="0.9" opacity="0.5" strokeDasharray="3 2" />
    <path d="M 144 57 L 144 72 Q 150 74 156 72 L 156 57" stroke={stroke} strokeWidth="1" />
    {/* Wide Curved Dunes Silhouette */}
    <path d="M 144 72 C 100 80 50 120 20 180 C 45 185 85 175 125 165" stroke={stroke} strokeWidth="1.2" />
    <path d="M 156 72 C 200 80 250 120 280 180 C 255 185 215 175 175 165" stroke={stroke} strokeWidth="1.2" />
    <path d="M 125 165 C 110 230 85 310 55 385 L 245 385 C 215 310 190 230 175 165" stroke={stroke} strokeWidth="1.3" />
    <path d="M 135 170 C 130 240 110 320 90 385" stroke={stroke} strokeWidth="0.7" opacity="0.5" />
    <path d="M 165 170 C 170 240 190 320 210 385" stroke={stroke} strokeWidth="0.7" opacity="0.5" />
    <path d="M 53 385 Q 150 388 247 385" stroke={stroke} strokeWidth="1.2" />
  </svg>
);

// 8. Cordoba Royal Bisht Sketch
const CordobaSketch = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-contain">
    <ellipse cx="150" cy="38" rx="13" ry="18" stroke={stroke} strokeWidth="0.9" opacity="0.5" strokeDasharray="3 2" />
    <path d="M 144 56 L 144 70 Q 150 72 156 70 L 156 56" stroke={stroke} strokeWidth="1" />
    {/* Architectural Cordoba Neck Collar */}
    <path d="M 135 70 L 120 110 L 115 385" stroke={stroke} strokeWidth="1.3" />
    <path d="M 165 70 L 180 110 L 185 385" stroke={stroke} strokeWidth="1.3" />
    {/* Corded Braided Trim Inlay */}
    <path d="M 140 70 L 125 110 L 120 385" stroke={stroke} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
    <path d="M 160 70 L 175 110 L 180 385" stroke={stroke} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
    <circle cx="150" cy="118" r="4" stroke={stroke} strokeWidth="1" fill="none" />
    <circle cx="150" cy="118" r="1.5" fill={stroke} />
    {/* Royal Cape Sleeves */}
    <path d="M 135 70 L 70 90 C 35 110 18 160 12 230 C 25 235 55 220 95 200 L 115 195" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 165 70 L 230 90 C 265 110 282 160 288 230 C 275 235 245 220 205 200 L 185 195" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    {/* Sweeping Hem */}
    <path d="M 115 195 C 95 255 70 325 45 385 L 255 385 C 230 325 205 255 185 195" stroke={stroke} strokeWidth="1.4" />
    <path d="M 43 385 Q 150 388 257 385" stroke={stroke} strokeWidth="1.3" />
  </svg>
);

export const GarmentSketch: React.FC<GarmentSketchProps> = ({
  variant,
  className = '',
  stroke = '#5c3d2e',
}) => {
  const renderSketch = () => {
    switch (variant) {
      case 'qamar': return <QamarSketch stroke={stroke} />;
      case 'andalusian': return <AndalusianSketch stroke={stroke} />;
      case 'najd': return <NajdSketch stroke={stroke} />;
      case 'mirage': return <MirageSketch stroke={stroke} />;
      case 'yaqout': return <YaqoutSketch stroke={stroke} />;
      case 'rawda': return <RawdaSketch stroke={stroke} />;
      case 'dunes': return <DunesSketch stroke={stroke} />;
      case 'cordoba': return <CordobaSketch stroke={stroke} />;
      default: return <QamarSketch stroke={stroke} />;
    }
  };

  return <div className={`w-full h-full flex items-center justify-center ${className}`}>{renderSketch()}</div>;
};
