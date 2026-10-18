import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { SandboxAssessmentInput, DataMode } from '../api/types';

interface CustomSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: SandboxAssessmentInput) => void;
  mode: DataMode;
}

export const CustomSandboxModal: React.FC<CustomSandboxModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode
}) => {
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('Seed / Early-Stage');
  const [currency, setCurrency] = useState('USD');
  const [goals, setGoals] = useState<string[]>(['Improve operational efficiency']);
  const [newGoal, setNewGoal] = useState('');
  const [tools, setTools] = useState<Array<{ name: string; monthlyCost: number }>>([
    { name: '', monthlyCost: 0 }
  ]);
  const [constraints, setConstraints] = useState<string[]>([
    'Production changes require human approval'
  ]);
  const [newConstraint, setNewConstraint] = useState('');
  const [painPoints, setPainPoints] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleAddTool = () => {
    setTools([...tools, { name: '', monthlyCost: 0 }]);
  };

  const handleUpdateTool = (index: number, field: 'name' | 'monthlyCost', value: string | number) => {
    const updated = [...tools];
    if (field === 'monthlyCost') {
      updated[index].monthlyCost = Math.max(0, Number(value) || 0);
    } else {
      updated[index].name = String(value);
    }
    setTools(updated);
  };

  const handleRemoveTool = (index: number) => {
    if (tools.length > 1) {
      setTools(tools.filter((_, i) => i !== index));
    }
  };

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) {
      errs.companyName = 'Company name is required.';
    }
    if (!description.trim()) {
      errs.description = 'Brief company description is required.';
    }
    if (goals.length === 0) {
      errs.goals = 'At least one operational goal must be specified.';
    }
    const validTools = tools.filter((t) => t.name.trim().length > 0);
    if (validTools.length === 0) {
      errs.tools = 'At least one tool name must be provided.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    const filteredTools = tools
      .filter((t) => t.name.trim().length > 0)
      .map((t) => ({ name: t.name.trim(), monthlyCost: t.monthlyCost }));

    onSubmit({
      companyName: companyName.trim(),
      description: description.trim(),
      stage,
      currency,
      goals,
      tools: filteredTools,
      constraints,
      painPoints: painPoints.trim() || undefined
    });
    setIsSubmitting(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sandbox-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="sandbox-modal-title" className="text-base font-bold text-slate-100 font-sans">
                Start Custom Sandbox Assessment
              </h3>
              <p className="text-xs text-slate-400">
                Run an isolated evaluation for any company stack in current session state.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live mode notice if live */}
        {mode === 'live' && (
          <div className="mb-4 p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Live API Notice: </span>
              The backend does not currently expose a persistent sandbox submission endpoint. In live mode, this operation is not available. Switch to Demo Mode to run the simulated assessment workflow.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Company Name & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Compute, DataStream Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 font-medium focus:ring-1 focus:ring-cyan-500"
              />
              {errors.companyName && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Funding / Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-100 font-medium focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="Self-funded / Bootstrapped">Self-funded / Bootstrapped</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed / Early-Stage">Seed / Early-Stage</option>
                <option value="Series A">Series A</option>
                <option value="Growth / Scaleup">Growth / Scaleup</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Company Description *
            </label>
            <textarea
              rows={2}
              placeholder="What does this company do and what is its primary product?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:ring-1 focus:ring-cyan-500"
            />
            {errors.description && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Goals (Multiple) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase text-slate-400">
                Primary Goals *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {goals.length} defined
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {goals.map((g, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200"
                >
                  <span>{g}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                    aria-label={`Remove goal ${g}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add another goal (e.g. Reduce MTTR, Maintain p95 latency < 300ms)"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGoal();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
              >
                + Add Goal
              </button>
            </div>
            {errors.goals && <p className="text-[10px] text-rose-400">{errors.goals}</p>}
          </div>

          {/* Current Tools & Approximate Monthly Costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase text-slate-400">
                Current Stack Tools & Estimated Monthly Spend *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-cyan-300 font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {tools.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tool name (e.g. AWS, GCP, Datadog)"
                    value={tool.name}
                    onChange={(e) => handleUpdateTool(idx, 'name', e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                  <div className="relative w-36">
                    <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs font-mono">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={tool.monthlyCost || ''}
                      onChange={(e) => handleUpdateTool(idx, 'monthlyCost', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded pl-6 pr-2.5 py-1.5 text-xs text-slate-100 font-mono focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  {tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(idx)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Remove tool"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddTool}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-1"
            >
              <Plus className="w-3 h-3" /> Add Another Tool
            </button>
            {errors.tools && <p className="text-[10px] text-rose-400">{errors.tools}</p>}
          </div>

          {/* Operational Constraints */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase text-slate-400">
              Operational Constraints & Guardrails
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {constraints.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs text-slate-300"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConstraint(idx)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                    aria-label={`Remove constraint ${c}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add constraint (e.g. Must preserve HIPAA compliance)"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddConstraint();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
              >
                + Add Constraint
              </button>
            </div>
          </div>

          {/* Optional Pain Points */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Known Issues or Current Pain Points (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Inflexible 1-year contract renewal upcoming, high egress fees"
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 italic">
              Results are generated in local session state. No permanent records are claimed.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mode === 'live' || isSubmitting}
                className="px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isSubmitting ? 'Generating...' : 'Generate Sandbox Assessment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
