import React from 'react';
import { ArrowRight, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { RelationshipPathData, RelationshipNodeType } from '../api/types';
import { getRelationshipStatusDetails } from '../utils/investigations';

interface RelationshipPathProps {
  data?: RelationshipPathData;
  className?: string;
  isLiveApiUnavailable?: boolean;
}

export const RelationshipPath: React.FC<RelationshipPathProps> = ({
  data,
  className = '',
  isLiveApiUnavailable = false
}) => {
  if (isLiveApiUnavailable) {
    return (
      <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono text-slate-300 font-semibold mb-1">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Relationship Graph Paths Unavailable in Live API
        </div>
        <p className="leading-relaxed">
          The confirmed backend API currently returns flat entity representations. Graph traversal paths across (:Company)-[:HAS_GOAL]&rarr;(:Opportunity)-[:REQUIRES]&rarr;(:Evidence) are not yet exposed as relational edge objects. Stack Intel does not fabricate artificial graph data.
        </p>
      </div>
    );
  }

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs text-slate-400 italic">
        No graph relationship traversal path recorded for this investigation.
      </div>
    );
  }

  const getNodeTypeBadge = (type: RelationshipNodeType) => {
    switch (type) {
      case 'company':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'goal':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'opportunity':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'requirement':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'evidence':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'assessment':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with Synthetic Disclaimer when in demo mode */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wide">
          Graph Traversal Path
        </span>
        {data.isSynthetic && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
            SYNTHETIC GRAPH PATH (DEMO)
          </span>
        )}
      </div>

      {/* Desktop / Tablet Flow (Horizontally wrapping cards connected by edge badges) */}
      <div className="hidden md:flex items-center flex-wrap gap-2 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs">
        {data.nodes.map((node, idx) => {
          const edgeToNext = data.edges.find((e) => e.from === node.id);
          const typeClass = getNodeTypeBadge(node.type);

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div className="flex flex-col p-2.5 rounded bg-slate-900 border border-slate-700/80 min-w-[130px] max-w-[200px] shadow-xs">
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border w-fit mb-1 font-semibold ${typeClass}`}>
                  {node.type}
                </span>
                <span className="font-semibold text-slate-100 text-xs truncate font-sans">
                  {node.label}
                </span>
                {node.subtext && (
                  <span className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {node.subtext}
                  </span>
                )}
              </div>

              {/* Edge Connecting To Next Node */}
              {edgeToNext && idx < data.nodes.length - 1 && (
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 px-1 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded border ${
                    edgeToNext.relationshipStatus === 'confirmed'
                      ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                      : edgeToNext.relationshipStatus === 'candidate'
                      ? 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {edgeToNext.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Flow: Clean vertical timeline ladder for readable mobile viewports */}
      <div className="md:hidden space-y-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
        {data.nodes.map((node, idx) => {
          const edgeToNext = data.edges.find((e) => e.from === node.id);
          const typeClass = getNodeTypeBadge(node.type);

          return (
            <div key={node.id} className="relative pl-6 pb-2 border-l border-slate-800 last:border-l-0 last:pb-0">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-cyan-400" />
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${typeClass}`}>
                    {node.type}
                  </span>
                  <span className="font-semibold text-slate-100 text-xs truncate">
                    {node.label}
                  </span>
                </div>
                {node.subtext && (
                  <p className="text-[10px] text-slate-400 font-mono">
                    {node.subtext}
                  </p>
                )}
              </div>

              {edgeToNext && (
                <div className="my-1.5 text-[10px] font-mono text-cyan-400 flex items-center gap-1 pl-2">
                  <span>↓ {edgeToNext.label}</span>
                  <span className="text-[9px] text-slate-500 font-normal">
                    ({edgeToNext.relationshipStatus})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
