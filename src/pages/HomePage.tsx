/**
 * Stack Intel — Homepage (Phase Three Specification)
 * 
 * First-time visitor entry point explaining value proposition, trust & transparency,
 * how the evidence-first graph engine works, and entry points for Onboarding and RelayForge demo.
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Zap, 
  Sparkles, 
  HelpCircle,
  Clock,
  Compass,
  FileCheck
} from 'lucide-react';
import { Card } from '../components/Card';
import { DataMode, HealthResponse } from '../api/types';
import { ComingSoonModal } from '../components/ComingSoonModal';

interface HomePageProps {
  mode: DataMode;
  health: HealthResponse | null;
  onStartOnboarding: () => void;
  onExploreDemo?: () => void;
  onNavigateToWorkspace: (section: 'overview' | 'stackhub' | 'investigations' | 'decisions') => void;
}

export function HomePage({
  mode,
  health,
  onStartOnboarding,
  onExploreDemo,
  onNavigateToWorkspace
}: HomePageProps) {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 text-center lg:text-left">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>FalkorDB Evidence-First Intelligence Engine</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Decision Support Agent</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Connect your stack. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">Discover what comes next.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Stack Intel connects a company's technology, goals, constraints, and relevant opportunities to help teams identify what to optimize, what to explore, and what to leave unchanged.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 group"
            >
              <span>Analyze my stack</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => setIsComingSoonOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-violet-400" />
              <span>Explore the RelayForge demo</span>
            </button>
          </div>

          {/* Quick Context Strip */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero direct database exposure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>Evidence-linked findings</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Explicit unknown criteria</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Phase Three: Step Walkthrough) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Stack Intel Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            A disciplined, 4-step evidence pipeline that preserves business reality without inventing certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-slate-800 bg-slate-900/60 relative">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Tell us about your company</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Declare strategic goals, existing tools, approximate costs, measured metrics, and non-negotiable operational constraints.
            </p>
          </Card>

          <Card className="p-6 border-slate-800 bg-slate-900/60 relative">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Connect the context</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stack Intel structures relationships inside FalkorDB: connecting tools to goals, requirements to opportunities, and constraints to safeguards.
            </p>
          </Card>

          <Card className="p-6 border-slate-800 bg-slate-900/60 relative">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Investigate opportunities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The engine rigorously evaluates available evidence, flags missing requirements, checks trade-offs, and evaluates alternatives.
            </p>
          </Card>

          <Card className="p-6 border-slate-800 bg-slate-900/60 relative">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Decide with confidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review findings, propose actions with explicit human approval gates, and run non-destructive simulations before committing changes.
            </p>
          </Card>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Trust & Transparency Principles</h2>
            <p className="text-xs text-slate-400">Strict boundaries observed across both live backend and fixture modes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="flex gap-3">
            <FileCheck className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Evidence-Linked Recommendations</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every finding and proposal must reference verified graph node IDs. Recommendations without factual backing are marked as hypotheses.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Explicit Unknowns & Unverified Criteria</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Missing facts remain explicitly unknown. For example, AWS Activate credit eligibility is marked as requiring verification, not guaranteed.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Human Approval for Production Changes</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Operational changes (like tool migrations or configuration modifications) enforce strict human review and must satisfy safety constraints.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Simulation ≠ Production Execution</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Action simulation validates graph logic and state transitions in isolation. It never claims real cloud infrastructure was altered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RelayForge Demo Spotlight */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-violet-900/40 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-violet-950/60 border border-violet-800/50 text-violet-300 text-xs font-mono mb-4">
            <span>SEEDED DEMO ENTITY</span>
            <span>·</span>
            <span>SYNTHETIC DEMO DATA</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Explore RelayForge: Seeded Demo Company
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            RelayForge is seeded in FalkorDB with synthetic operational data: $465/mo AWS spend, $26/mo Sentry error monitoring, a p95 latency target below 400ms, and a hard constraint requiring error monitoring visibility to be preserved.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">AWS Cloud Spend</span>
              <span className="text-base font-semibold text-white font-mono">$465/mo</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Sentry Monitoring</span>
              <span className="text-base font-semibold text-white font-mono">$26/mo</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">p95 Latency Target</span>
              <span className="text-base font-semibold text-white font-mono">&lt; 400 ms</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Preserve Monitoring</span>
              <span className="text-base font-semibold text-emerald-400">Enforced</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsComingSoonOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Launch RelayForge Intelligence Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        featureName="RelayForge Demo"
      />
    </div>
  );
}
