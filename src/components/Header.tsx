import React from 'react';
import { Menu } from 'lucide-react';
import { DataMode, HealthResponse } from '../api/types';
import { NavSection } from './Sidebar';

interface HeaderProps {
  currentSection?: NavSection;
  companyName?: string;
  companyId?: string;
  mode?: DataMode;
  onToggleMode?: (mode: DataMode) => void;
  health?: HealthResponse | null;
  onOpenMobileNav: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 px-4 py-2.5 flex items-center">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer flex items-center justify-center"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
};
