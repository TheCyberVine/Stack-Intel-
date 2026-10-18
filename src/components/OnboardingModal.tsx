/**
 * Stack Intel — Structured Company Onboarding (Phase Four & Five Specification)
 * 
 * 5-step guided onboarding flow collecting:
 * 1. Company Identity
 * 2. Business Objectives (with primary objective)
 * 3. Existing Tech Stack (multiple tools with optional costs)
 * 4. Constraints & Risk Tolerance (human approval, monitoring preservation)
 * 5. Review & Submission Screen
 */

import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Building2, 
  Target, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Card } from './Card';
import { DataMode } from '../api/types';

export interface OnboardingToolItem {
  id: string;
  name: string;
  category: string;
  plan?: string;
  monthlyCost?: number;
  workloadDetails?: string;
}

export interface OnboardingData {
  // Step 1: Identity
  companyName: string;
  industry: string;
  stage: string;
  website: string;
  description: string;

  // Step 2: Objectives
  objectives: string[];
  primaryObjective: string;

  // Step 3: Stack
  tools: OnboardingToolItem[];

  // Step 4: Constraints
  requireHumanApproval: boolean;
  preserveMonitoring: boolean;
  avoidDowntime: boolean;
  preserveCurrentDatabase: boolean;
  budgetCeiling?: number;
  customConstraints: string[];

  // Step 5: Additional Context
  additionalNotes: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OnboardingData) => void;
  mode: DataMode;
}

export function OnboardingModal({ isOpen, onClose, onSubmit, mode }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    industry: '',
    stage: 'early_stage',
    website: '',
    description: '',
    objectives: ['Reduce unnecessary technology spending', 'Improve reliability or uptime'],
    primaryObjective: 'Reduce unnecessary technology spending',
    tools: [
      { id: '1', name: 'AWS', category: 'Cloud Infrastructure', monthlyCost: 450, plan: 'On-demand' },
      { id: '2', name: 'Sentry', category: 'Error Tracking', monthlyCost: 29, plan: 'Team' }
    ],
    requireHumanApproval: true,
    preserveMonitoring: true,
    avoidDowntime: true,
    preserveCurrentDatabase: false,
    budgetCeiling: 1000,
    customConstraints: [],
    additionalNotes: ''
  });

  // Tool entry staging
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('Cloud Infrastructure');
  const [newToolCost, setNewToolCost] = useState<string>('');
  const [newToolPlan, setNewToolPlan] = useState('');

  // Custom constraint staging
  const [newConstraint, setNewConstraint] = useState('');

  if (!isOpen) return null;

  const OBJECTIVE_OPTIONS = [
    'Reduce unnecessary technology spending',
    'Improve reliability or uptime',
    'Improve application performance',
    'Reduce operational workload',
    'Improve security or visibility',
    'Scale the current architecture',
    'Discover relevant startup programs, credits, or tooling opportunities'
  ];

  const TOOL_CATEGORIES = [
    'Cloud Infrastructure',
    'Database & Storage',
    'Application Monitoring',
    'Error Tracking',
    'Authentication & Identity',
    'CI/CD & DevOps',
    'Security & Compliance',
    'Analytics & Telemetry'
  ];

  const handleNext = () => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        setErrorMsg('Please enter your company name.');
        return;
      }
      if (!formData.industry.trim()) {
        setErrorMsg('Please specify your industry or company type.');
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.objectives.length === 0) {
        setErrorMsg('Please select at least one business objective.');
        return;
      }
    }

    if (currentStep === 3) {
      if (formData.tools.length === 0) {
        setErrorMsg('Please add at least one current tool or service.');
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTool = () => {
    if (!newToolName.trim()) return;
    const item: OnboardingToolItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newToolName.trim(),
      category: newToolCategory,
      plan: newToolPlan.trim() || undefined,
      monthlyCost: newToolCost ? parseFloat(newToolCost) : undefined
    };
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, item]
    }));
    setNewToolName('');
    setNewToolPlan('');
    setNewToolCost('');
  };

  const handleRemoveTool = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.id !== id)
    }));
  };

  const handleToggleObjective = (obj: string) => {
    setFormData((prev) => {
      const exists = prev.objectives.includes(obj);
      const updated = exists ? prev.objectives.filter((o) => o !== obj) : [...prev.objectives, obj];
      let newPrimary = prev.primaryObjective;
      if (exists && prev.primaryObjective === obj) {
        newPrimary = updated[0] || '';
      } else if (!exists && updated.length === 1) {
        newPrimary = obj;
      }
      return {
        ...prev,
        objectives: updated,
        primaryObjective: newPrimary
      };
    });
  };

  const handleAddCustomConstraint = () => {
    if (!newConstraint.trim()) return;
    setFormData((prev) => ({
      ...prev,
      customConstraints: [...prev.customConstraints, newConstraint.trim()]
    }));
    setNewConstraint('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                STEP {currentStep} OF 5
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-medium">Company Onboarding</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentStep === 1 && 'Company Identity'}
              {currentStep === 2 && 'Business Objectives'}
              {currentStep === 3 && 'Current Technology Stack'}
              {currentStep === 4 && 'Constraints & Risk Tolerance'}
              {currentStep === 5 && 'Review Submitted Information'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-violet-500 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="m-6 mb-0 p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {/* STEP 1: IDENTITY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Acme Tech Labs"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Industry / Type <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. B2B SaaS, FinTech, DevTools"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Company Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="idea">Idea Stage</option>
                    <option value="early_stage">Early-Stage Startup (Seed / Self-Funded)</option>
                    <option value="growing">Growing Company (Series A-B)</option>
                    <option value="established">Established Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Website URL <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Company Description <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="What does your company build, and who are your users?"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS OBJECTIVES */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Select what your organization is actively aiming to optimize. Objectives form explicit relationships in the graph.
              </p>

              <div className="space-y-2">
                {OBJECTIVE_OPTIONS.map((obj) => {
                  const isSelected = formData.objectives.includes(obj);
                  const isPrimary = formData.primaryObjective === obj;

                  return (
                    <div
                      key={obj}
                      className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-violet-950/20 border-violet-800/80 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleObjective(obj)}
                        className="flex items-start gap-3 text-left flex-1"
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-medium">{obj}</span>
                      </button>

                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, primaryObjective: obj })}
                          className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                            isPrimary
                              ? 'bg-violet-600 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isPrimary ? 'Primary Goal' : 'Set as Primary'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXISTING TECHNOLOGY STACK */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Add the tools and services you currently deploy. Approximate monthly costs are optional but help estimate ROI.
              </p>

              {/* Add Tool Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300">Add Tool or Service</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Tool Name (e.g. AWS, Sentry, Postgres)"
                      value={newToolName}
                      onChange={(e) => setNewToolName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <select
                      value={newToolCategory}
                      onChange={(e) => setNewToolCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                    >
                      {TOOL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Plan / Deployment (e.g. Self-hosted, Team)"
                      value={newToolPlan}
                      onChange={(e) => setNewToolPlan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Approx Cost / Month ($ USD)"
                      value={newToolCost}
                      onChange={(e) => setNewToolCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTool}
                  className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tool</span>
                </button>
              </div>

              {/* Tools List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">
                  Added Tools ({formData.tools.length})
                </span>
                {formData.tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tool.name}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] text-slate-400">{tool.category}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {tool.plan ? `Plan: ${tool.plan}` : 'Plan: Standard'}
                        {tool.monthlyCost !== undefined
                          ? ` · $${tool.monthlyCost}/mo`
                          : ' · Cost: Unknown'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CONSTRAINTS & RISK TOLERANCE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Define the guardrails that Stack Intel must respect. Constraints prevent recommendations evaluated solely on cost savings.
              </p>

              <div className="space-y-3">
                <label className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requireHumanApproval}
                    onChange={(e) =>
                      setFormData({ ...formData, requireHumanApproval: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Production Changes Require Human Approval
                    </span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Ensures actions cannot be executed autonomously without human authorization.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preserveMonitoring}
                    onChange={(e) =>
                      setFormData({ ...formData, preserveMonitoring: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Preserve Error Monitoring & Incident Visibility
                    </span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Tool alternatives cannot degrade error tracking capabilities or telemetry pipelines.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.avoidDowntime}
                    onChange={(e) =>
                      setFormData({ ...formData, avoidDowntime: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Zero Tolerable Scheduled Downtime
                    </span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Architectural proposals requiring service interruptions must be deprioritized.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preserveCurrentDatabase}
                    onChange={(e) =>
                      setFormData({ ...formData, preserveCurrentDatabase: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Do Not Migrate Primary Database
                    </span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                      Restricts optimization strictly to application & observability tiers.
                    </span>
                  </div>
                </label>
              </div>

              {/* Custom constraint adder */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Custom Constraints
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Must comply with SOC 2, HIPAA requirements"
                    value={newConstraint}
                    onChange={(e) => setNewConstraint(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomConstraint}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    Add
                  </button>
                </div>
                {formData.customConstraints.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.customConstraints.map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRMATION */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Company Identity</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300 grid grid-cols-2 gap-2">
                  <div>Name: <strong>{formData.companyName}</strong></div>
                  <div>Industry: <strong>{formData.industry}</strong></div>
                  <div>Stage: <strong>{formData.stage}</strong></div>
                  <div>Website: <strong>{formData.website || 'Not specified'}</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Objectives ({formData.objectives.length})
                  </span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300">
                  Primary: <span className="text-violet-400 font-semibold">{formData.primaryObjective}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Tools Declared ({formData.tools.length})
                  </span>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.map((t) => (
                    <span
                      key={t.id}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      {t.name} ({t.category}) · {t.monthlyCost ? `$${t.monthlyCost}/mo` : 'Cost: Unknown'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Constraints & Guardrails
                  </span>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                  {formData.requireHumanApproval && <li>Production changes require human approval</li>}
                  {formData.preserveMonitoring && <li>Preserve error monitoring & incident visibility</li>}
                  {formData.avoidDowntime && <li>Zero tolerable downtime</li>}
                  {formData.preserveCurrentDatabase && <li>Do not migrate primary database</li>}
                  {formData.customConstraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Honest Backend Submission Notice */}
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Backend Integration Boundary:</strong> The backend has confirmed endpoints for <code>GET /health</code>, <code>GET /companies/{'{id}'}/overview</code>, <code>POST /companies/{'{id}'}/investigate</code>, and <code>POST /companies/{'{id}'}/actions</code>. New company graph creation endpoint <code>POST /companies</code> is not yet provided by the backend. Submitting here will run a session-isolated assessment in the frontend without modifying the backend or fabricating persistence.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-violet-600/20 transition-all cursor-pointer"
          >
            <span>{currentStep === 5 ? 'Submit for Investigation' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
