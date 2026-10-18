import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Retrieving graph intelligence...',
  subtext = 'Querying confirmed API endpoint and verifying node telemetry.',
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 py-4 px-3 text-slate-400 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/40">
      <div className="p-3 bg-slate-800/80 rounded-full mb-3 text-cyan-400 ring-1 ring-slate-700">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{message}</h4>
      {subtext && <p className="text-xs text-slate-400 mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
};
