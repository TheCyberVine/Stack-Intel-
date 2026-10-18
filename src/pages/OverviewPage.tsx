import React from 'react';
import {
  Layers,
  ShieldCheck,
  Server,
  DollarSign,
  Globe,
  Clock,
  Target,
  AlertOctagon,
  ArrowRight,
  SearchCode,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  FileCode
} from 'lucide-react';
import { CompanyOverviewResponse, ApiError, DataMode, HealthResponse } from '../api/types';
import { Card, PanelHeader } from '../components/Card';
import { Badge } from '../components/Badge';
import { EvidenceIndicator } from '../components/EvidenceIndicator';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { formatIsoDate, formatDateTime } from '../utils/formatters';
import { formatCurrency } from '../utils/normalizers';

interface OverviewPageProps {
  data: CompanyOverviewResponse | null;
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  mode: DataMode;
  health: HealthResponse | null;
  onNavigateToStack: () => void;
  onNavigateToInvestigations: (toolId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  data,
  loading,
  error,
  onRetry,
  mode,
  health,
  onNavigateToStack,
  onNavigateToInvestigations
}) => {
  if (loading) {
    return <LoadingState message="Loading company overview..." subtext="Querying confirmed GET /companies/{company_id}/overview route." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        title="Failed to Load Company Overview"
        contextText="This view queries the confirmed GET /companies/{company_id}/overview endpoint. In live mode, network failures are reported without fallback."
      />
    );
  }

  if (!data) {
    return null;
  }

  const {
    name,
    description,
    industry,
    stage,
    primary_domain,
    last_analyzed_at,
    is_synthetic,
    currency = 'USD',
    total_monthly_cost = 0,
    tools = [],
    goals = [],
    constraints = [],
    opportunities = [],
    pending_decisions = [],
    recorded_outcomes = []
  } = data;

  // Derive connectivity indicators from health
  const apiStatus = health?.status || 'Unknown';
  const falkorDbStatus = health?.services?.falkordb || health?.database || 'Unknown';

  return (
    <div className="space-y-6">
      {/* Synthetic Demo Data Notice */}
      {is_synthetic && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300 font-mono text-[11px] uppercase tracking-wide mr-2">
              Synthetic Demo Dataset
            </span>
            <span>
              Values for <strong>{name}</strong> (fictional B2B workflow startup) are synthetic models for evaluation. Listed tool costs ({tools.map((t) => `${t.name}: ${formatCurrency(t.monthlyCost, currency)}`).join(' + ')} = {formatCurrency(total_monthly_cost, currency)}) and objectives are not verified enterprise telemetry or live cloud billing.
            </span>
          </div>
        </div>
      )}

      {/* Top Banner: Company Identity & Core Metadata */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight font-sans">
                {name}
              </h2>
              <Badge tone="cyan" showIcon={false}>
                {industry}
              </Badge>
              <Badge tone="neutral" showIcon={false}>
                {stage}
              </Badge>
              {is_synthetic ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/70">
                  DEMO FIXTURE
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/70">
                  CONFIRMED ENTITY
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Domain and Timestamps */}
          <div className="flex flex-wrap lg:flex-col lg:items-end gap-x-4 gap-y-1.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200">{primary_domain}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Analyzed: {formatDateTime(last_analyzed_at)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* High-Level Financial & Connectivity Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Cost */}
        <Card className="p-4 border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Listed Monthly Cost</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-300">
              {formatCurrency(total_monthly_cost, currency)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">/ month ({currency})</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            {tools.length} listed {tools.length === 1 ? 'tool' : 'tools'} in stack
          </div>
        </Card>

        {/* Operational Stack Count */}
        <Card className="p-4 border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Operational Tools</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {tools.length}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">core components</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
            {tools.map((t) => t.name).join(' & ')}
          </div>
        </Card>

        {/* REST API Status */}
        <Card className="p-4 border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">REST API Availability</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {apiStatus.toUpperCase()}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Route: GET /health
          </div>
        </Card>

        {/* FalkorDB Graph Connectivity */}
        <Card className="p-4 border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Graph Database Engine</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {String(falkorDbStatus).toUpperCase()}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            FalkorDB Cypher Engine
          </div>
        </Card>
      </div>

      {/* Prominent Investigation CTA Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SearchCode className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-sans">
              Operational Investigation Center
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60">
              {opportunities.length} Available
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Evaluate architecture tradeoffs, commitment savings, and observability reliability across {name}'s verified tools.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToInvestigations()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold font-mono text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm focus:ring-2 focus:ring-cyan-400 shrink-0 cursor-pointer"
        >
          <SearchCode className="w-3.5 h-3.5" />
          Begin Investigation
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Core Split: Left Column (Tools & Costs) + Right Column (Goals & Constraints) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Current Stack & Listed Costs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <PanelHeader
              title="Current Stack & Listed Monthly Costs"
              subtitle="Explicitly configured tools with documented monthly expenditures"
              icon={<Layers className="w-4 h-4" />}
              action={
                <button
                  type="button"
                  onClick={onNavigateToStack}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  Inspect in StackHub &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100 font-sans">
                          {tool.name}
                        </span>
                        <Badge tone="neutral" size="sm">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {tool.role}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold font-mono text-cyan-300">
                        {formatCurrency(tool.monthlyCost, tool.currency)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        listed monthly
                      </span>
                    </div>
                  </div>

                  {/* Evidence Citation */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="truncate max-w-[280px]">
                      Source: {tool.evidence}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateToInvestigations(tool.id)}
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 text-[11px]"
                    >
                      Audit Tool &rarr;
                    </button>
                  </div>
                </div>
              ))}

              {/* Total Summary Footer */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300 font-semibold uppercase tracking-wider">
                  Total Listed Monthly Expenditure:
                </span>
                <span className="text-base font-bold text-cyan-300">
                  {formatCurrency(total_monthly_cost, currency)} / month
                </span>
              </div>
            </div>
          </Card>

          {/* Available Opportunities Section */}
          <Card>
            <PanelHeader
              title={`Identified Opportunities (${opportunities.length})`}
              subtitle="Concrete optimization and evaluation paths grounded in confirmed tools"
              icon={<Sparkles className="w-4 h-4 text-amber-400" />}
            />

            {opportunities.length > 0 ? (
              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-200 font-sans">
                        {opp.title}
                      </span>
                      {opp.relatedTool && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {opp.relatedTool}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {opp.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{opp.type}</span>
                      <button
                        type="button"
                        onClick={() => onNavigateToInvestigations(opp.relatedTool?.toLowerCase())}
                        className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold"
                      >
                        Launch Investigation &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-4 text-center">
                No active opportunities identified for current stack.
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Strategic Goals, Constraints, and Decisions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Strategic Goals & Operational Objectives */}
          <Card>
            <PanelHeader
              title="Strategic Goals & Targets"
              subtitle="Operational performance milestones and latency objectives"
              icon={<Target className="w-4 h-4 text-emerald-400" />}
            />

            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-100 font-sans">
                      {goal.title}
                    </span>
                    <Badge tone="cyan" size="sm">
                      {goal.category}
                    </Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{goal.description}</p>

                  {(goal.baseline || goal.target || goal.metric) && (
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 font-mono text-[11px]">
                      {goal.baseline && (
                        <div>
                          <span className="text-slate-400">Baseline: </span>
                          <span className="text-slate-300">{goal.baseline}</span>
                        </div>
                      )}
                      {goal.target && (
                        <div>
                          <span className="text-slate-400">Target: </span>
                          <span className="text-emerald-400 font-semibold">{goal.target}</span>
                        </div>
                      )}
                      {goal.metric && (
                        <div className="col-span-2">
                          <span className="text-slate-400">Target Metric: </span>
                          <span className="text-cyan-300">{goal.metric}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Operational Constraints */}
          <Card>
            <PanelHeader
              title="Operational Constraints"
              subtitle="Governance rules and non-negotiable architectural guardrails"
              icon={<Lock className="w-4 h-4 text-amber-400" />}
            />

            <div className="space-y-3">
              {constraints.map((con) => (
                <div
                  key={con.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-200 font-sans">
                      {con.statement}
                    </span>
                  </div>
                  {con.rationale && (
                    <p className="text-slate-400 leading-relaxed pl-5 text-[11px]">
                      {con.rationale}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Decisions & Memory - Honest Empty State when unsupported */}
          <Card>
            <PanelHeader
              title="Pending Decisions & Recorded Outcomes"
              subtitle="Formal ADR proposals and recorded architectural outcomes"
              icon={<FileCode className="w-4 h-4 text-slate-400" />}
            />

            {pending_decisions.length === 0 && recorded_outcomes.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-1.5 text-xs text-slate-400">
                <p className="font-medium text-slate-300">
                  No Pending Decisions or Historical Outcomes
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {name} has no formal ADR proposals or ratified outcomes currently recorded in the graph memory store.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {pending_decisions.map((dec) => (
                  <div key={dec.id} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-mono text-cyan-400 font-bold">{dec.code}:</span> {dec.title}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
