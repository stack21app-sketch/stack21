'use client';

import React from 'react';

interface ChipsRowProps {
  items: string[];
  onChipClick?: (item: string) => void;
  className?: string;
}

const pastelColors = [
  'bg-[var(--pastel-blue)]',
  'bg-[var(--pastel-green)]',
  'bg-[var(--pastel-yellow)]',
  'bg-[var(--pastel-pink)]',
  'bg-[var(--pastel-purple)]',
  'bg-[var(--pastel-orange)]',
  'bg-[var(--pastel-cyan)]',
  'bg-[var(--pastel-indigo)]'
];

const hoverColors = [
  'hover:bg-[var(--pastel-green)]',
  'hover:bg-[var(--pastel-yellow)]',
  'hover:bg-[var(--pastel-pink)]',
  'hover:bg-[var(--pastel-purple)]',
  'hover:bg-[var(--pastel-orange)]',
  'hover:bg-[var(--pastel-cyan)]',
  'hover:bg-[var(--pastel-indigo)]',
  'hover:bg-[var(--pastel-blue)]'
];

export function ChipsRow({ items, onChipClick, className = '' }: ChipsRowProps) {
  return (
    <div className={`flex overflow-x-auto no-scrollbar py-2 ${className}`}>
      {items.map((text, idx) => {
        const colorIndex = idx % pastelColors.length;
        return (
          <div 
            key={idx} 
            onClick={() => onChipClick?.(text)}
            className={`mr-3 mb-2 inline-flex items-center px-4 py-2 rounded-full ${pastelColors[colorIndex]} ${hoverColors[colorIndex]} text-sm font-medium text-[var(--text)] transition-all duration-300 cursor-pointer select-none hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50 active:scale-95 transform-gpu`}
            style={{
              animationDelay: `${idx * 0.1}s`,
              animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          >
            <span className="relative z-10">{text}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-green-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        );
      })}
    </div>
  );
}
