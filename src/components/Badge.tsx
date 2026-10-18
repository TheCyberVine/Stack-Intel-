import React from 'react';
import { getStatusDetails } from '../utils/formatters';

interface BadgeProps {
  status?: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'cyan';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  tone,
  children,
  size = 'sm',
  className = '',
  showIcon = true
}) => {
  let computedTone = tone;
  let label = children;
  let symbol = '●';

  if (status) {
    const details = getStatusDetails(status);
    if (!computedTone) computedTone = details.tone;
    if (!label) label = details.label;
    symbol = details.accessibleSymbol;
  }

  const toneClasses: Record<string, string> = {
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    info: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
  };

  const currentToneClass = toneClasses[computedTone || 'neutral'];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md font-mono tracking-tight ${sizeClasses} ${currentToneClass} ${className}`}
    >
      {showIcon && (
        <span aria-hidden="true" className="text-[10px] opacity-80 select-none">
          {symbol}
        </span>
      )}
      <span>{label}</span>
    </span>
  );
};
