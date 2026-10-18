import React from 'react';

interface StackIntelLogoProps {
  className?: string;
  size?: number;
}

/**
 * Stack Intel Geometric 3D Isometric "S" Logo
 * Faithfully matches the brand icon: isometric wireframe S with electric blue-to-cyan gradient
 */
export const StackIntelLogo: React.FC<StackIntelLogoProps> = ({
  className = 'w-8 h-8',
  size
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Stack Intel Logo"
    >
      <defs>
        <linearGradient id="stackIntelLogoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="stackIntelLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#38bdf8" floodOpacity="0.3" />
        </filter>
      </defs>

      <g
        filter="url(#stackIntelLogoGlow)"
        stroke="url(#stackIntelLogoGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top Chevron Roof: from left through apex to top-right */}
        <path d="M 28 34 L 50 21.5 L 72 34" />

        {/* Top-Right Isometric Block: outer vertical, bottom slanted, inner vertical */}
        <path d="M 72 34 L 72 50 L 52 38.5 L 52 22.8" />

        {/* Central Isometric "S" Diagonal Beam */}
        <path d="M 28 34 L 72 59.5" />
        <path d="M 28 45.5 L 72 71" />

        {/* Bottom-Left Isometric Block: outer vertical, top slanted, inner vertical */}
        <path d="M 28 50 L 28 66 L 48 77.2 L 48 61.5" />

        {/* Bottom Chevron Floor: from bottom-left through bottom apex to bottom-right */}
        <path d="M 28 66 L 50 78.5 L 72 66" />
      </g>
    </svg>
  );
};
