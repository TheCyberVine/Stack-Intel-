import { CompanyOverviewResponse, CompanySummaryItem } from '../api/types';

export const mockCompaniesList: CompanySummaryItem[] = [
  {
    id: 'relayforge',
    name: 'RelayForge',
    domain: 'relayforge.demo',
    industry: 'B2B Workflow Automation',
    tier: 'Early-Stage Startup',
    isSynthetic: true
  },
  {
    id: 'acme-corp',
    name: 'Acme Logistics Global',
    domain: 'acme-logistics.io',
    industry: 'Supply Chain & Logistics',
    tier: 'Enterprise'
  },
  {
    id: 'novatech-io',
    name: 'NovaTech Financial',
    domain: 'novatech.fi',
    industry: 'High-Frequency FinTech',
    tier: 'Growth'
  },
  {
    id: 'omnigrid-labs',
    name: 'OmniGrid Systems',
    domain: 'omnigrid.cloud',
    industry: 'Distributed AI Compute',
    tier: 'Early Stage'
  }
];

export const mockCompanyOverviews: Record<string, CompanyOverviewResponse> = {
  'relayforge': {
    company_id: 'relayforge',
    name: 'RelayForge',
    description: 'Early-stage B2B workflow automation platform connecting legacy dispatch systems to modern event triggers.',
    industry: 'B2B Workflow Automation',
    stage: 'Seed / Early-Stage Startup',
    primary_domain: 'relayforge.demo',
    headquarters: 'San Francisco, CA (Synthetic)',
    last_analyzed_at: '2026-10-15T16:00:00Z',
    is_synthetic: true,
    currency: 'USD',
    total_monthly_cost: 491,
    goals: [
      {
        id: 'goal-eff',
        title: 'Improve Operational Efficiency',
        description: 'Streamline developer deployment cycles and decrease manual infrastructure overhead.',
        category: 'efficiency',
        isSynthetic: true
      },
      {
        id: 'goal-lat',
        title: 'Maintain p95 API Latency Below 400 ms',
        description: 'Ensure workflow automation webhook triggers respond within acceptable customer SLA boundaries.',
        category: 'latency',
        metric: 'p95 latency < 400 ms',
        isSynthetic: true
      },
      {
        id: 'goal-mttr',
        title: 'Reduce MTTR by 20% Over 90 Days',
        description: 'Lower Mean Time To Resolution from synthetic 100-minute baseline to an 80-minute target.',
        category: 'reliability',
        baseline: '100 minutes',
        target: '80 minutes (20% reduction)',
        timeframe: '90 days',
        isSynthetic: true
      }
    ],
    constraints: [
      {
        id: 'con-1',
        type: 'approval',
        statement: 'Production changes require human approval.',
        rationale: 'Core governance safeguard preventing automated or unauthorized deployment disruption in customer production environments.'
      },
      {
        id: 'con-2',
        type: 'observability',
        statement: 'Preserve error monitoring and incident visibility.',
        rationale: 'Mandatory operational requirement to maintain real-time stack trace alerts and crash triage capability.'
      }
    ],
    tools: [
      {
        id: 'tool-aws',
        name: 'AWS',
        monthlyCost: 465,
        currency: 'USD',
        role: 'Cloud compute, container hosting & networking',
        category: 'Infrastructure',
        explicitlySupportedGoalIds: ['goal-lat'], // Explicit relationship: hosting directly impacts p95 latency
        evidence: 'Synthetic demo billing fixture: AWS Monthly Invoice estimate',
        constraints: [
          'Production changes require human approval.'
        ],
        knownDependencies: [
          'Hosts RelayForge application containers running Sentry SDK client'
        ],
        missingInformation: [
          'No sub-service cost breakdown provided (EC2 compute vs RDS database vs S3 storage)',
          'No resource utilization telemetry (CPU/Memory headroom) available in fixture',
          'Contract term: Unspecified (assumed standard On-Demand monthly billing)'
        ],
        relatedOpportunities: [
          {
            id: 'opp-aws-1',
            title: 'Analyze AWS Savings Plan vs. Retaining On-Demand',
            type: 'optimization',
            description: 'Evaluate commitment tradeoffs of 1-year Savings Plan against maintaining agility during early startup phase.',
            status: 'available'
          }
        ],
        comparison: {
          currentConfig: {
            name: 'Retain Current AWS On-Demand Setup',
            rationale: 'Provides 100% architectural agility with zero upfront commitment during early-stage customer discovery and volatility.',
            advantages: [
              'Zero contract commitment: scale up, down, or change services at any time',
              'No upfront capital expenditure or early-termination penalties',
              'Standard verified AWS reliability and SLA guarantees'
            ],
            tradeoffs: [
              'Pays standard On-Demand hourly rate with no commitment discount'
            ],
            risks: [
              'Costs can fluctuate if container traffic surges unpredictably'
            ],
            monthlyCost: 465
          },
          alternatives: [
            {
              name: '1-Year Compute Savings Plan Evaluation',
              type: 'alternative',
              overview: 'Commit to steady-state baseline usage for 12 months in exchange for up to ~25% compute discount.',
              tradeoffs: [
                'Requires locked 1-year financial commitment',
                'Risk of over-provisioning if architecture migrates away from container instances'
              ],
              risks: [
                'Inflexible for early-stage startup whose workload and runtime stack might radically pivot in 6 months'
              ],
              evidenceAvailable: 'Standard AWS Pricing Schedule (Public Calculator)',
              unknowns: [
                'Exact baseline compute usage versus variable spike usage is unmeasured in current synthetic data'
              ],
              estimatedCostRange: '$350 - $410 / month'
            }
          ]
        },
        provenance: {
          sourceType: 'synthetic_fixture',
          sourceName: 'fixtures/relayforge/billing.json',
          confidence: 1.0,
          verifiedAt: '2026-10-15T16:00:00Z',
          notes: 'Synthetic demo data for RelayForge startup evaluation. Not verified cloud telemetry.'
        }
      },
      {
        id: 'tool-sentry',
        name: 'Sentry',
        monthlyCost: 26,
        currency: 'USD',
        role: 'Application error monitoring, exception tracking & triage',
        category: 'Observability',
        explicitlySupportedGoalIds: ['goal-mttr'], // Explicit relationship: error tracking directly supports MTTR reduction
        evidence: 'Synthetic demo billing fixture: Sentry Team subscription tier',
        constraints: [
          'Preserve error monitoring and incident visibility.',
          'Production changes require human approval.'
        ],
        knownDependencies: [
          'Sentry Python/Node client SDK initialized inside AWS container runtimes'
        ],
        missingInformation: [
          'Monthly event quota and dropped transaction counts are unrecorded',
          'Configured alert destinations (Slack vs Email vs PagerDuty) not specified in fixture'
        ],
        relatedOpportunities: [
          {
            id: 'opp-sentry-1',
            title: 'Verify Alert Routing & Triage Efficiency',
            type: 'evaluation',
            description: 'Audit whether Sentry exception notifications reach on-call engineers fast enough to support 80-min MTTR target.',
            status: 'available'
          }
        ],
        comparison: {
          currentConfig: {
            name: 'Retain Current Sentry Team SaaS Plan',
            rationale: 'Extremely cost-effective turnkey error tracking ($26/mo) with zero infrastructure maintenance overhead, satisfying the observability constraint.',
            advantages: [
              'Zero ops burden: managed ingestion, storage, indexing, and UI hosted by Sentry',
              'Full stack trace and release health visibility out of the box',
              'Negligible expenditure ($26/mo) well within early-stage budget'
            ],
            tradeoffs: [
              'Fixed monthly event quota before sampling or overages apply'
            ],
            risks: [
              'High exception spikes could hit monthly transaction caps if unhandled loops occur'
            ],
            monthlyCost: 26
          },
          alternatives: [
            {
              name: 'Self-Hosted Sentry / GlitchTip on AWS',
              type: 'alternative',
              overview: 'Deploy open-source error tracking instance onto self-managed infrastructure.',
              tradeoffs: [
                'Requires dedicated PostgreSQL, Redis, and ClickHouse cluster nodes',
                'Estimated AWS compute/storage cost ($80–$150/mo) significantly exceeds current $26/mo SaaS tier',
                'Requires ongoing developer time for database upgrades and backup maintenance'
              ],
              risks: [
                'Operational distraction from core B2B workflow product; higher total cost of ownership'
              ],
              evidenceAvailable: 'GlitchTip / Self-Hosted Sentry Minimum Hardware Specifications',
              unknowns: [
                'Exact engineer hourly maintenance cost for RelayForge team'
              ],
              estimatedCostRange: '$90 - $160 / month (Higher than current)'
            }
          ]
        },
        provenance: {
          sourceType: 'synthetic_fixture',
          sourceName: 'fixtures/relayforge/billing.json',
          confidence: 1.0,
          verifiedAt: '2026-10-15T16:00:00Z',
          notes: 'Synthetic demo data for RelayForge startup evaluation. Not verified cloud telemetry.'
        }
      }
    ],
    opportunities: [
      {
        id: 'opp-1',
        title: 'Evaluate AWS Savings Plan vs. On-Demand Flexibility',
        description: 'Assess whether RelayForge workload baseline justifies a 1-year compute commitment without risking startup agility.',
        relatedTool: 'AWS',
        type: 'Cost & Commitment Analysis',
        actionable: true
      },
      {
        id: 'opp-2',
        title: 'Audit Sentry Alert Notification Workflows for MTTR Target',
        description: 'Verify error routing integration to support the 90-day MTTR reduction target (100m -> 80m).',
        relatedTool: 'Sentry',
        type: 'Operational Efficiency',
        actionable: true
      }
    ],
    // Pending decisions and recorded outcomes are empty for RelayForge to honestly reflect no ungrounded data!
    pending_decisions: [],
    recorded_outcomes: [],
    stack_summary: {
      total_technologies: 2,
      core_categories: ['Infrastructure', 'Observability'],
      critical_dependencies: 2,
      compliance_score: 95
    },
    key_technologies: [
      {
        id: 'tech-aws',
        name: 'AWS',
        category: 'Infrastructure',
        version: 'Cloud Platform',
        status: 'operational',
        confidence: 1.0,
        evidenceSource: 'Synthetic Billing: AWS ($465/mo)',
        license: 'Commercial Cloud',
        lastAudited: '2026-10-15T16:00:00Z',
        dependenciesCount: 1,
        provenance: {
          sourceType: 'synthetic_fixture',
          sourceName: 'fixtures/relayforge/billing.json',
          confidence: 1.0,
          verifiedAt: '2026-10-15T16:00:00Z',
          notes: 'Synthetic demo data'
        }
      },
      {
        id: 'tech-sentry',
        name: 'Sentry',
        category: 'Observability',
        version: 'SaaS Team Tier',
        status: 'operational',
        confidence: 1.0,
        evidenceSource: 'Synthetic Billing: Sentry ($26/mo)',
        license: 'Commercial SaaS',
        lastAudited: '2026-10-15T16:00:00Z',
        dependenciesCount: 1,
        provenance: {
          sourceType: 'synthetic_fixture',
          sourceName: 'fixtures/relayforge/billing.json',
          confidence: 1.0,
          verifiedAt: '2026-10-15T16:00:00Z',
          notes: 'Synthetic demo data'
        }
      }
    ],
    recent_activity: []
  },

  'acme-corp': {
    company_id: 'acme-corp',
    name: 'Acme Logistics Global',
    description: 'Autonomous freight orchestration and cross-border customs telemetry network.',
    industry: 'Supply Chain & Logistics',
    stage: 'Series D / Enterprise',
    employee_count: '1,420',
    primary_domain: 'acme-logistics.io',
    headquarters: 'Chicago, IL & Rotterdam, NL',
    last_analyzed_at: '2026-10-14T09:42:00Z',
    currency: 'USD',
    total_monthly_cost: 8900,
    goals: [
      {
        id: 'goal-acme-1',
        title: 'Sub-30ms Parcel Routing Path Traversal',
        description: 'Execute multimodal route calculation queries in sub-30ms during peak surges.',
        category: 'latency',
        metric: 'p99 query latency < 30ms'
      }
    ],
    constraints: [
      {
        id: 'con-acme-1',
        type: 'compliance',
        statement: 'Cross-border telemetry data must adhere to EU GDPR routing mandates.'
      }
    ],
    stack_summary: {
      total_technologies: 38,
      core_categories: ['Infrastructure', 'Database & Graph', 'Backend API', 'Observability'],
      critical_dependencies: 12,
      compliance_score: 94
    },
    key_technologies: [
      {
        id: 'falkordb',
        name: 'FalkorDB',
        category: 'Database & Graph',
        version: 'v0.4.1',
        status: 'operational',
        confidence: 0.98,
        evidenceSource: 'helm-values.yaml:cluster-falkordb',
        license: 'SSPL / Commercial',
        lastAudited: '2026-10-10T14:20:00Z',
        dependenciesCount: 8,
        provenance: {
          sourceType: 'repo_config',
          sourceName: 'k8s/production/falkordb-statefulset.yaml',
          confidence: 0.98,
          verifiedAt: '2026-10-10T14:20:00Z',
          notes: 'Active primary graph store for parcel routing topology'
        }
      },
      {
        id: 'fastapi',
        name: 'FastAPI',
        category: 'Backend API',
        version: '0.115.0',
        status: 'operational',
        confidence: 0.95,
        evidenceSource: 'pyproject.toml:poetry.lock',
        license: 'MIT',
        lastAudited: '2026-10-12T08:15:00Z',
        dependenciesCount: 14,
        provenance: {
          sourceType: 'package_manifest',
          sourceName: 'services/dispatch-api/pyproject.toml',
          confidence: 0.95,
          verifiedAt: '2026-10-12T08:15:00Z'
        }
      }
    ],
    recent_activity: [
      {
        id: 'act-101',
        action: 'Stack Graph Synced',
        timestamp: '2026-10-14T09:42:00Z',
        author: 'Automated Pipeline (Cypher Ingest)',
        summary: 'Synchronized 38 dependency nodes and 64 relations from main branch manifests.'
      }
    ]
  },

  'novatech-io': {
    company_id: 'novatech-io',
    name: 'NovaTech Financial',
    description: 'High-frequency algorithmic liquidity protocol and institutional dark pool clearing.',
    industry: 'High-Frequency FinTech',
    stage: 'Series B',
    employee_count: '280',
    primary_domain: 'novatech.fi',
    headquarters: 'New York, NY',
    last_analyzed_at: '2026-10-13T19:00:00Z',
    currency: 'USD',
    total_monthly_cost: 15400,
    goals: [],
    constraints: [],
    stack_summary: {
      total_technologies: 29,
      core_categories: ['Infrastructure', 'Database & Graph', 'Security', 'Observability'],
      critical_dependencies: 8,
      compliance_score: 98
    },
    key_technologies: [],
    recent_activity: []
  },

  'omnigrid-labs': {
    company_id: 'omnigrid-labs',
    name: 'OmniGrid Systems',
    description: 'Decentralized GPU cluster scheduler for LLM fine-tuning and parameter sharding.',
    industry: 'Distributed AI Compute',
    stage: 'Seed / Series A',
    employee_count: '45',
    primary_domain: 'omnigrid.cloud',
    headquarters: 'San Francisco, CA',
    last_analyzed_at: '2026-10-15T02:10:00Z',
    currency: 'USD',
    total_monthly_cost: 6200,
    goals: [],
    constraints: [],
    stack_summary: {
      total_technologies: 22,
      core_categories: ['Infrastructure', 'AI & Machine Learning', 'Backend API'],
      critical_dependencies: 5,
      compliance_score: 89
    },
    key_technologies: [],
    recent_activity: []
  }
};
