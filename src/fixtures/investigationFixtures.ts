import { InvestigationItem } from '../api/types';

export const mockInvestigations: Record<string, InvestigationItem[]> = {
  'relayforge': [
    {
      id: 'inv-rf-aws-activate',
      company_id: 'relayforge',
      title: 'AWS Activate Credits: Operational Efficiency & Feasibility Investigation',
      category: 'Cost Optimization',
      status: 'in_progress',
      severity: 'high',
      openedAt: '2026-10-15T10:00:00Z',
      updatedAt: '2026-10-15T16:00:00Z',
      leadInvestigator: 'Staff Cloud Architect (Simulated)',
      summary: 'Evaluating AWS Activate Credits as an opportunity to support RelayForge\'s goal of Improving Operational Efficiency. No eligibility or savings are guaranteed. All prerequisite requirements are initially recorded as Unknown pending evidence verification.',
      affectedComponents: ['AWS'],
      relatedToolId: 'tool-aws',
      opportunityId: 'opp-aws-activate',
      officialSourceUrl: 'https://aws.amazon.com/startups/credits/',
      isSynthetic: true,
      evidenceFindings: [
        {
          findingId: 'f-act-01',
          claim: 'RelayForge currently spends $465/mo on AWS container and compute infrastructure under goal: Improve Operational Efficiency',
          evidenceConfidence: 1.0,
          source: 'Synthetic demo billing fixture: AWS Monthly Invoice estimate'
        },
        {
          findingId: 'f-act-02',
          claim: 'AWS Activate Credits requires self-funded or institutional startup criteria; RelayForge eligibility is unverified',
          evidenceConfidence: 0.95,
          source: 'AWS Activate Public Policy Documentation (https://aws.amazon.com/startups/credits/)'
        }
      ],
      requirements: [
        {
          id: 'req-act-1',
          title: 'New to AWS Activate Credits',
          description: 'Company account must not have previously received maximum lifetime AWS Activate promotional credit packages.',
          status: 'unknown',
          evidenceOrigin: 'public_source',
          sourceUrl: 'https://aws.amazon.com/startups/credits/',
          unknowns: [
            'Historical AWS Activate credit grant history is unverified in current company records'
          ]
        },
        {
          id: 'req-act-2',
          title: 'Self-Funded or Bootstrapped Status',
          description: 'Company must demonstrate self-funded, pre-seed, or eligible institutional accelerator affiliation.',
          status: 'unknown',
          evidenceOrigin: 'public_source',
          sourceUrl: 'https://aws.amazon.com/startups/credits/',
          unknowns: [
            'RelayForge institutional cap table or self-funding declaration has not been audited'
          ]
        },
        {
          id: 'req-act-3',
          title: 'Functioning Company Website',
          description: 'Must have an active, publicly resolvable company domain representing the core B2B product.',
          status: 'unknown',
          evidenceOrigin: 'public_source',
          sourceUrl: 'https://aws.amazon.com/startups/credits/',
          unknowns: [
            'relayforge.demo is a synthetic local fixture domain; public web presence unconfirmed'
          ]
        },
        {
          id: 'req-act-4',
          title: 'Founded Within Past 10 Years',
          description: 'Entity legal incorporation date must be within 10 years of application submission.',
          status: 'unknown',
          evidenceOrigin: 'public_source',
          sourceUrl: 'https://aws.amazon.com/startups/credits/',
          unknowns: [
            'Official articles of incorporation or government registry date unverified'
          ]
        }
      ],
      lifecycleStages: [
        {
          stage: 'potential_benefits',
          label: 'Potential Benefits',
          status: 'current',
          note: 'Evaluating theoretical credit availability against current $465/mo AWS expenditure.'
        },
        {
          stage: 'application_submitted',
          label: 'Application Submitted',
          status: 'not_started',
          note: 'Formal Activate application has not been submitted.'
        },
        {
          stage: 'approval_pending',
          label: 'Approval Pending',
          status: 'not_started',
          note: 'Requires AWS startup review board confirmation.'
        },
        {
          stage: 'credits_received',
          label: 'Credits Received',
          status: 'not_started',
          note: 'Promotional credits granted to AWS Billing account.'
        },
        {
          stage: 'credits_consumed',
          label: 'Credits Consumed',
          status: 'not_started',
          note: 'Credits deducted against qualified compute and database services.'
        },
        {
          stage: 'realized_savings',
          label: 'Realized Savings',
          status: 'not_started',
          note: 'Actual verified cash savings reflected on net invoices.'
        }
      ],
      relationshipPath: {
        isSynthetic: true,
        nodes: [
          { id: 'n-rf', type: 'company', label: 'RelayForge', subtext: 'Early-stage Startup', status: 'confirmed' },
          { id: 'n-goal', type: 'goal', label: 'Operational Efficiency', subtext: 'Goal #goal-eff', status: 'confirmed' },
          { id: 'n-opp', type: 'opportunity', label: 'AWS Activate Investigation', subtext: 'Promotional Credit Exploration', status: 'candidate' },
          { id: 'n-req', type: 'requirement', label: 'Prerequisite Audit (4 Unknowns)', subtext: 'Self-Funded, Founded <10y', status: 'unknown' },
          { id: 'n-evi', type: 'evidence', label: 'AWS Official Documentation', subtext: 'https://aws.amazon.com/startups/credits/', status: 'confirmed' },
          { id: 'n-rec', type: 'assessment', label: 'Feasibility Assessment', subtext: 'Verify Prerequisites Prior to Application', status: 'candidate' }
        ],
        edges: [
          { from: 'n-rf', to: 'n-goal', label: 'pursues', relationshipStatus: 'confirmed' },
          { from: 'n-goal', to: 'n-opp', label: 'motivates', relationshipStatus: 'confirmed' },
          { from: 'n-opp', to: 'n-req', label: 'conditioned on', relationshipStatus: 'candidate' },
          { from: 'n-req', to: 'n-evi', label: 'grounded in', relationshipStatus: 'confirmed' },
          { from: 'n-evi', to: 'n-rec', label: 'informs', relationshipStatus: 'candidate' }
        ]
      },
      recommendations: [
        {
          id: 'rec-act-1',
          title: 'Audit Eligibility Prerequisites Prior to Formal Application',
          goalId: 'goal-eff',
          goalTitle: 'Improve Operational Efficiency',
          summary: 'Review legal incorporation date, domain presence, and prior AWS account usage before submitting an Activate claim. Do not alter current AWS architecture or budget projections prematurely.',
          facts: [
            'Current AWS listed cost is $465/mo for RelayForge containers.',
            'AWS Activate terms restrict credits to verified new or self-funded entities.',
            'Production changes and contract commitments require human approval.'
          ],
          hypotheses: [
            'RelayForge may qualify for self-funded tier if incorporation and domain prerequisites are satisfied.'
          ],
          risks: [
            'Credits typically expire after 12 months; building architectural dependency on temporary credits risks steep cliff when expired.',
            'Certain third-party marketplace services and support charges are ineligible for credit consumption.'
          ],
          tradeoffs: [
            'Applying costs minimal engineer hours but grants are discretionary and unverified.'
          ],
          suggestedNextStep: 'Verify corporate registration date and upload incorporation evidence to audit checklist.',
          approvalRequired: true,
          allowRetainingCurrentSetup: true,
          retainingOptionRationale: 'Retaining current $465/mo on-demand setup requires zero administrative paperwork and maintains verified billing predictability.'
        }
      ],
      missingInformation: [
        'RelayForge official corporate registration date',
        'Prior AWS account credit history',
        'Public production domain URL verification'
      ],
      limitations: [
        'AWS Activate credits cannot be exchanged for cash or transferred between organizations',
        'Credits are subject to expiration timelines (typically 12 months from issuance)',
        'Certain AWS Marketplace and managed licensing charges are excluded from credit consumption'
      ]
    },
    {
      id: 'inv-rf-savings-plan',
      company_id: 'relayforge',
      title: 'Analyze AWS Compute Savings Plan vs. Retaining On-Demand Flexibility',
      category: 'Cost Optimization',
      status: 'in_progress',
      severity: 'medium',
      openedAt: '2026-10-14T10:00:00Z',
      updatedAt: '2026-10-15T15:00:00Z',
      leadInvestigator: 'Staff Lead (Simulated)',
      summary: 'Evaluating whether RelayForge should commit to a 1-year AWS Compute Savings Plan (~$380/mo vs current $465/mo) or retain full on-demand flexibility during early-stage customer onboarding.',
      affectedComponents: ['AWS'],
      relatedToolId: 'tool-aws',
      isSynthetic: true,
      evidenceFindings: [
        {
          findingId: 'rf-f101',
          claim: 'Current monthly AWS expenditure is $465 across container compute and network egress',
          evidenceConfidence: 1.0,
          source: 'Synthetic demo billing fixture: AWS Monthly Invoice'
        }
      ],
      relationshipPath: {
        isSynthetic: true,
        nodes: [
          { id: 'n1', type: 'company', label: 'RelayForge', status: 'confirmed' },
          { id: 'n2', type: 'goal', label: 'Maintain p95 Latency', status: 'confirmed' },
          { id: 'n3', type: 'opportunity', label: 'Savings Plan Commitment', status: 'candidate' },
          { id: 'n4', type: 'assessment', label: '1-Year Lock-in Analysis', status: 'candidate' }
        ],
        edges: [
          { from: 'n1', to: 'n2', label: 'monitors', relationshipStatus: 'confirmed' },
          { from: 'n2', to: 'n3', label: 'evaluates', relationshipStatus: 'candidate' },
          { from: 'n3', to: 'n4', label: 'informs', relationshipStatus: 'candidate' }
        ]
      },
      recommendations: [
        {
          id: 'rec-sp-1',
          title: 'Retain Current On-Demand Flexibility for Next 60 Days',
          goalTitle: 'Improve Operational Efficiency',
          summary: 'Maintain current on-demand pricing ($465/mo) during initial customer rollout. Committing to a 1-year lock-in saves only ~$85/mo while sacrificing the flexibility to migrate compute architecture.',
          facts: ['AWS expenditure is currently $465/mo.'],
          hypotheses: ['Workload architecture may evolve significantly over the next two quarters.'],
          risks: ['Lock-in penalties if RelayForge shifts container runtimes.'],
          tradeoffs: ['Paying standard On-Demand preserves 100% architectural agility.'],
          suggestedNextStep: 'Revisit 1-year commitment after reaching 1,000 active daily automated workflows.',
          approvalRequired: true,
          allowRetainingCurrentSetup: true,
          retainingOptionRationale: 'Prevents premature lock-in for an early-stage startup.'
        }
      ]
    },
    {
      id: 'inv-rf-sentry-mttr',
      company_id: 'relayforge',
      title: 'Audit Sentry Alert Notification Workflows for 80-Minute MTTR Target',
      category: 'Operational Efficiency',
      status: 'in_progress',
      severity: 'high',
      openedAt: '2026-10-13T14:00:00Z',
      updatedAt: '2026-10-15T12:00:00Z',
      leadInvestigator: 'Reliability Engineer (Simulated)',
      summary: 'Assessing triage alert routing between Sentry exception webhooks and on-call engineer notification channels to meet the strategic 20% MTTR reduction goal (100m baseline to 80m target over 90 days).',
      affectedComponents: ['Sentry'],
      relatedToolId: 'tool-sentry',
      isSynthetic: true,
      evidenceFindings: [
        {
          findingId: 'rf-f201',
          claim: 'Sentry Team plan ($26/mo) fulfills constraint: Preserve error monitoring and incident visibility',
          evidenceConfidence: 1.0,
          source: 'Operational Constraint Audit #con-2'
        }
      ],
      relationshipPath: {
        isSynthetic: true,
        nodes: [
          { id: 'ns1', type: 'company', label: 'RelayForge', status: 'confirmed' },
          { id: 'ns2', type: 'goal', label: 'Reduce MTTR (100m -> 80m)', status: 'confirmed' },
          { id: 'ns3', type: 'requirement', label: 'Triage Notification Speed', status: 'candidate' },
          { id: 'ns4', type: 'assessment', label: 'Alert Channel Routing Audit', status: 'confirmed' }
        ],
        edges: [
          { from: 'ns1', to: 'ns2', label: 'strives for', relationshipStatus: 'confirmed' },
          { from: 'ns2', to: 'ns3', label: 'requires', relationshipStatus: 'candidate' },
          { from: 'ns3', to: 'ns4', label: 'audited by', relationshipStatus: 'confirmed' }
        ]
      },
      recommendations: [
        {
          id: 'rec-sentry-1',
          title: 'Retain Sentry Team Plan and Configure Slack/Webhook Escalation',
          goalTitle: 'Reduce MTTR by 20% Over 90 Days',
          summary: 'Keep Sentry Team subscription ($26/mo) and verify notification delivery latency to support the 80-minute MTTR target.',
          facts: ['Sentry subscription costs $26/mo with zero maintenance overhead.'],
          hypotheses: ['Triage response time accounts for 30 minutes of current 100-minute MTTR baseline.'],
          risks: ['Alert fatigue if unhandled exceptions are not properly deduplicated.'],
          tradeoffs: ['Setting up custom alert rules requires initial engineer triage time.'],
          suggestedNextStep: 'Audit on-call Slack channel routing for p0 crash alerts.',
          approvalRequired: false,
          allowRetainingCurrentSetup: true,
          retainingOptionRationale: 'Sentry SaaS tier is proven, low-cost ($26/mo), and satisfies all operational constraints.'
        }
      ]
    }
  ],

  'acme-corp': [
    {
      id: 'inv-001',
      company_id: 'acme-corp',
      title: 'Graph Traversal Migration: FalkorDB Latency vs Neo4j Memory Footprint',
      category: 'Graph Architecture',
      status: 'verified',
      severity: 'high',
      openedAt: '2026-09-15T10:00:00Z',
      updatedAt: '2026-10-10T14:20:00Z',
      leadInvestigator: 'Staff Architect R. Alvarez',
      summary: 'Evaluation of route-planning Cypher queries across 1.2M package nodes. FalkorDB matrix operations delivered 6.4x speedup on 4-hop queries with 42% lower RAM usage.',
      affectedComponents: ['FalkorDB', 'FastAPI'],
      evidenceFindings: [
        {
          findingId: 'f-101',
          claim: '4-hop supply chain path traversal p99 drops from 142ms to 22ms',
          evidenceConfidence: 0.99,
          source: 'Benchmark Suite run #842 (k6 + Prometheus)'
        }
      ]
    }
  ]
};
