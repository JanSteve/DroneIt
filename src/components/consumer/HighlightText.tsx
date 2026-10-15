// src/components/consumer/HighlightText.tsx
// Regex-safe keyword search text highlight utility

import React from 'react';

export interface HighlightTextProps {
  text: string;
  query: string;
  highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  highlightClassName = 'bg-emerald-500/30 text-emerald-300 font-semibold px-0.5 rounded',
}) => {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark key={idx} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
};
