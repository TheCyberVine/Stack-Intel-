import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 border border-slate-800/80 rounded-lg p-5 shadow-sm transition-all duration-150 ${
        hoverable ? 'hover:border-slate-700 hover:bg-slate-900 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  tag?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
  tag
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/70 gap-2">
      <div className="flex items-start sm:items-center gap-3">
        {icon && <div className="p-2 rounded bg-slate-800 text-cyan-400 shrink-0">{icon}</div>}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
            {tag}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
