export interface NormalizedGoal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  baseline?: string;
  target?: string;
  metric?: string;
  timeframe?: string;
  isSynthetic?: boolean;
}

export interface NormalizedConstraint {
  id: string;
  type: string;
  statement: string;
  rationale?: string;
}

export interface NormalizedToolItem {
  id: string;
  name: string;
  monthlyCost: number;
  currency: string;
  role: string;
  category: string;
  explicitlySupportedGoalIds?: string[];
  evidence?: string;
  constraints?: string[];
  knownDependencies?: string[];
  missingInformation?: string[];
  relatedOpportunities?: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    status: string;
  }>;
  comparison?: {
    currentConfig: {
      name: string;
      rationale: string;
      advantages: string[];
      tradeoffs: string[];
      risks: string[];
      monthlyCost: number;
    };
    alternatives: Array<{
      name: string;
      type: string;
      overview: string;
      tradeoffs: string[];
      risks: string[];
      evidenceAvailable: string;
      unknowns: string[];
      estimatedCostRange?: string;
    }>;
  };
  provenance?: {
    sourceType: string;
    sourceName: string;
    confidence: number;
    verifiedAt: string;
    notes?: string;
  };
}

export interface NormalizedOverview {
  company_id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  employee_count?: number | string;
  primary_domain: string;
  headquarters?: string;
  last_analyzed_at: string;
  is_synthetic: boolean;
  currency: string;
  total_monthly_cost: number;
  tools: NormalizedToolItem[];
  goals: NormalizedGoal[];
  constraints: NormalizedConstraint[];
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    relatedTool?: string;
    type: string;
    actionable: boolean;
  }>;
  pending_decisions: Array<{
    id: string;
    code: string;
    title: string;
    status: string;
    date: string;
  }>;
  recorded_outcomes: Array<{
    id: string;
    decisionCode: string;
    title: string;
    outcome: string;
    verifiedAt: string;
  }>;
  stack_summary: {
    total_technologies: number;
    core_categories: string[];
    critical_dependencies: number;
    compliance_score?: number;
  };
  key_technologies: unknown[];
  recent_activity: unknown[];
}

/**
 * Normalizes raw company overview responses from the API or fixtures.
 * Handles missing optional fields, calculates total monthly costs,
 * and ensures arrays are never null/undefined.
 */
export function normalizeCompanyOverview(
  raw: Record<string, unknown>,
  fallbackCompanyId: string
): NormalizedOverview {
  const companyId = String(raw?.company_id || fallbackCompanyId || '');
  const name = String(raw?.name || companyId || 'Unknown Entity');
  const description = String(raw?.description || '');
  const industry = String(raw?.industry || 'Technology');
  const stage = String(raw?.stage || 'Undisclosed');
  const primaryDomain = String(raw?.primary_domain || raw?.domain || 'N/A');
  const currency = String(raw?.currency || 'USD');
  const isSynthetic = Boolean(raw?.is_synthetic);

  // Extract tools or map from key_technologies
  let tools: NormalizedToolItem[] = [];
  if (Array.isArray(raw?.tools)) {
    tools = (raw.tools as unknown[]).map((item) => {
      const t = (item || {}) as Record<string, unknown>;
      return {
        id: String(t.id || ''),
        name: String(t.name || ''),
        monthlyCost: typeof t.monthlyCost === 'number' ? t.monthlyCost : 0,
        currency: String(t.currency || currency),
        role: String(t.role || 'Service Component'),
        category: String(t.category || 'Infrastructure'),
        explicitlySupportedGoalIds: Array.isArray(t.explicitlySupportedGoalIds) ? (t.explicitlySupportedGoalIds as string[]) : [],
        evidence: String(t.evidence || ''),
        constraints: Array.isArray(t.constraints) ? (t.constraints as string[]) : [],
        knownDependencies: Array.isArray(t.knownDependencies) ? (t.knownDependencies as string[]) : [],
        missingInformation: Array.isArray(t.missingInformation) ? (t.missingInformation as string[]) : [],
        relatedOpportunities: Array.isArray(t.relatedOpportunities) ? (t.relatedOpportunities as NormalizedToolItem['relatedOpportunities']) : [],
        comparison: t.comparison as NormalizedToolItem['comparison'],
        provenance: t.provenance as NormalizedToolItem['provenance']
      };
    });
  } else if (Array.isArray(raw?.key_technologies)) {
    // If backend returns key_technologies instead of tools array
    tools = (raw.key_technologies as unknown[]).map((kt: any) => ({
      id: String(kt.id || ''),
      name: String(kt.name || ''),
      monthlyCost: 0,
      currency,
      role: String(kt.category || 'Core Stack Component'),
      category: String(kt.category || 'Infrastructure'),
      evidence: String(kt.evidenceSource || 'Repository configuration'),
      constraints: [],
      knownDependencies: [],
      missingInformation: ['Cost metrics not provided by endpoint'],
      relatedOpportunities: [],
      provenance: kt.provenance
    }));
  }

  // Calculate or verify total monthly cost
  let totalCost = typeof raw?.total_monthly_cost === 'number' ? raw.total_monthly_cost : 0;
  if (!totalCost && tools.length > 0) {
    totalCost = tools.reduce((acc, t) => acc + (t.monthlyCost || 0), 0);
  }

  // Extract goals
  const goals: NormalizedGoal[] = Array.isArray(raw?.goals)
    ? (raw.goals as NormalizedGoal[])
    : [];

  // Extract constraints
  const constraints: NormalizedConstraint[] = Array.isArray(raw?.constraints)
    ? (raw.constraints as NormalizedConstraint[])
    : [];

  // Extract opportunities
  const opportunities = Array.isArray(raw?.opportunities)
    ? (raw.opportunities as NormalizedOverview['opportunities'])
    : [];

  // Extract pending decisions and recorded outcomes
  const pendingDecisions = Array.isArray(raw?.pending_decisions)
    ? (raw.pending_decisions as NormalizedOverview['pending_decisions'])
    : [];

  const recordedOutcomes = Array.isArray(raw?.recorded_outcomes)
    ? (raw.recorded_outcomes as NormalizedOverview['recorded_outcomes'])
    : [];

  return {
    company_id: companyId,
    name,
    description,
    industry,
    stage,
    employee_count: (raw?.employee_count as number | string) || undefined,
    primary_domain: primaryDomain,
    headquarters: raw?.headquarters ? String(raw.headquarters) : undefined,
    last_analyzed_at: String(raw?.last_analyzed_at || new Date().toISOString()),
    is_synthetic: isSynthetic,
    currency,
    total_monthly_cost: totalCost,
    tools,
    goals,
    constraints,
    opportunities,
    pending_decisions: pendingDecisions,
    recorded_outcomes: recordedOutcomes,
    stack_summary: (raw?.stack_summary as NormalizedOverview['stack_summary']) || {
      total_technologies: tools.length,
      core_categories: Array.from(new Set(tools.map((t) => t.category))),
      critical_dependencies: tools.length,
      compliance_score: 95
    },
    key_technologies: Array.isArray(raw?.key_technologies) ? raw.key_technologies : [],
    recent_activity: Array.isArray(raw?.recent_activity) ? raw.recent_activity : []
  };
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
