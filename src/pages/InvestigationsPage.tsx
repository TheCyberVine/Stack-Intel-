/**
 * Stack Intel — Investigations & Action Workspace (Phases Six, Seven, Nine & Ten)
 * 
 * Provides:
 * 1. Live Investigation Engine execution (POST /companies/{company_id}/investigate)
 * 2. Executive Summary, Evidence-backed Findings, Recommendations & Open Questions
 * 3. Engine A (Optimize Current Stack: AWS Activate Founders Credits)
 * 4. Engine B (Evaluate Alternatives: Sentry vs GlitchTip with "Keep current setup" option)
 * 5. Action Flow: Proposal, Review/Approval, and Simulation (POST /companies/{id}/actions/*)
 *    with explicit "Simulation completed. No production changes were made" notice.
 */

import React, { useState, useEffect } from 'react';
import {
  SearchCode,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Play,
  Check,
  X,
  FileCheck,
  Send,
  Layers,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  InvestigationItem,
  ApiError,
  DataMode,
  SandboxAssessmentResult,
  BackendInvestigationResponse,
  BackendActionResponse
} from '../api/types';
import { apiClient } from '../api/client';
import { Card, PanelHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { RelationshipPath } from '../components/RelationshipPath';
import { EvidenceAuditCard } from '../components/EvidenceAuditCard';
import { formatIsoDate, formatConfidencePercent } from '../utils/formatters';

interface InvestigationsPageProps {
  investigations: InvestigationItem[];
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  mode: DataMode;
  searchQuery: string;
  companyId?: string;
  onOpenSandboxModal: () => void;
  customSandboxResult?: SandboxAssessmentResult | null;
  onClearCustomSandbox?: () => void;
  onUpdateInvestigationEvidence?: (investigationId: string, reqId: string, url: string, note: string) => void;
}

export const InvestigationsPage: React.FC<InvestigationsPageProps> = ({
  investigations,
  loading,
  error,
  onRetry,
  mode,
  searchQuery,
  companyId = 'relayforge',
  onOpenSandboxModal,
  customSandboxResult,
  onClearCustomSandbox,
  onUpdateInvestigationEvidence
}) => {
  const isViewingCustomSandbox = Boolean(customSandboxResult);
  const activeList = isViewingCustomSandbox && customSandboxResult
    ? customSandboxResult.investigations
    : investigations;

  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'engine_a' | 'engine_b' | 'live_run' | 'evidence_path'>('engine_a');

  // Live Investigation Execution State
  const [liveQuestion, setLiveQuestion] = useState(
    'Identify evidence-backed opportunities to improve operational efficiency while preserving reliability and security visibility.'
  );
  const [liveInvestigationResult, setLiveInvestigationResult] = useState<BackendInvestigationResponse | null>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [liveInvestigateError, setLiveInvestigateError] = useState<string | null>(null);

  // Live Action Proposal & Simulation State
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<BackendActionResponse | null>(null);
  const [actionReviewStatus, setActionReviewStatus] = useState<'awaiting_approval' | 'proposed' | 'approved' | 'rejected' | null>(null);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredInvestigations = activeList.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      inv.title.toLowerCase().includes(q) ||
      inv.category.toLowerCase().includes(q) ||
      inv.summary.toLowerCase().includes(q) ||
      inv.affectedComponents.some((c) => c.toLowerCase().includes(q)) ||
      (inv.relatedToolId && inv.relatedToolId.toLowerCase().includes(q))
    );
  });

  const activeInvestigation =
    filteredInvestigations.find((i) => i.id === selectedInvestigationId) ||
    filteredInvestigations[0] ||
    null;

  const handleSubmitEvidence = (reqId: string, url: string, note: string) => {
    if (activeInvestigation && onUpdateInvestigationEvidence) {
      onUpdateInvestigationEvidence(activeInvestigation.id, reqId, url, note);
    }
  };

  // Run Backend Investigation
  const handleRunInvestigation = async () => {
    setIsInvestigating(true);
    setLiveInvestigateError(null);
    setActionResult(null);
    setSimulationNotice(null);

    try {
      const res = await apiClient.investigateCompany(companyId, liveQuestion);
      setLiveInvestigationResult(res);
      setActiveTab('live_run');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setLiveInvestigateError(apiErr.message || 'Failed to complete investigation');
    } finally {
      setIsInvestigating(false);
    }
  };

  // Propose Action (POST /companies/{id}/actions)
  const handleProposeAction = async (
    title: string,
    rationale: string,
    evidenceIds: string[],
    actionType: 'investigation' | 'production_change' = 'production_change'
  ) => {
    setActionInProgress(title);
    setActionError(null);
    setSimulationNotice(null);

    try {
      const res = await apiClient.proposeAction(companyId, {
        title,
        rationale,
        evidence_ids: evidenceIds,
        action_type: actionType,
        preserves_monitoring: true
      });
      setActionResult(res);
      setActionReviewStatus(res.status);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setActionError(apiErr.message || 'Action proposal failed.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Review Action (POST /companies/{id}/actions/{id}/review)
  const handleReviewAction = async (decision: 'approved' | 'rejected') => {
    if (!actionResult?.action_id) return;
    setActionError(null);

    try {
      const res = await apiClient.reviewAction(companyId, actionResult.action_id, decision);
      setActionReviewStatus(res.status);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setActionError(apiErr.message || 'Review failed.');
    }
  };

  // Simulate Action (POST /companies/{id}/actions/{id}/simulate)
  const handleSimulateAction = async () => {
    if (!actionResult?.action_id) return;
    setActionError(null);

    try {
      const res = await apiClient.simulateAction(companyId, actionResult.action_id);
      setSimulationNotice(res.notice || 'Simulation completed. No production changes were made.');
      setActionReviewStatus('approved');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setActionError(apiErr.message || 'Simulation cannot proceed. Confirm required approvals and safeguards.');
    }
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading investigations audit log..."
        subtext="Accessing graph evidence chains and relationship paths."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      {isViewingCustomSandbox && customSandboxResult ? (
        <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 font-sans text-sm">
                  Active Sandbox Assessment: {customSandboxResult.companyName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  SESSION STATE
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Isolated evaluation running in React state. No data or relationships are inherited from RelayForge.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onClearCustomSandbox && (
              <button
                type="button"
                onClick={onClearCustomSandbox}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700 font-mono text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Exit Sandbox
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <SearchCode className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">Investigation Engine & Decision Support</span>
              <span className="text-slate-400 ml-2">
                Connected to FalkorDB graph analysis (POST /companies/{companyId}/investigate).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSandboxModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold font-sans text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Sandbox Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Investigation Query Bar */}
      <Card className="p-4 bg-slate-900/80 border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={liveQuestion}
              onChange={(e) => setLiveQuestion(e.target.value)}
              placeholder="Ask the investigation engine (e.g. identify opportunities to optimize spend while preserving monitoring)..."
              className="w-full pl-3 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <button
            type="button"
            onClick={handleRunInvestigation}
            disabled={isInvestigating}
            className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            {isInvestigating ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-violet-300" />
                <span>Analyzing Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-violet-200" />
                <span>Run Live Investigation</span>
              </>
            )}
          </button>
        </div>

        {liveInvestigateError && (
          <div className="mt-3 p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{liveInvestigateError}</span>
          </div>
        )}
      </Card>

      {/* Navigation Tabs for Investigation Perspectives */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('engine_a')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'engine_a'
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Engine A: Optimize Current Stack (AWS Credits)
        </button>

        <button
          onClick={() => setActiveTab('engine_b')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'engine_b'
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Engine B: Evaluate Alternatives (Sentry vs GlitchTip)
        </button>

        {liveInvestigationResult && (
          <button
            onClick={() => setActiveTab('live_run')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'live_run'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Live Analysis Results</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('evidence_path')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'evidence_path'
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Graph Relationship Paths
        </button>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Simulation Completed Successfully</span>
            <span className="mt-0.5 block leading-relaxed">{simulationNotice}</span>
          </div>
        </div>
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* TAB 1: ENGINE A (OPTIMIZE CURRENT STACK: AWS ACTIVATE) */}
      {activeTab === 'engine_a' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-800/60">
                    ENGINE A: OPTIMIZATION
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">AWS Infrastructure ($465/mo)</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  AWS Activate Founders Credits Investigation
                </h3>
              </div>

              <a
                href="https://aws.amazon.com/startups/credits/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
              >
                <span>Official AWS Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              RelayForge incurs approximately $465/month on AWS cloud infrastructure. AWS Activate offers up to $1,000–$100,000 in credit opportunities for self-funded or funded early-stage startups. 
              <strong className="text-amber-300 ml-1">
                Eligibility is currently unverified in the graph and cannot be guaranteed.
              </strong>
            </p>

            {/* 5 Synthetic Requirements Audit */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Eligibility Criteria Audit (5 Requirements)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">1. New to AWS Activate Credits</span>
                    <span className="text-[11px] text-amber-400 font-mono">Status: Unknown / Needs Verification</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">2. Startup is Self-Funded</span>
                    <span className="text-[11px] text-amber-400 font-mono">Status: Unknown / Needs Verification</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">3. Functioning Company Website</span>
                    <span className="text-[11px] text-amber-400 font-mono">Status: Unknown / Needs Verification</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">4. Founded Within Past 10 Years</span>
                    <span className="text-[11px] text-amber-400 font-mono">Status: Unknown / Needs Verification</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-3 md:col-span-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">5. AWS Account on Paid Tier Plan</span>
                    <span className="text-[11px] text-amber-400 font-mono">Status: Unknown / Needs Verification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Proposal Section */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Recommended Action: Verify AWS Activate Eligibility</h4>
                  <p className="text-[11px] text-slate-400">
                    Propose action to verify self-funded criteria and review credit application.
                  </p>
                </div>

                {!actionResult ? (
                  <button
                    onClick={() =>
                      handleProposeAction(
                        'Verify AWS Activate Founders Eligibility',
                        'Audit company incorporation date and AWS account billing history before submitting application.',
                        [`company:${companyId}`, 'opportunity:aws_activate_credits'],
                        'production_change'
                      )
                    }
                    disabled={actionInProgress !== null}
                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Propose Action</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {actionReviewStatus === 'awaiting_approval' && (
                      <>
                        <button
                          onClick={() => handleReviewAction('approved')}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReviewAction('rejected')}
                          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {actionReviewStatus === 'approved' && !simulationNotice && (
                      <button
                        onClick={handleSimulateAction}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Simulate Action</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {actionResult && (
                <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-violet-800/40 flex items-center justify-between">
                  <span>Action ID: {actionResult.action_id}</span>
                  <span className="text-violet-400">Status: {actionReviewStatus}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ENGINE B (EVALUATE ALTERNATIVES: SENTRY VS GLITCHTIP) */}
      {activeTab === 'engine_b' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                    ENGINE B: ALTERNATIVE EVALUATION
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">Error Tracking & Observability</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Sentry vs. GlitchTip Evaluation
                </h3>
              </div>

              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Legitimate Outcome: Retain Current Setup</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current: Sentry */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Current Tool: Sentry</span>
                  <span className="text-xs font-mono text-slate-400">$26/month</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Fully managed SaaS observability platform.</li>
                  <li>Zero DevOps or database maintenance overhead.</li>
                  <li>Established team alert rules and integration with Slack.</li>
                  <li>
                    <strong className="text-emerald-400">Constraint check:</strong> Completely satisfies the hard constraint requiring error monitoring preservation.
                  </li>
                </ul>
              </div>

              {/* Alternative: GlitchTip */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Alternative: GlitchTip</span>
                  <span className="text-xs font-mono text-amber-400">Self-Hosted / Open-Source</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Compatible with standard Sentry client SDKs.</li>
                  <li>Potential software license cost savings (~$26/mo).</li>
                  <li className="text-amber-300">
                    Requires running Postgres + Redis infrastructure ($15–$30/mo in server costs).
                  </li>
                  <li className="text-amber-300">
                    Operational workload & backup responsibilities shift to engineering team.
                  </li>
                </ul>
              </div>
            </div>

            {/* Conclusion & Decision */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-white">Engine Assessment Recommendation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Verdict: Retain Current Setup (Do Nothing).</strong> At $26/month, Sentry's marginal cost is lower than the operational cost of managing self-hosted GlitchTip instances and backups. Migrating would introduce operational risks without yielding net positive financial return.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Status: Recommended Retention</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Preserves Observability Safeguard
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: LIVE BACKEND INVESTIGATION RESULTS */}
      {activeTab === 'live_run' && liveInvestigationResult && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    LIVE RESPONSE
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">Company: {liveInvestigationResult.company_name}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Investigation Analysis Result
                </h3>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {liveInvestigationResult.evidence_count} Evidence Items Evaluated
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Executive Summary
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                {liveInvestigationResult.analysis.executive_summary}
              </p>
            </div>

            {/* Findings */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Evidence-Linked Findings ({liveInvestigationResult.analysis.findings.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveInvestigationResult.analysis.findings.map((finding, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-100">{finding.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {finding.type.toUpperCase()} · {finding.confidence.toUpperCase()} CONFIDENCE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{finding.statement}</p>
                    <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      Evidence: {finding.evidence_ids.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Recommendations ({liveInvestigationResult.analysis.recommendations.length})
              </span>
              <div className="space-y-3">
                {liveInvestigationResult.analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rec.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        rec.status === 'proposed'
                          ? 'bg-violet-950 text-violet-300 border-violet-800'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}>
                        STATUS: {rec.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rec.rationale}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 block mb-0.5">EXPECTED BENEFIT</span>
                        <span className="text-slate-200">{rec.expected_benefit}</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 block mb-0.5">RISK / UNCERTAINTY</span>
                        <span className="text-slate-200">{rec.risk}</span>
                      </div>
                    </div>

                    {rec.requires_human_approval && (
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                        <span className="text-[11px] text-amber-400 font-mono">
                          Requires Human Approval Gate
                        </span>

                        <button
                          onClick={() =>
                            handleProposeAction(
                              rec.title,
                              rec.rationale,
                              rec.evidence_ids,
                              'production_change'
                            )
                          }
                          className="px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Propose Action to Backend</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Open Questions */}
            {liveInvestigationResult.analysis.open_questions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Open Questions Requiring Verification ({liveInvestigationResult.analysis.open_questions.length})
                </span>
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                  {liveInvestigationResult.analysis.open_questions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-amber-200">
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: RELATIONSHIP PATHS */}
      {activeTab === 'evidence_path' && activeInvestigation && (
        <Card className="border-slate-800 space-y-6">
          <PanelHeader
            title={activeInvestigation.title}
            subtitle={`Opened: ${formatIsoDate(activeInvestigation.openedAt)} • Category: ${activeInvestigation.category}`}
            icon={<SearchCode className="w-4 h-4" />}
            tag={<Badge status={activeInvestigation.status} />}
          />

          <RelationshipPath
            data={activeInvestigation.relationshipPath}
            isLiveApiUnavailable={mode === 'live' && !activeInvestigation.relationshipPath}
          />

          {activeInvestigation.requirements && activeInvestigation.requirements.length > 0 && (
            <EvidenceAuditCard
              requirements={activeInvestigation.requirements}
              lifecycleStages={activeInvestigation.lifecycleStages}
              recommendations={activeInvestigation.recommendations}
              officialSourceUrl={activeInvestigation.officialSourceUrl}
              missingInformation={activeInvestigation.missingInformation}
              limitations={activeInvestigation.limitations}
              onSubmitEvidence={handleSubmitEvidence}
              isSynthetic={activeInvestigation.isSynthetic}
            />
          )}
        </Card>
      )}
    </div>
  );
};
