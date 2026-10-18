import React from 'react';
import { AlertTriangle, RefreshCw, ServerCrash, HelpCircle } from 'lucide-react';
import { ApiError } from '../api/types';

interface ErrorStateProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
  title?: string;
  contextText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  title = 'API Integration Error',
  contextText
}) => {
  const isApiError = error && 'endpoint' in error;
  const isNetwork = isApiError && (error as ApiError).isNetworkError;
  const isUnconfirmed = isApiError && (error as ApiError).unconfirmedEndpoint;
  const endpoint = isApiError ? (error as ApiError).endpoint : undefined;
  const status = isApiError ? (error as ApiError).status : undefined;
  const message = error?.message || 'An unexpected error occurred while communicating with the backend.';

  return (
    <div className="p-6 border border-rose-900/60 rounded-lg bg-rose-950/20 text-slate-200 my-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-950/80 rounded border border-rose-800/80 text-rose-400 shrink-0">
          {isNetwork ? (
            <ServerCrash className="w-5 h-5" />
          ) : isUnconfirmed ? (
            <HelpCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-rose-200">
              {isUnconfirmed ? 'Backend Capability Not Yet Implemented' : title}
            </h4>
            {status && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-900/60 border border-rose-700/60 text-rose-300">
                HTTP {status}
              </span>
            )}
            {isNetwork && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-700/60 text-amber-300">
                CONNECTION FAILED
              </span>
            )}
          </div>

          <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">{message}</p>

          {contextText && (
            <p className="text-xs text-slate-400 mt-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
              {contextText}
            </p>
          )}

          {endpoint && (
            <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Target Endpoint:</span>
              <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-300">
                {endpoint}
              </code>
            </div>
          )}

          {isUnconfirmed && (
            <div className="mt-3 text-xs text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-800/40">
              Note: This endpoint is unconfirmed in the current FastAPI backend contract. In accordance with scope boundaries, the frontend does not fabricate backend logic. Switch to Demo Mode to explore the planned interactive interface using synthetic fixtures.
            </div>
          )}

          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors focus:ring-1 focus:ring-cyan-500"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
