import React, { useState } from 'react';
import { ShieldCheck, FileCode, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { EvidenceProvenance } from '../api/types';
import { formatConfidencePercent, formatIsoDate } from '../utils/formatters';

interface EvidenceIndicatorProps {
  provenance: EvidenceProvenance;
  sourceText?: string;
  compact?: boolean;
}

export const EvidenceIndicator: React.FC<EvidenceIndicatorProps> = ({
  provenance,
  sourceText,
  compact = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSourceIcon = (type: EvidenceProvenance['sourceType']) => {
    switch (type) {
      case 'repo_config':
      case 'package_manifest':
        return <FileCode className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />;
      case 'manual_audit':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />;
      case 'synthetic_fixture':
        return <Info className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />;
    }
  };

  const confidencePct = formatConfidencePercent(provenance.confidence);
  const isHighConfidence = provenance.confidence >= 0.9;
  const isSynthetic = provenance.sourceType === 'synthetic_fixture';

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        className={`group inline-flex items-center gap-1.5 rounded border border-slate-700/70 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 px-2 py-0.5 text-xs text-slate-300 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500`}
        title="Click to view evidence verification audit details"
      >
        {getSourceIcon(provenance.sourceType)}
        <span className="font-mono text-[11px] max-w-[140px] truncate">
          {sourceText || provenance.sourceName}
        </span>
        <span
          className={`font-mono text-[10px] px-1 py-0.2 rounded font-semibold ${
            isSynthetic
              ? 'bg-amber-950/80 text-amber-300'
              : isHighConfidence
              ? 'bg-emerald-950/80 text-emerald-300'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {isSynthetic ? 'SYNTHETIC' : confidencePct}
        </span>
      </button>

      {showDetails && (
        <div
          role="dialog"
          aria-label="Evidence details"
          className="absolute left-0 mt-1.5 w-72 z-40 rounded-md border border-slate-700 bg-slate-900 p-3 shadow-xl backdrop-blur text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Evidence Provenance
            </span>
            <button
              onClick={() => setShowDetails(false)}
              className="text-slate-400 hover:text-slate-200 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Source Type:</span>
              <span className="text-slate-200">{provenance.sourceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Source Name:</span>
              <span className="text-cyan-300 truncate max-w-[150px]">{provenance.sourceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Confidence:</span>
              <span className={isHighConfidence ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {confidencePct}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verified At:</span>
              <span className="text-slate-300">{formatIsoDate(provenance.verifiedAt)}</span>
            </div>
            {provenance.notes && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 font-sans italic">
                "{provenance.notes}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
