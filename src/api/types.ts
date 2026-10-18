/**
 * Stack Intel — Centralized API & Domain Types
 * Defines confirmed backend contracts, domain models, and unconfirmed endpoints.
 */

export type DataMode = 'live' | 'demo';

export interface EvidenceProvenance {
  sourceType: 'repo_config' | 'package_manifest' | 'telemetry_metric' | 'dns_record' | 'manual_audit' | 'synthetic_fixture';
  sourceName: string;
  sourceUri?: string;
  confidence: number; // 0.0 to 1.0
  verifiedAt: string;
  verifiedBy?: string;
  notes?: string;
}

export type TechStatus = 'operational' | 'review' | 'deprecated' | 'unverified';
export type TechCategory = 
  | 'Infrastructure'
  | 'Database & Graph'
  | 'Backend API'
  | 'Frontend'
  | 'Observability'
  | 'Security'
  | 'CI/CD'
  | 'AI & Machine Learning';

export interface KeyTechnology {
  id: string;
  name: string;
  category: TechCategory;
  version?: string;
  status: TechStatus;
  confidence: number;
  evidenceSource: string;
  license?: string;
  lastAudited: string;
  dependenciesCount?: number;
  provenance: EvidenceProvenance;
}

export interface CompanyGoal {
  id: string;
  title: string;
  description: string;
  category: 'efficiency' | 'latency' | 'reliability' | 'cost' | string;
  baseline?: string;
  target?: string;
  metric?: string;
  timeframe?: string;
  isSynthetic?: boolean;
}

export interface CompanyConstraint {
  id: string;
  type: 'approval' | 'observability' | 'compliance' | string;
  statement: string;
  rationale?: string;
}

export interface ToolAlternative {
  name: string;
  type: 'alternative' | 'retention';
  overview: string;
  tradeoffs: string[];
  risks: string[];
  evidenceAvailable: string;
  unknowns: string[];
  estimatedCostRange?: string;
}

export interface ToolComparison {
  currentConfig: {
    name: string;
    rationale: string;
    advantages: string[];
    tradeoffs: string[];
    risks: string[];
    monthlyCost: number;
  };
  alternatives: ToolAlternative[];
}

export interface StackToolItem {
  id: string;
  name: string;
  monthlyCost: number;
  currency: string;
  role: string;
  category: TechCategory;
  explicitlySupportedGoalIds?: string[];
  evidence: string;
  constraints: string[];
  knownDependencies: string[];
  missingInformation: string[];
  relatedOpportunities: Array<{
    id: string;
    title: string;
    type: 'optimization' | 'evaluation' | 'architecture';
    description: string;
    status: 'available' | 'in_progress' | 'completed';
  }>;
  comparison?: ToolComparison;
  provenance: EvidenceProvenance;
}

// ==========================================
// EVIDENCE & INVESTIGATION EXPLAINABILITY TYPES
// ==========================================

export type EvidenceOrigin = 'public_source' | 'user_provided' | 'synthetic_demo';
export type EvidenceStatus = 'verified' | 'derived' | 'hypothesis' | 'unknown' | 'contradicted' | 'stale' | 'not_applicable';

export interface InvestigationRequirement {
  id: string;
  title: string;
  description: string;
  status: EvidenceStatus;
  evidenceOrigin: EvidenceOrigin;
  evidenceText?: string;
  sourceUrl?: string;
  unknowns?: string[];
  contradictions?: string[];
  userSubmittedEvidence?: {
    url?: string;
    note?: string;
    submittedAt?: string;
  };
}

export type LifecycleStageType =
  | 'potential_benefits'
  | 'application_submitted'
  | 'approval_pending'
  | 'credits_received'
  | 'credits_consumed'
  | 'realized_savings';

export interface LifecycleStageItem {
  stage: LifecycleStageType;
  label: string;
  status: 'completed' | 'current' | 'future' | 'not_started';
  note: string;
}

export type RelationshipNodeType = 'company' | 'goal' | 'opportunity' | 'requirement' | 'evidence' | 'assessment';
export type RelationshipStatus = 'confirmed' | 'candidate' | 'unknown';

export interface RelationshipPathNode {
  id: string;
  type: RelationshipNodeType;
  label: string;
  subtext?: string;
  status?: RelationshipStatus;
}

export interface RelationshipPathEdge {
  from: string;
  to: string;
  label: string;
  relationshipStatus: RelationshipStatus;
}

export interface RelationshipPathData {
  isSynthetic: boolean;
  nodes: RelationshipPathNode[];
  edges: RelationshipPathEdge[];
}

export interface InvestigationRecommendation {
  id: string;
  title: string;
  goalId?: string;
  goalTitle?: string;
  summary: string;
  facts: string[];
  hypotheses: string[];
  risks: string[];
  tradeoffs: string[];
  suggestedNextStep: string;
  approvalRequired: boolean;
  allowRetainingCurrentSetup: boolean;
  retainingOptionRationale?: string;
  executionOutcomeStatus?: 'not_started' | 'under_review' | 'approved' | 'rejected' | 'implemented';
}

export type InvestigationSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type InvestigationStatus = 'in_progress' | 'verified' | 'action_required' | 'resolved';

export interface InvestigationItem {
  id: string;
  company_id: string;
  title: string;
  category: 'Security Vulnerability' | 'License Compliance' | 'Vendor Lock-in' | 'Migration ROI' | 'Graph Architecture' | 'Cost Optimization' | 'Operational Efficiency';
  status: InvestigationStatus;
  severity: InvestigationSeverity;
  openedAt: string;
  updatedAt: string;
  leadInvestigator: string;
  summary: string;
  affectedComponents: string[];
  evidenceFindings: Array<{
    findingId: string;
    claim: string;
    evidenceConfidence: number;
    source: string;
  }>;
  relatedToolId?: string;
  opportunityId?: string;
  officialSourceUrl?: string;
  requirements?: InvestigationRequirement[];
  lifecycleStages?: LifecycleStageItem[];
  relationshipPath?: RelationshipPathData;
  recommendations?: InvestigationRecommendation[];
  missingInformation?: string[];
  limitations?: string[];
  isSynthetic?: boolean;
}

// ==========================================
// CUSTOM SANDBOX TYPES
// ==========================================

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
  overview: CompanyOverviewResponse;
  investigations: InvestigationItem[];
}

// ==========================================
// CONFIRMED BACKEND CONTRACTS
// ==========================================

/** Confirmed: GET /health */
export interface HealthResponse {
  status: 'ok' | 'healthy' | 'degraded' | string;
  graph?: string;
  timestamp?: string;
  version?: string;
  database?: string;
  services?: Record<string, 'up' | 'down' | 'degraded' | string>;
}

/** Confirmed: POST /companies/{company_id}/investigate */
export interface BackendInvestigationRequest {
  question: string;
}

export interface BackendInvestigationFinding {
  title: string;
  statement: string;
  type: 'fact' | 'inference' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  evidence_ids: string[];
}

export interface BackendInvestigationRecommendation {
  title: string;
  rationale: string;
  expected_benefit: string;
  risk: string;
  status: 'proposed' | 'do_nothing';
  evidence_ids: string[];
  requires_human_approval?: boolean;
}

export interface BackendInvestigationAnalysis {
  executive_summary: string;
  findings: BackendInvestigationFinding[];
  recommendations: BackendInvestigationRecommendation[];
  open_questions: string[];
}

export interface BackendInvestigationResponse {
  company_id: string;
  company_name: string;
  data_type: string;
  model?: string;
  evidence_count: number;
  analysis: BackendInvestigationAnalysis;
  notice: string;
}

/** Confirmed: POST /companies/{company_id}/actions */
export interface BackendActionRequest {
  title: string;
  rationale: string;
  evidence_ids: string[];
  action_type?: 'investigation' | 'production_change';
  preserves_monitoring?: boolean;
}

export interface BackendActionResponse {
  action_id: string;
  company_id: string;
  status: 'awaiting_approval' | 'proposed';
  requires_human_approval: boolean;
  message: string;
}

/** Confirmed: POST /companies/{company_id}/actions/{action_id}/review */
export interface BackendActionReviewRequest {
  decision: 'approved' | 'rejected';
}

export interface BackendActionReviewResponse {
  action_id: string;
  status: 'approved' | 'rejected';
}

/** Confirmed: POST /companies/{company_id}/actions/{action_id}/simulate */
export interface BackendActionSimulateResponse {
  action_id: string;
  status: 'simulated';
  notice: string;
}

/** Confirmed: GET /companies/{company_id}/overview */
export interface CompanyOverviewResponse {
  company_id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  employee_count?: number | string;
  primary_domain: string;
  headquarters?: string;
  last_analyzed_at: string;
  is_synthetic?: boolean;
  currency?: string;
  total_monthly_cost?: number;
  tools?: StackToolItem[];
  goals?: CompanyGoal[];
  constraints?: CompanyConstraint[];
  opportunities?: Array<{
    id: string;
    title: string;
    description: string;
    relatedTool?: string;
    type: string;
    actionable: boolean;
  }>;
  pending_decisions?: DecisionRecord[];
  recorded_outcomes?: Array<{
    id: string;
    decisionCode: string;
    title: string;
    outcome: string;
    verifiedAt: string;
  }>;
  stack_summary?: {
    total_technologies: number;
    core_categories: string[];
    critical_dependencies: number;
    compliance_score?: number;
  };
  key_technologies?: KeyTechnology[];
  recent_activity?: Array<{
    id: string;
    action: string;
    timestamp: string;
    author?: string;
    summary: string;
  }>;
}

// ==========================================
// UNCONFIRMED / PLANNED CONTRACTS (PARTS 2-4)
// ==========================================

export interface TechStackComponent extends KeyTechnology {
  description?: string;
  ecosystem?: string;
  monthlyCostEstimate?: number;
  openIssuesCount?: number;
  eolDate?: string;
  vulnerabilities?: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    summary: string;
  }>;
}

export interface StackHubResponse {
  company_id: string;
  total_components: number;
  categories: Array<{
    name: TechCategory;
    count: number;
  }>;
  components: TechStackComponent[];
}

export type DecisionStatus =
  | 'draft'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'executed'
  | 'outcome_verified'
  | 'accepted'
  | 'proposed'
  | 'superseded'
  | 'under_review';

export interface DecisionRecord {
  id: string;
  company_id: string;
  code: string;
  title: string;
  status: DecisionStatus;
  date: string;
  authors: string[];
  context: string;
  decision: string;
  consequences: string[];
  affectedComponents: string[];
  provenance: EvidenceProvenance;
  isLocallySimulated?: boolean;
  simulatedActionNote?: string;
  executionNote?: string;
  outcomeNote?: string;
}

export type MemoryEventType =
  | 'stack_detected'
  | 'constraint_audited'
  | 'opportunity_identified'
  | 'decision_recorded'
  | 'evidence_verified'
  | 'policy_check';

export interface MemoryEvent {
  id: string;
  company_id: string;
  timestamp: string;
  eventType: MemoryEventType;
  summary: string;
  details?: string;
  relatedDecisionCode?: string;
  relatedRequirementId?: string;
  relatedToolId?: string;
  isSynthetic?: boolean;
}

export interface PlaybookItem {
  id: string;
  code: string;
  title: string;
  category: string;
  triggerCondition: string;
  steps: string[];
  humanApprovalRequired: boolean;
  governingConstraint: string;
  isSynthetic?: boolean;
}

export interface CompanySummaryItem {
  id: string;
  name: string;
  domain: string;
  industry: string;
  tier: string;
  isSynthetic?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  endpoint: string;
  isNetworkError: boolean;
  unconfirmedEndpoint?: boolean;
}
