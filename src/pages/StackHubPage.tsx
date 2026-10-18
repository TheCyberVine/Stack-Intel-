import React, { useState, useMemo } from 'react';
import {
  Layers,
  Filter,
  DollarSign,
  AlertTriangle,
  Shield,
  SearchCode,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  GitBranch,
  HelpCircle,
  FileQuestion,
  Scale
} from 'lucide-react';
import {
  StackToolItem,
  CompanyGoal,
  ApiError,
  DataMode
} from '../api/types';
import { Card, PanelHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/normalizers';

interface StackHubPageProps {
  tools: StackToolItem[];
  goals: CompanyGoal[];
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  mode: DataMode;
  searchQuery: string;
  onLaunchInvestigation: (toolId: string) => void;
}

export const StackHubPage: React.FC<StackHubPageProps> = ({
  tools,
  goals,
  loading,
  error,
  onRetry,
  mode,
  searchQuery,
  onLaunchInvestigation
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comparison'>('details');

  // Filtered tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.role.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.evidence.toLowerCase().includes(q)
      );
    });
  }, [tools, searchQuery]);

  // Selected tool for inspector
  const activeTool = useMemo(() => {
    if (!selectedToolId && filteredTools.length > 0) {
      return filteredTools[0];
    }
    return filteredTools.find((t) => t.id === selectedToolId) || filteredTools[0] || null;
  }, [filteredTools, selectedToolId]);

  // Goals explicitly supported by active tool
  const explicitlyLinkedGoals = useMemo(() => {
    if (!activeTool || !activeTool.explicitlySupportedGoalIds) return [];
    return goals.filter((g) => activeTool.explicitlySupportedGoalIds?.includes(g.id));
  }, [activeTool, goals]);

  if (loading) {
    return (
      <LoadingState
        message="Loading StackHub inventory..."
        subtext="Accessing configured tool records, constraints, and operational roles."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        title="StackHub Integration Error"
        contextText="In live mode, network failures and unavailable backend capabilities are reported honestly without fake fallback."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Scope & Philosophy Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">StackHub Workspace</span>
            <span className="text-slate-400 ml-2">
              Understanding the current operational stack — not a vendor marketplace.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {tools.length} verified {tools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>
      </div>

      {/* Main Two-Column Split: Tool List (5 cols) + Detailed Inspector & Comparison (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Tools (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase text-slate-400">
              Configured Tools ({filteredTools.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Total: {formatCurrency(tools.reduce((sum, t) => sum + t.monthlyCost, 0))} / mo
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <Card>
              <EmptyState
                title="No tools match filter"
                description="Try clearing search query to see the verified tool inventory."
              />
            </Card>
          ) : (
            filteredTools.map((tool) => {
              const isSelected = activeTool?.id === tool.id;
              return (
                <div
                  key={tool.id}
                  data-testid={`tool-item-${tool.id}`}
                  onClick={() => {
                    setSelectedToolId(tool.id);
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/95 border-cyan-500 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-100 font-sans">
                        {tool.name}
                      </span>
                      <Badge tone="cyan" size="sm">
                        {tool.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-cyan-300">
                        {formatCurrency(tool.monthlyCost, tool.currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">/ mo</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {tool.role}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[200px]">
                      {tool.missingInformation?.length || 0} unknowns flagged
                    </span>
                    <span className="text-cyan-400 inline-flex items-center gap-1">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Comparison Pane (7 Cols) */}
        <div className="lg:col-span-7">
          {activeTool ? (
            <Card className="border-slate-800 bg-slate-900/90">
              {/* Header with Title and Listed Cost */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-100 font-sans">
                      {activeTool.name}
                    </h3>
                    <Badge tone="cyan">
                      {activeTool.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeTool.role}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right sm:text-right">
                    <div className="text-xl font-bold font-mono text-cyan-300">
                      {formatCurrency(activeTool.monthlyCost, activeTool.currency)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      listed monthly cost
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspector Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'details'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  Tool Intelligence & Constraints
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'comparison'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  Architecture Comparison & Alternatives
                </button>
              </div>

              {/* TAB 1: TOOL DETAILS, EVIDENCE & CONSTRAINTS */}
              {activeTab === 'details' && (
                <div className="space-y-5 text-xs">
                  {/* Evidence Citation */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      Documented Evidence & Source
                    </h4>
                    <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300">
                      {activeTool.evidence}
                    </div>
                  </div>

                  {/* Explicitly Supported Goals */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Explicitly Supported Strategic Goals
                    </h4>
                    {explicitlyLinkedGoals.length > 0 ? (
                      <div className="space-y-2">
                        {explicitlyLinkedGoals.map((g) => (
                          <div
                            key={g.id}
                            className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/50 text-slate-200 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <div>
                              <span className="font-semibold">{g.title}:</span>{' '}
                              <span className="text-slate-300">{g.description}</span>
                              {g.metric && (
                                <div className="text-[10px] font-mono text-emerald-300 mt-1">
                                  Metric: {g.metric}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded bg-slate-950/40 border border-slate-800 text-slate-400 italic">
                        No direct explicit relationship mapped to company goals in current graph data.
                      </div>
                    )}
                  </div>

                  {/* Known Constraints */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Operational Constraints
                    </h4>
                    {activeTool.constraints && activeTool.constraints.length > 0 ? (
                      <ul className="space-y-1.5">
                        {activeTool.constraints.map((c, idx) => (
                          <li
                            key={idx}
                            className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 text-slate-400 italic">
                        No specific operational constraints documented for this tool.
                      </div>
                    )}
                  </div>

                  {/* Known Dependencies */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                      Known Architectural Dependencies
                    </h4>
                    {activeTool.knownDependencies && activeTool.knownDependencies.length > 0 ? (
                      <ul className="space-y-1.5">
                        {activeTool.knownDependencies.map((dep, idx) => (
                          <li
                            key={idx}
                            className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            <span>{dep}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 text-slate-400 italic">
                        No explicit downstream dependencies recorded in graph.
                      </div>
                    )}
                  </div>

                  {/* Missing Information / Unknowns (Transparent Honesty) */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <FileQuestion className="w-3.5 h-3.5 text-rose-400" />
                      Missing Information & Telemetry Gaps
                    </h4>
                    {activeTool.missingInformation && activeTool.missingInformation.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeTool.missingInformation.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded bg-rose-950/20 border border-rose-900/40 text-rose-300/90 flex items-start gap-2"
                          >
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-slate-400 italic">
                        All standard attributes verified.
                      </div>
                    )}
                  </div>

                  {/* Action Button: Launch Investigation on this tool */}
                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onLaunchInvestigation(activeTool.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold font-mono text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                    >
                      <SearchCode className="w-3.5 h-3.5" />
                      Launch Investigation on {activeTool.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ARCHITECTURE COMPARISON & ALTERNATIVES */}
              {activeTab === 'comparison' && (
                <div className="space-y-6 text-xs">
                  {/* Philosophy Note */}
                  <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 leading-relaxed text-[11px]">
                    <span className="text-slate-200 font-semibold font-mono">
                      Architectural Comparison Grounding:
                    </span>{' '}
                    Stack Intel does not assume existing tools are wasteful or should be replaced. Retaining the current verified configuration is a primary, legitimate option with zero migration disruption.
                  </div>

                  {activeTool.comparison ? (
                    <div className="space-y-5">
                      {/* Retaining Current Configuration Card */}
                      <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-100 font-sans flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {activeTool.comparison.currentConfig.name}
                          </span>
                          <span className="font-mono text-xs font-semibold text-cyan-300">
                            {formatCurrency(activeTool.comparison.currentConfig.monthlyCost)} / mo
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed">
                          {activeTool.comparison.currentConfig.rationale}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                          <div className="space-y-1.5">
                            <span className="font-mono text-[10px] uppercase text-emerald-400 font-semibold">
                              Advantages
                            </span>
                            {activeTool.comparison.currentConfig.advantages.map((adv, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{adv}</span>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1.5">
                            <span className="font-mono text-[10px] uppercase text-amber-400 font-semibold">
                              Tradeoffs & Risks
                            </span>
                            {activeTool.comparison.currentConfig.tradeoffs.map((t, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                                <span className="text-amber-400 shrink-0">▲</span>
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Alternatives Considered */}
                      <div>
                        <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                          Evaluated Alternatives Alongside Current Setup
                        </h4>

                        <div className="space-y-3">
                          {activeTool.comparison.alternatives.map((alt, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-100 font-sans">
                                  {alt.name}
                                </span>
                                {alt.estimatedCostRange && (
                                  <span className="font-mono text-xs text-cyan-300">
                                    Est: {alt.estimatedCostRange}
                                  </span>
                                )}
                              </div>

                              <p className="text-slate-300 leading-relaxed text-xs">
                                {alt.overview}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                                <div className="space-y-1 text-slate-400">
                                  <span className="font-mono text-[10px] uppercase text-slate-400">
                                    Tradeoffs & Constraints:
                                  </span>
                                  {alt.tradeoffs.map((t, tIdx) => (
                                    <div key={tIdx} className="text-slate-300">
                                      - {t}
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-1 text-slate-400">
                                  <span className="font-mono text-[10px] uppercase text-rose-400">
                                    Identified Risks & Unknowns:
                                  </span>
                                  {alt.risks.map((r, rIdx) => (
                                    <div key={rIdx} className="text-rose-300/90">
                                      - {r}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex justify-between items-center">
                                <span>Evidence Basis: {alt.evidenceAvailable}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40 text-slate-400">
                      <HelpCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">
                        No Alternatives Comparison Data
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        The live API does not provide comparison records for this component. In accordance with scope guidelines, unsupported alternatives and vendor discounts are not fabricated.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <EmptyState
                title="Select a tool to inspect"
                description="Click any tool on the left to examine listed costs, strategic goal support, operational constraints, and architectural comparisons."
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
