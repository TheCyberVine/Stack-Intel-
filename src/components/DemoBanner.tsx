import React from 'react';
import { AlertCircle, Radio, ArrowRight, Check } from 'lucide-react';
import { DataMode } from '../api/types';

interface DemoBannerProps {
  mode: DataMode;
  onToggleMode: (mode: DataMode) => void;
  apiBaseUrl: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  mode,
  onToggleMode,
  apiBaseUrl
}) => {
  if (mode === 'live') {
    return (
      <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 text-xs text-emerald-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide">LIVE API MODE</span>
            <span className="text-emerald-400/80 hidden sm:inline">—</span>
            <span className="text-emerald-300/80 hidden sm:inline">
              Connected to backend at <code className="font-mono text-emerald-200 bg-emerald-900/60 px-1 py-0.5 rounded">{apiBaseUrl}</code>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400/70 hidden md:inline">
              Only verified API routes are queried. No silent fixture fallbacks.
            </span>
            <button
              type="button"
              onClick={() => onToggleMode('demo')}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition-colors"
            >
              Switch to Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Demo mode notice"
      className="bg-amber-950/90 border-b border-amber-700/80 px-4 py-2 text-xs text-amber-200 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <div>
            <span className="font-semibold tracking-wider font-mono uppercase bg-amber-900/80 px-1.5 py-0.5 rounded border border-amber-600/70 text-amber-100 mr-2 text-[11px]">
              DEMO MODE
            </span>
            <span className="font-medium">Fixture data, not from the live API.</span>
            <span className="text-amber-300/70 hidden sm:inline ml-2 text-[11px]">
              Synthetic intelligence fixtures for evaluation and UI layout verification.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-amber-400/80 font-mono hidden lg:inline">
            FalkorDB / FastAPI: Offline simulation
          </span>
          <button
            type="button"
            onClick={() => onToggleMode('live')}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium font-mono px-2.5 py-1 rounded bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600 transition-colors focus:ring-1 focus:ring-amber-400"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            Switch to Live API
          </button>
        </div>
      </div>
    </aside>
  );
};
