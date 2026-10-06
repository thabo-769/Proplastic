import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = "h-10", variant = 'light' }: LogoProps) {
  const primaryColor = variant === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Exact Proplastics Logo Replication */}
      <svg viewBox="0 0 240 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        {/* Left overlapping circles icon */}
        <g transform="translate(2, 2)">
          {/* First circle (black or white outline depending on variant) */}
          <circle cx="28" cy="32" r="26" stroke={primaryColor} strokeWidth="5" fill="none" />
          <text x="18" y="40" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold" fontSize="26" fill={primaryColor}>Pr</text>
          
          {/* Second overlapping circle (red with white center) */}
          <circle cx="68" cy="32" r="22" fill="#E60000" stroke={primaryColor} strokeWidth="3" />
          <circle cx="68" cy="32" r="14" fill="#FFFFFF" />
          <text x="59" y="40" fontFamily="sans-serif" fontWeight="bold" fontSize="24" fill="#E60000">O</text>
          
          {/* ® symbol */}
          <circle cx="89" cy="18" r="5" stroke={primaryColor} strokeWidth="1.2" fill="none" />
          <text x="86.5" y="21.5" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill={primaryColor}>R</text>
        </g>

        {/* 'plastics' text in red */}
        <text x="102" y="42" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="34" fill="#E60000" letterSpacing="-0.5">plastics</text>

        {/* 'Pipe Systems That Last' tagline */}
        <text x="103" y="62" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="11" fill={primaryColor} letterSpacing="0.2">Pipe Systems That Last</text>
      </svg>
    </div>
  );
}
