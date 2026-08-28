import React from 'react';

// Elegant SVG Gunungan / Wayang Symbolism for Modern Javanese Heritage branding
export function GununganIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Gunungan Silhouette */}
      <path
        d="M50 8C50 8 78 42 78 72C78 92 68 102 50 108C32 102 22 92 22 72C22 42 50 8 50 8Z"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tree of Life (Pohon Hayat) Central Stem */}
      <path
        d="M50 24V102"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Branches */}
      <path
        d="M50 45C60 40 68 46 70 54M50 62C62 58 72 65 74 74M50 78C60 76 68 82 69 88"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 45C40 40 32 46 30 54M50 62C38 58 28 65 26 74M50 78C40 76 32 82 31 88"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Base Gapura Gate */}
      <path
        d="M42 108V94H58V108"
        stroke={color}
        strokeWidth="2"
      />
      {/* Top Pinnacle */}
      <circle cx="50" cy="8" r="3" fill={color} />
    </svg>
  );
}

export function JavanesePatternDivider({ className = 'w-full my-8' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C26B38]/30 to-[#C26B38]/60" />
      <div className="flex items-center gap-1.5 text-[#C26B38]">
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C26B38]/60" />
        <GununganIcon className="w-5 h-6 text-[#C26B38]" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C26B38]/60" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C26B38]/30 to-[#C26B38]/60" />
    </div>
  );
}
