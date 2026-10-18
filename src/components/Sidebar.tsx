import React, { useState } from 'react';
import {
  Compass,
  LayoutDashboard,
  Layers,
  SearchCode,
  Brain,
  Building2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { CompanySummaryItem, DataMode, HealthResponse } from '../api/types';
import { ComingSoonModal } from './ComingSoonModal';
import { StackIntelLogo } from './StackIntelLogo';

export type NavSection = 'home' | 'overview' | 'stackhub' | 'investigations' | 'decisions';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  companies?: CompanySummaryItem[];
  selectedCompanyId?: string;
  onSelectCompany?: (id: string) => void;
  health: HealthResponse | null;
  healthLoading: boolean;
  healthError: boolean;
  mode: DataMode;
  onToggleMode?: (mode: DataMode) => void;
  onStartOnboarding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  health,
  healthLoading,
  healthError,
  mode,
  onToggleMode,
  onStartOnboarding
}) => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const nonFunctionalSections = new Set<NavSection>(['overview', 'stackhub', 'investigations']);

  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    description: string;
  }> = [
    {
      id: 'home',
      label: 'Home',
      icon: <Compass className="w-4 h-4" />,
      description: 'Platform overview & how it works'
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'Confirmed profile & stack summary'
    },
    {
      id: 'stackhub',
      label: 'StackHub',
      icon: <Layers className="w-4 h-4" />,
      description: 'Component inventory & licenses'
    },
    {
      id: 'investigations',
      label: 'Investigations',
      icon: <SearchCode className="w-4 h-4" />,
      badge: 'Live',
      description: 'FalkorDB graph decision engine'
    },
    {
      id: 'decisions',
      label: 'Decisions & Memory',
      icon: <Brain className="w-4 h-4" />,
      badge: 'ADR',
      description: 'Institutional graph decisions'
    }
  ];

  const isHealthy = health && (health.status === 'healthy' || health.status === 'ok');

  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden md:flex flex-col w-64 shrink-0 bg-slate-950 border-r border-slate-800/80 h-screen sticky top-0 text-slate-300 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <StackIntelLogo className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-sm font-mono">STACK INTEL</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight truncate">
              WeMakeDevs × FalkorDB Graph
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
          Intelligence Workspace
        </div>
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (nonFunctionalSections.has(item.id)) {
                  setComingSoonFeature(item.label);
                } else {
                  onSelectSection(item.id);
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors text-xs font-medium group ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Onboarding Quick Action */}
      {onStartOnboarding && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="w-full px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze My Stack</span>
          </button>
        </div>
      )}

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">Backend API</span>
          <span
            className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
              healthLoading
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : healthError
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : isHealthy
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}
          >
            {healthLoading ? (
              'Checking...'
            ) : healthError ? (
              <>
                <AlertTriangle className="w-2.5 h-2.5" /> Offline
              </>
            ) : isHealthy ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5" /> Healthy
              </>
            ) : (
              'Degraded'
            )}
          </span>
        </div>

        <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
          <div className="flex justify-between">
            <span>Graph Engine:</span>
            <span className="text-slate-300">FalkorDB v0.4</span>
          </div>
        </div>

        {/* Data Source Mode Toggle */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Data Source Mode</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => onToggleMode && onToggleMode('demo')}
              className={`py-1.5 px-2 text-center rounded border transition-colors cursor-pointer ${
                mode === 'demo'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              Demo Fixture
            </button>
            <button
              type="button"
              onClick={() => onToggleMode && onToggleMode('live')}
              className={`py-1.5 px-2 text-center rounded border transition-colors cursor-pointer ${
                mode === 'live'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              Live API
            </button>
          </div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={comingSoonFeature !== null}
        onClose={() => setComingSoonFeature(null)}
        featureName={comingSoonFeature || undefined}
      />
    </aside>
  );
};
