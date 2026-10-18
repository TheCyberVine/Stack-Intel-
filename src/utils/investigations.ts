/**
 * Stack Intel — Investigations & Explainability Logic Utilities
 */

export type EvidenceStatus = 'verified' | 'derived' | 'hypothesis' | 'unknown' | 'contradicted' | 'stale' | 'not_applicable';
export type EvidenceOrigin = 'public_source' | 'user_provided' | 'synthetic_demo';
export type RelationshipStatus = 'confirmed' | 'candidate' | 'unknown';

export interface SandboxAssessmentInput {
  companyName: string;
  description: string;
  stage: string;
  currency: string;
  goals: string[];
  tools: Array<{ name: string; monthlyCost: number }>;
  constraints: string[];
  painPoints?: string;
}

export interface SandboxAssessmentResult {
  id: string;
  companyName: string;
  isCustomSandbox: true;
  createdAt: string;
  overview: any;
  investigations: any[];
}

export function getEvidenceStatusDetails(status: EvidenceStatus): {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  symbol: string;
} {
  switch (status) {
    case 'verified':
      return { label: 'Verified', tone: 'success', symbol: '●' };
    case 'derived':
      return { label: 'Derived', tone: 'info', symbol: '◆' };
    case 'hypothesis':
      return { label: 'Hypothesis', tone: 'warning', symbol: '▲' };
    case 'unknown':
      return { label: 'Unknown (Needs Evidence)', tone: 'neutral', symbol: '○' };
    case 'contradicted':
      return { label: 'Contradicted', tone: 'danger', symbol: '✖' };
    case 'stale':
      return { label: 'Stale Evidence', tone: 'warning', symbol: '◷' };
    case 'not_applicable':
      return { label: 'Not Applicable', tone: 'neutral', symbol: '—' };
    default:
      return { label: status, tone: 'neutral', symbol: '?' };
  }
}

export function getEvidenceOriginDetails(origin: EvidenceOrigin): {
  label: string;
  tone: 'info' | 'cyan' | 'neutral' | 'warning';
} {
  switch (origin) {
    case 'public_source':
      return { label: 'Public Source', tone: 'cyan' };
    case 'user_provided':
      return { label: 'User-Provided (Pending Audit)', tone: 'warning' };
    case 'synthetic_demo':
      return { label: 'Synthetic Demo Fixture', tone: 'neutral' };
    default:
      return { label: origin, tone: 'neutral' };
  }
}

export function getRelationshipStatusDetails(status: RelationshipStatus): {
  label: string;
  tone: 'success' | 'warning' | 'neutral';
  symbol: string;
} {
  switch (status) {
    case 'confirmed':
      return { label: 'Confirmed Relationship', tone: 'success', symbol: '—✓—' };
    case 'candidate':
      return { label: 'Candidate Path', tone: 'warning', symbol: '--?--' };
    case 'unknown':
      return { label: 'Unknown Edge', tone: 'neutral', symbol: '··?··' };
    default:
      return { label: status, tone: 'neutral', symbol: '---' };
  }
}

/**
 * Generates an isolated custom sandbox assessment in current React session state.
 * Strictly avoids inheriting RelayForge data or fabricating persistent records.
 */
export function generateCustomSandboxAssessment(input: SandboxAssessmentInput): SandboxAssessmentResult {
  const sandboxId = `sandbox-${Date.now()}`;
  const currency = input.currency || 'USD';
  const totalCost = input.tools.reduce((sum, t) => sum + (Number(t.monthlyCost) || 0), 0);

  // Generate overview
  const overview = {
    company_id: sandboxId,
    name: input.companyName,
    description: input.description,
    industry: 'Custom Sandbox Assessment',
    stage: input.stage,
    primary_domain: 'sandbox.local',
    last_analyzed_at: new Date().toISOString(),
    is_synthetic: true,
    currency,
    total_monthly_cost: totalCost,
    goals: input.goals.map((g, idx) => ({
      id: `custom-goal-${idx + 1}`,
      title: g,
      description: `User-defined goal: ${g}`,
      category: 'user_defined',
      isSynthetic: true
    })),
    constraints: input.constraints.map((c, idx) => ({
      id: `custom-con-${idx + 1}`,
      type: 'operational',
      statement: c,
      rationale: 'Specified in custom sandbox evaluation form.'
    })),
    tools: input.tools.map((t, idx) => ({
      id: `custom-tool-${idx + 1}`,
      name: t.name,
      monthlyCost: Number(t.monthlyCost) || 0,
      currency,
      role: 'User-specified infrastructure / service component',
      category: 'Infrastructure',
      evidence: 'User-provided form submission (Self-Reported)',
      constraints: input.constraints,
      knownDependencies: [],
      missingInformation: [
        'Detailed sub-resource telemetry not provided',
        'Official vendor billing invoice unverified'
      ],
      relatedOpportunities: [
        {
          id: `opp-custom-${idx + 1}`,
          title: `Audit ${t.name} Cost Optimization & Architecture`,
          type: 'evaluation',
          description: `Assess ${t.name} monthly expenditure against stated goals.`,
          status: 'available'
        }
      ],
      provenance: {
        sourceType: 'synthetic_fixture',
        sourceName: 'Custom Sandbox Session State',
        confidence: 0.7,
        verifiedAt: new Date().toISOString(),
        notes: 'User-reported input during custom sandbox session.'
      }
    })),
    opportunities: [
      {
        id: 'opp-sb-1',
        title: 'Perform Holistic Stack Feasibility & Spend Review',
        description: `Evaluate total ${currency} ${totalCost}/mo allocation across ${input.tools.length} configured tools.`,
        type: 'Assessment Opportunity',
        actionable: true
      }
    ],
    pending_decisions: [],
    recorded_outcomes: [],
    stack_summary: {
      total_technologies: input.tools.length,
      core_categories: ['Infrastructure'],
      critical_dependencies: input.tools.length,
      compliance_score: 90
    },
    key_technologies: [],
    recent_activity: []
  };

  // Generate investigation for custom sandbox
  const investigations = [
    {
      id: `inv-sb-${Date.now()}`,
      company_id: sandboxId,
      title: `Custom Assessment: ${input.companyName} Stack & Goal Feasibility`,
      category: 'Cost Optimization',
      status: 'in_progress',
      severity: 'medium',
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leadInvestigator: 'Interactive Sandbox Session',
      summary: `Initial evaluation of ${input.companyName}'s reported tools (${input.tools.map(t => `${t.name}: $${t.monthlyCost}`).join(', ')}) in relation to declared goals. Relationship paths and prerequisites remain hypotheses pending evidence verification.`,
      affectedComponents: input.tools.map((t) => t.name),
      evidenceFindings: [
        {
          findingId: 'f-sb-01',
          claim: `Self-reported total monthly expenditure of ${currency} ${totalCost}`,
          evidenceConfidence: 0.7,
          source: 'User Input (Sandbox Form)'
        }
      ],
      requirements: [
        {
          id: 'req-sb-1',
          title: 'Direct Invoice Verification',
          description: 'Upload or connect official billing export for declared tools.',
          status: 'unknown',
          evidenceOrigin: 'user_provided',
          unknowns: ['Actual metered usage vs listed estimate unconfirmed']
        },
        {
          id: 'req-sb-2',
          title: 'Goal Metric Validation',
          description: 'Establish baseline telemetry metrics for stated goals.',
          status: 'unknown',
          evidenceOrigin: 'user_provided',
          unknowns: ['Quantitative baseline currently unmeasured']
        }
      ],
      relationshipPath: {
        isSynthetic: true,
        nodes: [
          { id: 'n1', type: 'company', label: input.companyName, status: 'confirmed' },
          { id: 'n2', type: 'goal', label: input.goals[0] || 'Efficiency', status: 'candidate' },
          { id: 'n3', type: 'opportunity', label: 'Stack Optimization', status: 'candidate' },
          { id: 'n4', type: 'requirement', label: 'Evidence Audit', status: 'unknown' },
          { id: 'n5', type: 'assessment', label: 'Session Recommendation', status: 'candidate' }
        ],
        edges: [
          { from: 'n1', to: 'n2', label: 'defines', relationshipStatus: 'confirmed' },
          { from: 'n2', to: 'n3', label: 'triggers', relationshipStatus: 'candidate' },
          { from: 'n3', to: 'n4', label: 'requires', relationshipStatus: 'candidate' },
          { from: 'n4', to: 'n5', label: 'informs', relationshipStatus: 'unknown' }
        ]
      },
      recommendations: [
        {
          id: 'rec-sb-1',
          title: 'Retain Current Setup While Auditing Resource Headroom',
          summary: 'Maintain current tool setup to prevent migration churn. Gather 30-day utilization telemetry before altering infrastructure commitments.',
          facts: [`Currently reporting ${input.tools.length} active tools with ${currency} ${totalCost}/mo total spend.`],
          hypotheses: ['Potential over-provisioning or reserved tier savings might exist.'],
          risks: ['Premature migration introduces downtime and configuration complexity.'],
          tradeoffs: ['Retaining existing configuration guarantees stability with zero engineer hours spent on migration.'],
          suggestedNextStep: 'Collect 14 days of CPU, memory, and error telemetry before committing to structural changes.',
          approvalRequired: true,
          allowRetainingCurrentSetup: true,
          retainingOptionRationale: 'Preserves stability without committing engineering time to unverified migrations.'
        }
      ]
    }
  ];

  return {
    id: sandboxId,
    companyName: input.companyName,
    isCustomSandbox: true,
    createdAt: new Date().toISOString(),
    overview,
    investigations
  };
}
