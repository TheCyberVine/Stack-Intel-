import React, { useState } from 'react';
import {
  Brain,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  Shield,
  Layers,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Play,
  BookOpen,
  History,
  FileText,
  Info,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  DecisionRecord,
  DecisionStatus,
  MemoryEvent,
  PlaybookItem,
  ApiError,
  DataMode
} from '../api/types';
import { Card, PanelHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { EvidenceIndicator } from '../components/EvidenceIndicator';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { formatIsoDate, getStatusDetails, isValidHttpUrl } from '../utils/formatters';

interface DecisionsMemoryPageProps {
  decisions: DecisionRecord[];
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  mode: DataMode;
  searchQuery: string;
  memoryEvents?: MemoryEvent[];
  memoryLoading?: boolean;
  memoryError?: ApiError | null;
  playbooks?: PlaybookItem[];
  playbooksLoading?: boolean;
  playbooksError?: ApiError | null;
  onUpdateDecisionStatus?: (decisionId: string, newStatus: DecisionStatus, note: string) => void;
  onResetDecisions?: () => void;
}

export const DecisionsMemoryPage: React.FC<DecisionsMemoryPageProps> = ({
  decisions,
  loading,
  error,
  onRetry,
  mode,
  searchQuery,
  memoryEvents = [],
  memoryLoading = false,
  memoryError = null,
  playbooks = [],
  playbooksLoading = false,
  playbooksError = null,
  onUpdateDecisionStatus,
  onResetDecisions
}) => {
  const [activeTab, setActiveTab] = useState<'adrs' | 'memory' | 'playbooks'>('adrs');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  // Filter decisions based on search query and status filter
  const filteredDecisions = decisions.filter((d) => {
    const matchesFilter = statusFilter === 'all' || d.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const matchesSearch =
      d.code.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.context.toLowerCase().includes(q) ||
      d.decision.toLowerCase().includes(q) ||
      d.affectedComponents.some((c) => c.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const activeDecision =
    filteredDecisions.find((d) => d.id === selectedDecisionId) ||
    filteredDecisions[0] ||
    null;

  // Filter memory events
  const filteredMemoryEvents = memoryEvents.filter((ev) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      ev.summary.toLowerCase().includes(q) ||
      ev.eventType.toLowerCase().includes(q) ||
      (ev.details && ev.details.toLowerCase().includes(q)) ||
      (ev.relatedDecisionCode && ev.relatedDecisionCode.toLowerCase().includes(q)) ||
      (ev.relatedToolId && ev.relatedToolId.toLowerCase().includes(q))
    );
  });

  // Filter playbooks
  const filteredPlaybooks = playbooks.filter((pb) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      pb.code.toLowerCase().includes(q) ||
      pb.title.toLowerCase().includes(q) ||
      pb.triggerCondition.toLowerCase().includes(q) ||
      pb.steps.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleSimulateStatusChange = (newStatus: DecisionStatus, note: string) => {
    if (!activeDecision) return;
    if (onUpdateDecisionStatus) {
      onUpdateDecisionStatus(activeDecision.id, newStatus, note);
    }
    setSimulatedFeedback(`Simulated transition to ${getStatusDetails(newStatus).label}.`);
    setTimeout(() => setSimulatedFeedback(null), 4000);
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading decisions & institutional memory..."
        subtext="Querying architectural decision records and provenance graphs."
      />
    );
  }

  if (error && mode === 'live') {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        title="Decisions & Memory Endpoint Unavailable"
        contextText="GET /companies/{company_id}/decisions is unconfirmed in the current FastAPI backend contract. In live mode, this dependency is reported honestly rather than fabricating fake backend responses. Switch to Demo Mode to explore the interactive decision lifecycle."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Overview Banner with Tab Navigation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 text-sm">
                  Decisions, Memory & Operational Governance
                </span>
                {mode === 'demo' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[10px] font-mono">
                    DEMO FIXTURE
                  </span>
                )}
              </div>
              <p className="text-slate-400 mt-0.5">
                Traceable Architectural Decision Records (ADRs), immutable event memory, and human-approval playbooks.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Contract: {mode === 'live' ? 'Live Backend Query' : 'Simulated ADR Fixtures'}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('adrs')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'adrs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Architectural Decisions ({decisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'memory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Memory Timeline ({memoryEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('playbooks')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'playbooks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Governance Playbooks ({playbooks.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ARCHITECTURAL DECISIONS (ADRs) */}
      {activeTab === 'adrs' && (
        <div className="space-y-4">
          {/* Status Integrity Banner (Explicit Part 4 requirement: non-interchangeability) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3.5 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">
                Decision Status Integrity & Governance Boundary
              </span>
              <p className="text-slate-400 leading-relaxed">
                In Stack Intel, statuses are strictly non-interchangeable: <span className="text-indigo-300 font-mono">Approved</span> means ratified by architecture leads but <strong>not yet executed</strong>. <span className="text-cyan-300 font-mono">Executed</span> means deployed to infrastructure but <strong>outcome unverified</strong>. <span className="text-emerald-300 font-mono">Outcome Verified</span> requires empirical metrics proving the operational objective was achieved.
              </p>
            </div>
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-mono text-[11px] mr-1">Status:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'draft', label: 'Draft' },
                { id: 'awaiting_approval', label: 'Awaiting Approval' },
                { id: 'approved', label: 'Approved' },
                { id: 'executed', label: 'Executed' },
                { id: 'outcome_verified', label: 'Outcome Verified' },
                { id: 'rejected', label: 'Rejected' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/60 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {mode === 'demo' && onResetDecisions && (
              <button
                onClick={onResetDecisions}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 px-2 py-1 rounded border border-slate-800 cursor-pointer"
                title="Reset local simulation back to default fixture state"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>

          {/* Two Column Layout: ADR List + Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-mono uppercase text-slate-400">
                  Decision Records ({filteredDecisions.length})
                </h3>
              </div>

              {filteredDecisions.length === 0 ? (
                <Card>
                  <EmptyState
                    title="No decisions found"
                    description="No architectural decision records match the current filter query."
                  />
                </Card>
              ) : (
                filteredDecisions.map((dec) => {
                  const isSelected = activeDecision?.id === dec.id;
                  return (
                    <div
                      key={dec.id}
                      onClick={() => setSelectedDecisionId(dec.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-500/80 shadow-sm'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {dec.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {dec.isLocallySimulated && (
                            <span className="text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/60 px-1 py-0.5 rounded">
                              SIMULATED
                            </span>
                          )}
                          <Badge status={dec.status} size="sm" />
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 line-clamp-1 mb-1 font-sans">
                        {dec.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {dec.decision}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="text-slate-400 truncate max-w-[150px]">
                          {dec.authors[0]}
                        </span>
                        <span>{formatIsoDate(dec.date)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Detail Pane (7 cols) */}
            <div className="lg:col-span-7">
              {activeDecision ? (
                <Card className="border-slate-800">
                  <PanelHeader
                    title={`${activeDecision.code}: ${activeDecision.title}`}
                    subtitle={`Date: ${formatIsoDate(activeDecision.date)} • Authors: ${activeDecision.authors.join(', ')}`}
                    icon={<Brain className="w-4 h-4 text-cyan-400" />}
                    tag={
                      <div className="flex items-center gap-2">
                        {activeDecision.isLocallySimulated && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/70">
                            LOCAL SIMULATION
                          </span>
                        )}
                        <Badge status={activeDecision.status} />
                      </div>
                    }
                  />

                  <div className="space-y-5 text-xs">
                    {/* Simulated banner if local interaction has occurred */}
                    {activeDecision.isLocallySimulated && (
                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-amber-200/90 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-amber-300">
                            Simulated Local State (Demo Only)
                          </span>
                          <p className="mt-0.5 text-amber-200/80 text-[11px] leading-relaxed">
                            {activeDecision.simulatedActionNote || 'Status transitioned in local browser state. This action is NOT persisted to backend or FalkorDB.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Interactive Simulation Controls in Demo Mode */}
                    {mode === 'demo' && (
                      <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Simulate Operational Lifecycle Transition</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Demo Mode Only
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Test workflow states without backend side effects. Changes remain isolated to this browser session.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {activeDecision.status === 'draft' && (
                            <button
                              onClick={() =>
                                handleSimulateStatusChange(
                                  'awaiting_approval',
                                  'Submitted draft ADR to Architecture Review Board for formal review.'
                                )
                              }
                              className="px-2.5 py-1.5 rounded bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700/70 font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                            >
                              <Clock className="w-3 h-3 text-amber-300" />
                              <span>Submit for Approval</span>
                            </button>
                          )}

                          {activeDecision.status === 'awaiting_approval' && (
                            <>
                              <button
                                onClick={() =>
                                  handleSimulateStatusChange(
                                    'approved',
                                    'Approved by Head of Engineering. Awaiting execution in deployment pipeline.'
                                  )
                                }
                                className="px-2.5 py-1.5 rounded bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-700/70 font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                              >
                                <Check className="w-3 h-3 text-indigo-300" />
                                <span>Simulate Approval</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleSimulateStatusChange(
                                    'rejected',
                                    'Rejected by Review Board per constraint violation.'
                                  )
                                }
                                className="px-2.5 py-1.5 rounded bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/70 font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                              >
                                <X className="w-3 h-3 text-rose-300" />
                                <span>Simulate Rejection</span>
                              </button>
                            </>
                          )}

                          {activeDecision.status === 'approved' && (
                            <button
                              onClick={() =>
                                handleSimulateStatusChange(
                                  'executed',
                                  'Executed deployment change in staging cluster. Outcome metrics gathering underway.'
                                )
                              }
                              className="px-2.5 py-1.5 rounded bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 border border-cyan-700/70 font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                            >
                              <Play className="w-3 h-3 text-cyan-300" />
                              <span>Simulate Execution</span>
                            </button>
                          )}

                          {activeDecision.status === 'executed' && (
                            <button
                              onClick={() =>
                                handleSimulateStatusChange(
                                  'outcome_verified',
                                  'Empirical metrics audited: operational target confirmed achieved.'
                                )
                              }
                              className="px-2.5 py-1.5 rounded bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/70 font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                              <span>Simulate Outcome Verification</span>
                            </button>
                          )}

                          {activeDecision.status === 'outcome_verified' && (
                            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Lifecycle Completed — Empirical outcome verified.</span>
                            </span>
                          )}

                          {activeDecision.status === 'rejected' && (
                            <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5 py-1">
                              <X className="w-3.5 h-3.5 text-rose-400" />
                              <span>Proposal Rejected — Archival record preserved.</span>
                            </span>
                          )}
                        </div>

                        {simulatedFeedback && (
                          <div className="text-[11px] font-mono text-cyan-300 pt-1 flex items-center gap-1.5 animate-fadeIn">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>{simulatedFeedback}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Context Section */}
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                        Context & Operational Problem
                      </h4>
                      <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded border border-slate-800">
                        {activeDecision.context}
                      </p>
                    </div>

                    {/* Decision Section */}
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                        Adopted Architectural Decision
                      </h4>
                      <p className="text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded border border-slate-800 font-medium">
                        {activeDecision.decision}
                      </p>
                    </div>

                    {/* Execution and Outcome Notes if present */}
                    {activeDecision.executionNote && (
                      <div>
                        <h4 className="text-[11px] font-mono uppercase text-cyan-400 mb-1.5 flex items-center gap-1.5">
                          <Play className="w-3 h-3" />
                          <span>Execution Status Details</span>
                        </h4>
                        <p className="text-cyan-200/90 leading-relaxed bg-cyan-950/20 p-3 rounded border border-cyan-800/60 font-mono text-[11px]">
                          {activeDecision.executionNote}
                        </p>
                      </div>
                    )}

                    {activeDecision.outcomeNote && (
                      <div>
                        <h4 className="text-[11px] font-mono uppercase text-emerald-400 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Empirical Outcome Verification Details</span>
                        </h4>
                        <p className="text-emerald-200/90 leading-relaxed bg-emerald-950/20 p-3 rounded border border-emerald-800/60 font-mono text-[11px]">
                          {activeDecision.outcomeNote}
                        </p>
                      </div>
                    )}

                    {/* Consequences */}
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                        Anticipated Consequences & Graph Impact
                      </h4>
                      <ul className="space-y-2">
                        {activeDecision.consequences.map((cons, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 p-2.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{cons}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Affected Components */}
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                        Affected Architecture Nodes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeDecision.affectedComponents.map((comp) => (
                          <span
                            key={comp}
                            className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1.5"
                          >
                            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Evidence Provenance */}
                    <div className="pt-2">
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                        Documented Evidence Provenance
                      </h4>
                      <EvidenceIndicator
                        provenance={activeDecision.provenance}
                        sourceText={activeDecision.provenance.sourceName}
                      />
                    </div>
                  </div>
                </Card>
              ) : (
                <Card>
                  <EmptyState
                    title="Select a decision"
                    description="Click any ADR on the left to inspect architectural reasoning and consequences."
                  />
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTITUTIONAL MEMORY TIMELINE */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3.5 flex items-start gap-3 text-xs">
            <History className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">
                Immutable Institutional Memory Trace
              </span>
              <p className="text-slate-400 leading-relaxed">
                Chronological record of stack changes, constraint enforcement, and decision rationale. In Demo Mode, these events represent synthetic audit logs. No frontend action modifies backend memory or trains autonomous agents.
              </p>
            </div>
          </div>

          {memoryLoading ? (
            <LoadingState message="Loading memory timeline..." />
          ) : memoryError && mode === 'live' ? (
            <ErrorState
              error={memoryError}
              onRetry={onRetry}
              title="Memory Endpoint Unavailable"
              contextText="GET /companies/{company_id}/memory is unconfirmed in the current FastAPI backend. In live mode, this dependency is reported honestly."
            />
          ) : filteredMemoryEvents.length === 0 ? (
            <Card>
              <EmptyState
                title="No memory events recorded"
                description="No historical memory traces match your filter criteria."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredMemoryEvents.map((ev, index) => {
                const eventTypeBadges: Record<string, { label: string; tone: 'cyan' | 'info' | 'warning' | 'success' }> = {
                  stack_detected: { label: 'Stack Detected', tone: 'cyan' },
                  constraint_audited: { label: 'Constraint Audited', tone: 'warning' },
                  opportunity_identified: { label: 'Opportunity Identified', tone: 'info' },
                  decision_recorded: { label: 'Decision Recorded', tone: 'cyan' },
                  evidence_verified: { label: 'Evidence Verified', tone: 'success' },
                  policy_check: { label: 'Policy Enforced', tone: 'warning' }
                };
                const badgeInfo = eventTypeBadges[ev.eventType] || { label: ev.eventType, tone: 'cyan' };

                return (
                  <div
                    key={ev.id || index}
                    className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded border text-slate-300 bg-slate-800 border-slate-700">
                          {formatIsoDate(ev.timestamp)}
                        </span>
                        <Badge tone={badgeInfo.tone} size="sm">
                          {badgeInfo.label}
                        </Badge>
                        {ev.isSynthetic && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            SYNTHETIC
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 font-sans">
                        {ev.summary}
                      </h4>

                      {ev.details && (
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                          {ev.details}
                        </p>
                      )}
                    </div>

                    {/* Linked Entity Badges */}
                    <div className="flex md:flex-col items-end gap-1.5 text-xs shrink-0 font-mono">
                      {ev.relatedDecisionCode && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px] flex items-center gap-1">
                          <Brain className="w-3 h-3 text-cyan-400" />
                          <span>{ev.relatedDecisionCode}</span>
                        </span>
                      )}
                      {ev.relatedToolId && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>{ev.relatedToolId}</span>
                        </span>
                      )}
                      {ev.relatedRequirementId && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[11px] flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" />
                          <span>{ev.relatedRequirementId}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OPERATIONAL PLAYBOOKS & GOVERNANCE */}
      {activeTab === 'playbooks' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3.5 flex items-start gap-3 text-xs">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">
                Operational Playbooks & Guardrail Policies
              </span>
              <p className="text-slate-400 leading-relaxed">
                Pre-approved step sequences for high-stakes operational events. All playbooks enforce RelayForge's constraints: human approval is required before execution.
              </p>
            </div>
          </div>

          {playbooksLoading ? (
            <LoadingState message="Loading governance playbooks..." />
          ) : playbooksError && mode === 'live' ? (
            <ErrorState
              error={playbooksError}
              onRetry={onRetry}
              title="Playbooks Endpoint Unavailable"
              contextText="GET /companies/{company_id}/playbooks is unconfirmed in the current FastAPI backend. In live mode, this dependency is reported honestly."
            />
          ) : filteredPlaybooks.length === 0 ? (
            <Card>
              <EmptyState
                title="No playbooks configured"
                description="No operational playbooks match the filter query."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlaybooks.map((pb) => (
                <Card key={pb.id} className="border-slate-800 flex flex-col justify-between">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {pb.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {pb.humanApprovalRequired && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>APPROVAL REQUIRED</span>
                          </span>
                        )}
                        <Badge tone="cyan" size="sm">
                          {pb.category}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 font-sans">
                      {pb.title}
                    </h4>

                    {/* Trigger Condition */}
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
                        Trigger Condition
                      </span>
                      <p className="text-slate-300 bg-slate-950/70 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                        {pb.triggerCondition}
                      </p>
                    </div>

                    {/* Steps Checklist */}
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                        Execution Sequence ({pb.steps.length} steps)
                      </span>
                      <ol className="space-y-1.5">
                        {pb.steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 p-2 rounded bg-slate-950/50 border border-slate-800/60 text-slate-300 text-[11px]"
                          >
                            <span className="font-mono text-cyan-400 font-bold shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Footer constraint */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[280px]">
                      Constraint: {pb.governingConstraint}
                    </span>
                    {pb.isSynthetic && (
                      <span className="text-[10px] text-slate-400">
                        SYNTHETIC
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
