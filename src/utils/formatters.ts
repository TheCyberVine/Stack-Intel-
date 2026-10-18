/**
 * Stack Intel — Pure Formatting & Logic Utilities
 */

export function formatConfidencePercent(confidence: number): string {
  if (typeof confidence !== 'number' || isNaN(confidence)) {
    return '0%';
  }
  const clamped = Math.max(0, Math.min(1, confidence));
  return `${Math.round(clamped * 100)}%`;
}

export function formatIsoDate(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch {
    return 'Invalid date';
  }
}

export function calculateStackHealthScore(components: Array<{ status: string; confidence: number }>): number {
  if (!components || components.length === 0) return 0;

  let totalScore = 0;
  for (const comp of components) {
    let weight = 1.0;
    if (comp.status === 'operational') weight = 1.0;
    else if (comp.status === 'review') weight = 0.6;
    else if (comp.status === 'deprecated') weight = 0.2;
    else if (comp.status === 'unverified') weight = 0.4;

    const conf = Math.max(0, Math.min(1, comp.confidence || 0.5));
    totalScore += weight * conf;
  }

  const normalized = (totalScore / components.length) * 100;
  return Math.round(normalized);
}

export function getStatusDetails(status: string): {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'cyan';
  accessibleSymbol: string;
} {
  switch (status.toLowerCase()) {
    case 'outcome_verified':
      return { label: 'Outcome Verified', tone: 'success', accessibleSymbol: '★' };
    case 'executed':
      return { label: 'Executed (Pending Outcome)', tone: 'cyan', accessibleSymbol: '⚙' };
    case 'approved':
      return { label: 'Approved (Not Executed)', tone: 'info', accessibleSymbol: '✓' };
    case 'awaiting_approval':
      return { label: 'Awaiting Approval', tone: 'warning', accessibleSymbol: '⏳' };
    case 'draft':
      return { label: 'Draft', tone: 'neutral', accessibleSymbol: '○' };
    case 'rejected':
      return { label: 'Rejected', tone: 'danger', accessibleSymbol: '✖' };
    case 'operational':
    case 'accepted':
    case 'healthy':
    case 'verified':
    case 'ok':
      return { label: 'Operational', tone: 'success', accessibleSymbol: '●' };
    case 'review':
    case 'under_review':
    case 'in_progress':
    case 'action_required':
      return { label: 'Review Required', tone: 'warning', accessibleSymbol: '▲' };
    case 'deprecated':
    case 'critical':
    case 'down':
      return { label: 'Deprecated / Critical', tone: 'danger', accessibleSymbol: '✖' };
    case 'unverified':
    case 'proposed':
      return { label: 'Unverified / Proposed', tone: 'info', accessibleSymbol: '◆' };
    case 'superseded':
      return { label: 'Superseded', tone: 'neutral', accessibleSymbol: '⊘' };
    default:
      return { label: status, tone: 'neutral', accessibleSymbol: '○' };
  }
}

/**
 * Security: Validates external links to only allow standard http/https schemes.
 * Rejects javascript:, data:, file:, and malformed URIs to prevent XSS.
 */
export function isValidHttpUrl(urlString?: string | null): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Security: Sanitizes user input with length boundary enforcement.
 */
export function sanitizeInput(input?: string | null, maxLength = 250): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

