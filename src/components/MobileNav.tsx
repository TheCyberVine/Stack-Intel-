import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Layers,
  SearchCode,
  Brain,
  ChevronRight
} from 'lucide-react';
import { CompanySummaryItem, DataMode, HealthResponse } from '../api/types';
import { NavSection } from './Sidebar';
import { ComingSoonModal } from './ComingSoonModal';
import { StackIntelLogo } from './StackIntelLogo';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  companies: CompanySummaryItem[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  mode: DataMode;
  onToggleMode: (mode: DataMode) => void;
  health: HealthResponse | null;
  onStartOnboarding?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentSection,
  onSelectSection,
  companies,
  selectedCompanyId,
  onSelectCompany,
  mode,
  onToggleMode,
  health,
  onStartOnboarding
}) => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const nonFunctionalSections = new Set<NavSection>(['overview', 'stackhub', 'investigations']);

  if (!isOpen) return null;

  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'stackhub', label: 'StackHub', icon: <Layers className="w-4 h-4" /> },
    { id: 'investigations', label: 'Investigations', icon: <SearchCode className="w-4 h-4" /> },
    { id: 'decisions', label: 'Decisions & Memory', icon: <Brain className="w-4 h-4" /> }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between h-full z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <StackIntelLogo className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-100 font-mono text-sm">STACK INTEL</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400 px-2 mb-2">Sections</div>
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
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Mode Switcher */}
        <div className="pt-4 border-t border-slate-800 text-xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">Data Source Mode</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => onToggleMode('demo')}
              className={`py-1.5 px-2 text-center rounded border transition-colors ${
                mode === 'demo'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Demo Fixture
            </button>
            <button
              type="button"
              onClick={() => onToggleMode('live')}
              className={`py-1.5 px-2 text-center rounded border transition-colors ${
                mode === 'live'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
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
    </div>
  );
};
