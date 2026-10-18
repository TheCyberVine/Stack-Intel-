import { DecisionRecord } from '../api/types';

export const mockDecisions: Record<string, DecisionRecord[]> = {
  'relayforge': [
    {
      id: 'dec-rf-01',
      company_id: 'relayforge',
      code: 'ADR-RF-01',
      title: 'Adopt AWS ECS Fargate Container Workload with Mandatory Human Approval',
      status: 'approved',
      date: '2026-10-12',
      authors: ['Alex Morgan (Tech Lead)', 'Chris Vance (Founder)'],
      context: 'RelayForge currently spends $465/mo on AWS compute infrastructure. Production deployments require human verification per operational constraint: "Production changes require human approval".',
      decision: 'Formalized AWS ECS Fargate as the primary container runtime. Status is Approved by leadership, but execution is gated behind deployment pipeline approval tokens.',
      consequences: [
        'Guarantees no unattended or automated infrastructure modifications reach production',
        'Maintains container isolation for dispatch worker services',
        'Human sign-off required prior to merging Terraform execution plans'
      ],
      affectedComponents: ['AWS'],
      executionNote: 'Approved by Architecture Lead. Deployment token generation pending pipeline maintenance window.',
      provenance: {
        sourceType: 'repo_config',
        sourceName: '.github/workflows/production-deploy.yml',
        confidence: 0.98,
        verifiedAt: '2026-10-12T14:30:00Z',
        notes: 'Signed off in Sprint 14 Architecture Review'
      }
    },
    {
      id: 'dec-rf-02',
      company_id: 'relayforge',
      code: 'ADR-RF-02',
      title: 'Standardize Sentry Alert Routing to Enforce 80-minute MTTR Target',
      status: 'awaiting_approval',
      date: '2026-10-14',
      authors: ['Sarah Lin (DevOps Engineer)'],
      context: 'Goal: Reduce MTTR by 20% over 90 days (100min baseline to 80min target). Sentry is actively tracked at $26/mo. Currently, alert notifications are broadcast to an unmonitored Slack channel without escalations.',
      decision: 'Configure high-priority Sentry alert rules for 5xx exceptions and latency anomalies exceeding 400ms, routing directly to the on-call dispatch roster.',
      consequences: [
        'Expected to shave 15 minutes off initial incident acknowledgment latency',
        'Requires on-call rotation schedule agreement across engineering team'
      ],
      affectedComponents: ['Sentry'],
      provenance: {
        sourceType: 'manual_audit',
        sourceName: 'docs/architecture/decisions/0002-sentry-alert-routing.md',
        confidence: 0.92,
        verifiedAt: '2026-10-14T11:00:00Z'
      }
    },
    {
      id: 'dec-rf-03',
      company_id: 'relayforge',
      code: 'ADR-RF-03',
      title: 'Deploy FastAPI Healthcheck & Latency Monitoring Probe',
      status: 'executed',
      date: '2026-10-10',
      authors: ['Alex Morgan (Tech Lead)'],
      context: 'Strategic objective: Maintain p95 API latency below 400 ms. Needed continuous container health probe on port 8000/health.',
      decision: 'Deployed `/health` endpoint probe with 15-second polling interval in ECS container task definition. Executed in production on 2026-10-10.',
      consequences: [
        'Unhealthy container tasks automatically terminated before receiving ingress traffic',
        'Provides telemetry foundation for automated container recycling'
      ],
      affectedComponents: ['AWS', 'FastAPI'],
      executionNote: 'Deployed to production cluster. 30-day telemetry gathering active to verify long-term MTTR reduction.',
      outcomeNote: 'Telemetry gathering period underway; formal MTTR verification scheduled at 90-day milestone.',
      provenance: {
        sourceType: 'repo_config',
        sourceName: 'infra/ecs/task-definitions/api.json',
        confidence: 1.0,
        verifiedAt: '2026-10-10T09:15:00Z'
      }
    },
    {
      id: 'dec-rf-04',
      company_id: 'relayforge',
      code: 'ADR-RF-04',
      title: 'Automated Container Health Probe Rollback on Latency Threshold',
      status: 'outcome_verified',
      date: '2026-10-05',
      authors: ['Alex Morgan (Tech Lead)', 'Chris Vance (Founder)'],
      context: 'Transient memory leaks in early container builds produced latency spikes up to 800ms.',
      decision: 'Implemented synthetic container probe threshold: fail tasks when response exceeds 450ms across 3 consecutive checks.',
      consequences: [
        'Outcome verified: Over 14-day synthetic benchmark period, 0 requests breached the 400ms target during rolling updates',
        'Current measured p95 latency steady at 310ms'
      ],
      affectedComponents: ['AWS'],
      outcomeNote: 'Verified: Synthetic p95 latency benchmark maintained below 400ms target continuously.',
      provenance: {
        sourceType: 'repo_config',
        sourceName: 'src/core/healthcheck.py',
        confidence: 0.96,
        verifiedAt: '2026-10-05T16:45:00Z'
      }
    },
    {
      id: 'dec-rf-05',
      company_id: 'relayforge',
      code: 'ADR-RF-05',
      title: 'Proposal: Decommission Sentry in Favor of Self-Hosted Logging',
      status: 'rejected',
      date: '2026-10-11',
      authors: ['Finance Working Group'],
      context: 'Proposal submitted to save $26/mo by removing Sentry subscription in favor of local text file logging.',
      decision: 'REJECTED by Engineering on 2026-10-11. Proposal directly violates RelayForge operational constraint: "Preserve error monitoring and incident visibility" and would severely endanger the 80-minute MTTR target.',
      consequences: [
        'Sentry subscription retained as essential observability dependency',
        'Operational constraint boundary successfully defended'
      ],
      affectedComponents: ['Sentry'],
      provenance: {
        sourceType: 'manual_audit',
        sourceName: 'docs/architecture/reviews/2026-10-sentry-retention.md',
        confidence: 0.99,
        verifiedAt: '2026-10-11T18:00:00Z'
      }
    },
    {
      id: 'dec-rf-06',
      company_id: 'relayforge',
      code: 'ADR-RF-06',
      title: 'Prepare Evidence Dossier for AWS Activate Credits Application',
      status: 'draft',
      date: '2026-10-15',
      authors: ['Staff Cloud Architect (Simulated)'],
      context: 'Evaluating operational efficiency opportunity under current $465/mo AWS spend. Prerequisite requirements currently Unknown.',
      decision: 'Drafting prerequisite checklist: verify incorporation date within 10 years, prove self-funded pre-seed status, and validate production website domain before submitting application.',
      consequences: [
        'Organizes audit requirements systematically without premature submission',
        'Prevents rejected applications due to missing documentation'
      ],
      affectedComponents: ['AWS'],
      provenance: {
        sourceType: 'manual_audit',
        sourceName: 'docs/investigations/aws-activate-dossier.md',
        confidence: 0.85,
        verifiedAt: '2026-10-15T15:00:00Z'
      }
    }
  ],
  'acme-corp': [
    {
      id: 'dec-031',
      company_id: 'acme-corp',
      code: 'ADR-031',
      title: 'Adopt FalkorDB as Canonical Route Topology Graph Store',
      status: 'accepted',
      date: '2026-10-08',
      authors: ['R. Alvarez (Principal Architect)', 'T. Chen (Head of Infrastructure)'],
      context: 'Logistics routing calculations previously queried relational foreign keys across 14 tables, causing timeout cascades during holiday shipping surges. Graph queries required sub-30ms execution for multimodal carrier paths.',
      decision: 'Deploy FalkorDB as an HA cluster within AWS EKS. Model logistics nodes (Airports, Distribution Centers, Trucks, Parcels) as Cypher vertices and transit corridors as weighted edges with dynamic ETA attributes.',
      consequences: [
        '99th percentile graph query latency reduced to 18ms',
        'Direct Redis protocol interoperability simplifies existing service connection pooling',
        'Requires ops team onboarding on Cypher query tuning and index management'
      ],
      affectedComponents: ['FalkorDB', 'FastAPI', 'Kubernetes (EKS)'],
      provenance: {
        sourceType: 'repo_config',
        sourceName: 'docs/architecture/decisions/0031-falkordb-routing-graph.md',
        confidence: 0.99,
        verifiedAt: '2026-10-08T11:20:00Z',
        notes: 'Ratified by Architecture Review Board with unanimous vote'
      }
    },
    {
      id: 'dec-028',
      company_id: 'acme-corp',
      code: 'ADR-028',
      title: 'Deprecate Legacy Redis 6.2 in Favor of FalkorDB Unified Cache Layer',
      status: 'accepted',
      date: '2026-09-28',
      authors: ['T. Chen (Head of Infrastructure)', 'S. Vance (Security Lead)'],
      context: 'Running separate Redis clusters for caching alongside FalkorDB introduced redundant infra overhead, operational maintenance burden, and unaddressed CVEs on deprecated Redis 6.x builds.',
      decision: 'Consolidate session and route calculation caching directly onto FalkorDB memory instances, taking advantage of its Redis protocol backward compatibility.',
      consequences: [
        'Eliminates 12 standalone Redis nodes across production environments',
        'Saves estimated $14,000/year in cloud compute costs',
        'Consolidates compliance auditing into a single memory-graph boundary'
      ],
      affectedComponents: ['Redis OSS (Legacy Cache)', 'FalkorDB'],
      provenance: {
        sourceType: 'manual_audit',
        sourceName: 'docs/architecture/decisions/0028-redis-consolidation.md',
        confidence: 0.95,
        verifiedAt: '2026-09-28T16:00:00Z'
      }
    },
    {
      id: 'dec-034',
      company_id: 'acme-corp',
      code: 'ADR-034',
      title: 'Migrate Kafka Rebalance Protocol to Cooperative Sticky Assignor',
      status: 'under_review',
      date: '2026-10-14',
      authors: ['M. Jensen (Infra Lead)'],
      context: 'Sudden node evictions during autoscaling cause 45s partition lockups under default RangeAssignor.',
      decision: 'Enable cooperative sticky assignor across all 24 consumer groups in the dispatch namespace.',
      consequences: [
        'Partitions remain active during rolling deployment restarts',
        'Reduces rebalance storm impact by 85%'
      ],
      affectedComponents: ['Apache Kafka'],
      provenance: {
        sourceType: 'repo_config',
        sourceName: 'docs/architecture/decisions/0034-kafka-cooperative-sticky.md',
        confidence: 0.89,
        verifiedAt: '2026-10-14T09:00:00Z'
      }
    }
  ]
};
