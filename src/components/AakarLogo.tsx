import React from 'react';

interface AakarLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const AakarLogo: React.FC<AakarLogoProps> = ({
  className = 'w-12 h-12',
  size,
  showText = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`} style={style}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Aakar Computer Institute Kurla East Since 2008 Official Logo"
      >
        <defs>
          {/* Left Teal-Cyan-Green Arc Gradient */}
          <linearGradient id="aakarLeftArc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Right Blue-Indigo-Purple Arc Gradient */}
          <linearGradient id="aakarRightArc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Path for 'Since 2008' along top-right inner curve */}
          <path
            id="since2008Path"
            d="M 85,34 A 74,74 0 0,1 164,88"
            fill="none"
          />
        </defs>

        {/* Clean White Inner Badge Canvas */}
        <circle cx="100" cy="100" r="88" fill="#ffffff" />

        {/* Left Ring Segment (Teal/Emerald) */}
        <path
          d="M 100,10 A 90,90 0 0,0 100,190"
          fill="none"
          stroke="url(#aakarLeftArc)"
          strokeWidth="15"
          strokeLinecap="butt"
        />

        {/* Right Ring Segment (Blue/Purple) */}
        <path
          d="M 100,10 A 90,90 0 0,1 100,190"
          fill="none"
          stroke="url(#aakarRightArc)"
          strokeWidth="15"
          strokeLinecap="butt"
        />

        {/* Since 2008 Text along upper curve */}
        <text fill="#1e293b" fontSize="12.5" fontWeight="800" letterSpacing="0.8">
          <textPath href="#since2008Path" startOffset="48%" textAnchor="middle">
            Since 2008
          </textPath>
        </text>

        {/* Center Group: Red Triangle & 'Aakar' */}
        <g id="aakar-brand-center">
          {/* Official Red Triangle Emblem */}
          <g transform="translate(42, 73)">
            {/* Outer Triangle */}
            <polygon
              points="16,3 32,32 0,32"
              fill="#e11d48"
              stroke="#be123c"
              strokeWidth="1"
            />
            {/* Inner White Cutout */}
            <polygon
              points="16,13 25,29 7,29"
              fill="#ffffff"
            />
          </g>

          {/* 'Aakar' Wordmark in Rich Red - Increased size for prominent front page branding */}
          <text
            x="78"
            y="108"
            fill="#dc2626"
            fontSize="36"
            fontWeight="950"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="-1"
          >
            Aakar
          </text>
        </g>

        {/* Deep Navy Blue Bar: 'AAKAR COMPUTER INSTITUTE' */}
        <rect
          x="38"
          y="114"
          width="124"
          height="12"
          rx="2"
          fill="#172554"
        />
        <text
          x="100"
          y="123"
          fill="#ffffff"
          fontSize="6.6"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          letterSpacing="0.9"
        >
          AAKAR COMPUTER INSTITUTE
        </text>

        {/* Tagline: 'Shape Your Career' */}
        <text
          x="100"
          y="133.5"
          fill="#475569"
          fontSize="6.5"
          fontStyle="italic"
          fontFamily="Georgia, serif"
          textAnchor="middle"
          letterSpacing="0.3"
        >
          “Shape Your Career”
        </text>

        {/* 'Kurla East' Bold Anchor at bottom */}
        <text
          x="100"
          y="155"
          fill="#0f172a"
          fontSize="15"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          Kurla East
        </text>
      </svg>
    </div>
  );
};
