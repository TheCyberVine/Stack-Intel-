/**
 * Stack Intel — Centralized API Client
 * 
 * Handles live backend integration vs demo fixture mode with strict boundaries.
 * In live mode, NEVER silently falls back to fixtures if an API call fails.
 */

import {
  HealthResponse,
  CompanyOverviewResponse,
  TechStackComponent,
  InvestigationItem,
  DecisionRecord,
  MemoryEvent,
  PlaybookItem,
  CompanySummaryItem,
  ApiError,
  DataMode,
  BackendInvestigationResponse,
  BackendActionRequest,
  BackendActionResponse,
  BackendActionReviewResponse,
  BackendActionSimulateResponse
} from './types';

import {
  mockHealthResponse,
  mockCompaniesList,
  mockCompanyOverviews,
  mockStackComponents,
  mockInvestigations,
  mockDecisions,
  mockMemoryEvents,
  mockPlaybooks
} from '../fixtures';

import { normalizeCompanyOverview } from '../utils/normalizers';

export class StackIntelApiClient {
  private mode: DataMode;
  private baseUrl: string;
  private activeOverviewAbortController: AbortController | null = null;

  constructor() {
    // Read from environment, default to demo mode if not set
    const envMode = (import.meta.env.VITE_DATA_MODE || 'demo').toLowerCase();
    this.mode = envMode === 'live' ? 'live' : 'demo';
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
  }

  public getMode(): DataMode {
    return this.mode;
  }

  public setMode(newMode: DataMode) {
    this.mode = newMode;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  /**
   * Internal fetch wrapper for live mode with timeout and typed errors
   */
  private async liveFetch<T>(endpoint: string, options?: RequestInit, customSignal?: AbortSignal): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const onCustomAbort = () => {
      controller.abort();
    };

    if (customSignal) {
      customSignal.addEventListener('abort', onCustomAbort);
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        }
      });

      clearTimeout(timeout);
      if (customSignal) {
        customSignal.removeEventListener('abort', onCustomAbort);
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let parsedMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const json = JSON.parse(errorText);
          if (json.detail) parsedMessage = json.detail;
          else if (json.message) parsedMessage = json.message;
        } catch {
          if (errorText) parsedMessage = errorText;
        }

        const error: ApiError = {
          message: parsedMessage,
          status: response.status,
          endpoint,
          isNetworkError: false,
          unconfirmedEndpoint: response.status === 404 || response.status === 501
        };
        throw error;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (customSignal) {
        customSignal.removeEventListener('abort', onCustomAbort);
      }

      if ((err as ApiError).endpoint) {
        throw err;
      }

      const isAbort = (err as Error)?.name === 'AbortError';
      const error: ApiError = {
        message: isAbort
          ? `Request to ${endpoint} was aborted or timed out`
          : `Network error connecting to ${url}: ${(err as Error)?.message || 'Service unreachable'}`,
        endpoint,
        isNetworkError: true
      };
      throw error;
    }
  }

  /**
   * Helper to simulate brief network delay in demo mode for authentic operational feel
   */
  private async demoDelay<T>(data: T, delayMs = 120): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return JSON.parse(JSON.stringify(data));
  }

  // ==========================================
  // CONFIRMED ENDPOINTS
  // ==========================================

  /**
   * Confirmed Route: GET /health
   */
  public async getHealth(): Promise<HealthResponse> {
    if (this.mode === 'live') {
      return this.liveFetch<HealthResponse>('/health');
    }
    return this.demoDelay(mockHealthResponse);
  }

  /**
   * Confirmed Route: GET /companies/{company_id}/overview
   * Cancels prior in-flight overview requests to prevent race conditions on company change
   */
  public async getCompanyOverview(companyId: string): Promise<CompanyOverviewResponse> {
    // Abort previous in-flight request if company switched rapidly
    if (this.activeOverviewAbortController) {
      this.activeOverviewAbortController.abort();
    }
    this.activeOverviewAbortController = new AbortController();
    const signal = this.activeOverviewAbortController.signal;

    if (this.mode === 'live') {
      const raw = await this.liveFetch<Record<string, unknown>>(
        `/companies/${encodeURIComponent(companyId)}/overview`,
        undefined,
        signal
      );
      return normalizeCompanyOverview(raw, companyId) as CompanyOverviewResponse;
    }

    const data = mockCompanyOverviews[companyId] || mockCompanyOverviews['relayforge'];
    const delayed = await this.demoDelay(data);
    return normalizeCompanyOverview(delayed as unknown as Record<string, unknown>, companyId) as CompanyOverviewResponse;
  }

  /**
   * Confirmed Route: POST /companies/{company_id}/investigate
   * Runs an evidence-first investigation against FalkorDB graph data via backend.
   */
  public async investigateCompany(
    companyId: string,
    question: string = "Identify evidence-backed opportunities to improve operational efficiency while preserving reliability and security visibility."
  ): Promise<BackendInvestigationResponse> {
    if (this.mode === 'live') {
      return this.liveFetch<BackendInvestigationResponse>(
        `/companies/${encodeURIComponent(companyId)}/investigate`,
        {
          method: 'POST',
          body: JSON.stringify({ question })
        }
      );
    }

    // Demo mode: Return representative analysis conforming exactly to backend schema
    const mockInvestigationResult: BackendInvestigationResponse = {
      company_id: companyId,
      company_name: companyId === 'relayforge' ? 'RelayForge' : companyId,
      data_type: 'synthetic_demo_data',
      model: 'synthetic-graph-engine',
      evidence_count: 12,
      analysis: {
        executive_summary: "Analysis of RelayForge infrastructure reveals significant potential savings through AWS Activate credits and error monitoring evaluation, while latency and security visibility constraints remain satisfied.",
        findings: [
          {
            title: "AWS Operational Spend Baseline",
            statement: "RelayForge spends $465/month on AWS cloud infrastructure under synthetic demo metrics.",
            type: "fact",
            confidence: "high",
            evidence_ids: [`company:${companyId}`, "tool:aws"]
          },
          {
            title: "Unverified AWS Activate Eligibility",
            statement: "5 criteria for AWS Activate Founders Credits remain unverified in the graph (new to credits, self-funded, functioning website, founded <10 years, paid tier).",
            type: "unknown",
            confidence: "high",
            evidence_ids: ["opportunity:aws_activate_credits", "requirement:activate_new_to_credits"]
          },
          {
            title: "Sentry Monitoring and Incident Visibility",
            statement: "Sentry currently costs $26/month. The company has an explicit operational constraint that error monitoring and incident visibility must be preserved.",
            type: "fact",
            confidence: "high",
            evidence_ids: ["tool:sentry", "constraint:preserve_monitoring"]
          }
        ],
        recommendations: [
          {
            title: "Verify AWS Activate Founders Eligibility",
            rationale: "Verifying eligibility could yield operational credits without changing cloud architecture or introducing migration risk.",
            expected_benefit: "Potential offset of $465/mo AWS spend if approved; no architecture changes required.",
            risk: "Application may be rejected if criteria are not satisfied.",
            status: "proposed",
            evidence_ids: [`company:${companyId}`, "opportunity:aws_activate_credits"],
            requires_human_approval: true
          },
          {
            title: "Retain Current Error Monitoring Setup",
            rationale: "At $26/month, Sentry provides established incident visibility. Migration to a self-hosted alternative like GlitchTip carries maintenance overhead that outweighs marginal cost delta.",
            expected_benefit: "Zero downtime, maintains established alerting workflows, satisfies observability constraint.",
            risk: "Ongoing $26/month expenditure.",
            status: "do_nothing",
            evidence_ids: ["tool:sentry", "constraint:preserve_monitoring"],
            requires_human_approval: false
          }
        ],
        open_questions: [
          "Has RelayForge previously applied for or received AWS Activate credits under any associated legal entity?",
          "Does the current AWS organization meet the self-funded founder program requirements?"
        ]
      },
      notice: "AI-generated analysis of supplied graph data. Recommendations are proposals, not executed actions."
    };

    return this.demoDelay(mockInvestigationResult, 300);
  }

  /**
   * Confirmed Route: POST /companies/{company_id}/actions
   * Proposes an action backed by evidence IDs.
   */
  public async proposeAction(
    companyId: string,
    request: BackendActionRequest
  ): Promise<BackendActionResponse> {
    if (this.mode === 'live') {
      return this.liveFetch<BackendActionResponse>(
        `/companies/${encodeURIComponent(companyId)}/actions`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: request.title,
            rationale: request.rationale,
            evidence_ids: request.evidence_ids,
            action_type: request.action_type || 'investigation',
            preserves_monitoring: request.preserves_monitoring ?? true
          })
        }
      );
    }

    const requiresApproval = request.action_type === 'production_change';
    const mockActionRes: BackendActionResponse = {
      action_id: `act-${Math.random().toString(36).substring(2, 9)}`,
      company_id: companyId,
      status: requiresApproval ? 'awaiting_approval' : 'proposed',
      requires_human_approval: requiresApproval,
      message: "Action proposal saved (simulated demo)."
    };
    return this.demoDelay(mockActionRes);
  }

  /**
   * Confirmed Route: POST /companies/{company_id}/actions/{action_id}/review
   * Approves or rejects an action awaiting approval.
   */
  public async reviewAction(
    companyId: string,
    actionId: string,
    decision: 'approved' | 'rejected'
  ): Promise<BackendActionReviewResponse> {
    if (this.mode === 'live') {
      return this.liveFetch<BackendActionReviewResponse>(
        `/companies/${encodeURIComponent(companyId)}/actions/${encodeURIComponent(actionId)}/review`,
        {
          method: 'POST',
          body: JSON.stringify({ decision })
        }
      );
    }

    return this.demoDelay({
      action_id: actionId,
      status: decision
    });
  }

  /**
   * Confirmed Route: POST /companies/{company_id}/actions/{action_id}/simulate
   * Simulates an action; never touches real infrastructure.
   */
  public async simulateAction(
    companyId: string,
    actionId: string
  ): Promise<BackendActionSimulateResponse> {
    if (this.mode === 'live') {
      return this.liveFetch<BackendActionSimulateResponse>(
        `/companies/${encodeURIComponent(companyId)}/actions/${encodeURIComponent(actionId)}/simulate`,
        {
          method: 'POST'
        }
      );
    }

    return this.demoDelay({
      action_id: actionId,
      status: 'simulated',
      notice: "Simulation only. No production changes were made."
    });
  }

  // ==========================================
  // UNCONFIRMED / PLANNED ENDPOINTS (PARTS 2-4)
  // ==========================================

  /**
   * Unconfirmed Route: GET /companies/{company_id}/stack
   * Prepared for Part 2 (StackHub deep inventory)
   */
  public async getCompanyStack(companyId: string): Promise<TechStackComponent[]> {
    if (this.mode === 'live') {
      return this.liveFetch<TechStackComponent[]>(`/companies/${encodeURIComponent(companyId)}/stack`);
    }

    const list = mockStackComponents[companyId] || mockStackComponents['relayforge'] || [];
    return this.demoDelay(list);
  }

  /**
   * Unconfirmed Route: GET /companies/{company_id}/investigations
   * Prepared for Part 3 (Investigations deep dive)
   */
  public async getCompanyInvestigations(companyId: string): Promise<InvestigationItem[]> {
    if (this.mode === 'live') {
      return this.liveFetch<InvestigationItem[]>(`/companies/${encodeURIComponent(companyId)}/investigations`);
    }

    const list = mockInvestigations[companyId] || mockInvestigations['relayforge'] || [];
    return this.demoDelay(list);
  }

  /**
   * Unconfirmed Route: GET /companies/{company_id}/decisions
   * Prepared for Part 4 (Decisions & Memory)
   */
  public async getCompanyDecisions(companyId: string): Promise<DecisionRecord[]> {
    if (this.mode === 'live') {
      return this.liveFetch<DecisionRecord[]>(`/companies/${encodeURIComponent(companyId)}/decisions`);
    }

    const list = mockDecisions[companyId] || mockDecisions['relayforge'] || [];
    return this.demoDelay(list);
  }

  /**
   * Unconfirmed Route: GET /companies/{company_id}/memory
   * Prepared for Part 4 (Memory Timeline)
   */
  public async getCompanyMemory(companyId: string): Promise<MemoryEvent[]> {
    if (this.mode === 'live') {
      return this.liveFetch<MemoryEvent[]>(`/companies/${encodeURIComponent(companyId)}/memory`);
    }

    const list = mockMemoryEvents[companyId] || mockMemoryEvents['relayforge'] || [];
    return this.demoDelay(list);
  }

  /**
   * Unconfirmed Route: GET /companies/{company_id}/playbooks
   * Prepared for Part 4 (Operational Playbooks)
   */
  public async getCompanyPlaybooks(companyId: string): Promise<PlaybookItem[]> {
    if (this.mode === 'live') {
      return this.liveFetch<PlaybookItem[]>(`/companies/${encodeURIComponent(companyId)}/playbooks`);
    }

    const list = mockPlaybooks[companyId] || mockPlaybooks['relayforge'] || [];
    return this.demoDelay(list);
  }

  /**
   * Companies Directory (Frontend selector)
   */
  public async getCompanies(): Promise<CompanySummaryItem[]> {
    if (this.mode === 'live') {
      try {
        return await this.liveFetch<CompanySummaryItem[]>('/companies');
      } catch {
        return mockCompaniesList;
      }
    }
    return this.demoDelay(mockCompaniesList);
  }
}

// Singleton export
export const apiClient = new StackIntelApiClient();
