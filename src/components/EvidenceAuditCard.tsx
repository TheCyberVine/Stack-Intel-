import React, { useState } from 'react';
import {
  Shield,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Info,
  Clock,
  ArrowRight,
  FileCheck2
} from 'lucide-react';
import {
  InvestigationRequirement,
  LifecycleStageItem,
  InvestigationRecommendation
} from '../api/types';
import {
  getEvidenceStatusDetails,
  getEvidenceOriginDetails
} from '../utils/investigations';
import { isValidHttpUrl, sanitizeInput } from '../utils/formatters';
import { Badge } from './Badge';

interface EvidenceAuditCardProps {
  requirements: InvestigationRequirement[];
  lifecycleStages?: LifecycleStageItem[];
  recommendations?: InvestigationRecommendation[];
  officialSourceUrl?: string;
  missingInformation?: string[];
  limitations?: string[];
  onSubmitEvidence: (reqId: string, url: string, note: string) => void;
  isSynthetic?: boolean;
}

export const EvidenceAuditCard: React.FC<EvidenceAuditCardProps> = ({
  requirements,
  lifecycleStages = [],
  recommendations = [],
  officialSourceUrl,
  missingInformation = [],
  limitations = [],
  onSubmitEvidence,
  isSynthetic = false
}) => {
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitNote, setSubmitNote] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, reqId: string) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedUrl = submitUrl.trim();
    const sanitizedNote = sanitizeInput(submitNote, 300);

    if (!trimmedUrl && !sanitizedNote) {
      setValidationError('Please provide either a source URL or an explanatory note.');
      return;
    }

    if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
      setValidationError('Source URL must be a valid http:// or https:// address.');
      return;
    }

    setIsSubmittingForm(true);
    onSubmitEvidence(reqId, trimmedUrl, sanitizedNote);
    setSubmissionFeedback(
      'Evidence submitted for review. Note: A user-submitted URL or claim is NOT automatically verified evidence. Status is marked as "User-Provided (Pending Audit)".'
    );
    setSubmitUrl('');
    setSubmitNote('');
    setActiveReqId(null);
    setIsSubmittingForm(false);
  };

  const isSafeOfficialUrl = isValidHttpUrl(officialSourceUrl);

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Official Source & Disclaimer Header */}
      {officialSourceUrl && (
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 font-sans">
                Official Program Source
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                AWS Activate
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Grounded in publicly documented startup credit guidelines. No eligibility is guaranteed.
            </p>
          </div>

          <a
            href={officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 font-mono text-[11px] transition-colors shrink-0"
          >
            <span>View Official Guidelines</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Submission Feedback Alert */}
      {submissionFeedback && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{submissionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionFeedback(null)}
            className="text-amber-400 hover:text-amber-100 font-mono text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Requirements Audit Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wide flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            Eligibility Requirements & Evidence Audit
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {requirements.length} Prerequisites Tracked
          </span>
        </div>

        <div className="space-y-3">
          {requirements.map((req) => {
            const statusDetails = getEvidenceStatusDetails(req.status);
            const originDetails = getEvidenceOriginDetails(req.evidenceOrigin);
            const isSubmitting = activeReqId === req.id;

            return (
              <div
                key={req.id}
                className="p-4 rounded-lg bg-slate-950 border border-slate-800/90 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-100 font-sans text-sm">
                        {req.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                          statusDetails.tone === 'success'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : statusDetails.tone === 'warning'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : statusDetails.tone === 'danger'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span aria-hidden="true">{statusDetails.symbol}</span>
                        <span>{statusDetails.label}</span>
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {originDetails.label}
                      </span>
                    </div>

                    <p className="text-slate-300 mt-1.5 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveReqId(isSubmitting ? null : req.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition-colors shrink-0"
                  >
                    <Upload className="w-3 h-3" />
                    Submit Evidence
                  </button>
                </div>

                {/* Unknowns or Contradictions */}
                {req.unknowns && req.unknowns.length > 0 && (
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-slate-400">
                    <span className="text-amber-400 font-semibold mr-1">Unknowns:</span>
                    {req.unknowns.join(' • ')}
                  </div>
                )}

                {/* User Submitted Evidence Details if present */}
                {req.userSubmittedEvidence && (
                  <div className="p-2.5 rounded bg-amber-950/20 border border-amber-900/50 text-[11px] font-mono text-amber-200/90 space-y-1">
                    <div className="font-semibold text-amber-300">
                      User Evidence Submission (Pending Backend Verification):
                    </div>
                    {req.userSubmittedEvidence.url && (
                      <div>URL: {req.userSubmittedEvidence.url}</div>
                    )}
                    {req.userSubmittedEvidence.note && (
                      <div>Note: {req.userSubmittedEvidence.note}</div>
                    )}
                  </div>
                )}

                {/* Inline Evidence Submission Form */}
                {isSubmitting && (
                  <form
                    onSubmit={(e) => handleSubmit(e, req.id)}
                    className="p-3.5 rounded-lg bg-slate-900 border border-cyan-800/60 space-y-3 mt-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-cyan-300 font-mono">
                        Submit Evidence for: {req.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveReqId(null)}
                        className="text-slate-400 hover:text-slate-200 text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                        Source URL (e.g., Company Website, Incorporation filing, PitchBook link)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/proof"
                        value={submitUrl}
                        onChange={(e) => setSubmitUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                        Auditor Notes / Verification Claim
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Founded in 2024, self-funded, live landing page verified"
                        value={submitNote}
                        onChange={(e) => setSubmitNote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    {validationError && (
                      <div className="p-2 rounded bg-rose-950/50 border border-rose-800/80 text-rose-300 text-[11px] font-mono flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 italic">
                        User submissions are flagged as self-reported until validated.
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className="px-3 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold font-mono text-[11px] transition-colors cursor-pointer"
                      >
                        {isSubmittingForm ? 'Submitting...' : 'Submit for Review'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Lifecycle Stage Distinction */}
      {lifecycleStages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Opportunity Realization Lifecycle
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              Prerequisite &rarr; Realized Savings
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[11px]">
            {lifecycleStages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'current';

              return (
                <div
                  key={stage.stage}
                  className={`p-2.5 rounded border space-y-1.5 ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : isCurrent
                      ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="opacity-70">Step {idx + 1}</span>
                    <span className="uppercase text-[9px] font-bold">
                      {stage.status}
                    </span>
                  </div>
                  <div className="font-semibold font-sans text-xs line-clamp-1">
                    {stage.label}
                  </div>
                  <p className="text-[10px] opacity-80 line-clamp-2">
                    {stage.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Recommendations & Retaining Options */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wide flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Grounded Recommendations & Next Steps
          </h4>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-sm text-slate-100 font-sans">
                      {rec.title}
                    </h5>
                    {rec.goalTitle && (
                      <span className="text-[10px] font-mono text-cyan-400">
                        Supports: {rec.goalTitle}
                      </span>
                    )}
                  </div>
                  {rec.approvalRequired && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 shrink-0">
                      HUMAN APPROVAL REQUIRED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.summary}
                </p>

                {/* Facts vs Hypotheses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-emerald-400 font-semibold">
                      Grounded Facts:
                    </span>
                    {rec.facts.map((fact, idx) => (
                      <div key={idx} className="text-slate-300">• {fact}</div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-amber-400 font-semibold">
                      Hypotheses & Assumptions:
                    </span>
                    {rec.hypotheses.map((hyp, idx) => (
                      <div key={idx} className="text-slate-400">• {hyp}</div>
                    ))}
                  </div>
                </div>

                {/* Suggested Next Step & Retaining Rationale */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono">
                  <div className="text-cyan-300">
                    <span className="text-slate-400">Next Action:</span> {rec.suggestedNextStep}
                  </div>

                  {rec.allowRetainingCurrentSetup && (
                    <span className="text-slate-400 italic font-sans text-[11px]">
                      Option to retain current setup is fully preserved.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Missing Information & Program Limitations */}
      {(missingInformation.length > 0 || limitations.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
          {missingInformation.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">
                Identified Information Gaps:
              </span>
              {missingInformation.map((item, idx) => (
                <div key={idx} className="text-slate-300">• {item}</div>
              ))}
            </div>
          )}

          {limitations.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">
                Program Constraints & Limitations:
              </span>
              {limitations.map((item, idx) => (
                <div key={idx} className="text-slate-300">• {item}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
