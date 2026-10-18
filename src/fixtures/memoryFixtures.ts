import { MemoryEvent, PlaybookItem } from '../api/types';

export const mockMemoryEvents: Record<string, MemoryEvent[]> = {
  'relayforge': [
    {
      id: 'mem-rf-01',
      company_id: 'relayforge',
      timestamp: '2026-10-15T09:30:00Z',
      eventType: 'stack_detected',
      summary: 'Tech stack components ingested from repo configuration manifests',
      details: 'Detected AWS ($465/mo) and Sentry ($26/mo). Total monthly expenditure normalized to $491 USD.',
      relatedToolId: 'tool-aws',
      isSynthetic: true
    },
    {
      id: 'mem-rf-02',
      company_id: 'relayforge',
      timestamp: '2026-10-15T10:15:00Z',
      eventType: 'constraint_audited',
      summary: 'Operational constraint evaluated: Production changes require human approval',
      details: 'Audit checkpoint verified on GitHub deployment workflows (.github/workflows/production-deploy.yml). Gated ADR-RF-01 behind human sign-off.',
      relatedDecisionCode: 'ADR-RF-01',
      isSynthetic: true
    },
    {
      id: 'mem-rf-03',
      company_id: 'relayforge',
      timestamp: '2026-10-15T11:00:00Z',
      eventType: 'opportunity_identified',
      summary: 'Identified AWS Activate Credits investigation for operational efficiency',
      details: 'Referenced official source https://aws.amazon.com/startups/credits/. Initialized all 4 prerequisite requirements to Unknown pending user evidence.',
      relatedRequirementId: 'req-act-1',
      relatedToolId: 'tool-aws',
      isSynthetic: true
    },
    {
      id: 'mem-rf-04',
      company_id: 'relayforge',
      timestamp: '2026-10-15T13:45:00Z',
      eventType: 'decision_recorded',
      summary: 'Recorded executed status for FastAPI Healthcheck & Latency Probe (ADR-RF-03)',
      details: 'Deployed continuous probe in ECS task definitions. Outcome verification window active for p95 latency target (< 400ms).',
      relatedDecisionCode: 'ADR-RF-03',
      isSynthetic: true
    },
    {
      id: 'mem-rf-05',
      company_id: 'relayforge',
      timestamp: '2026-10-15T14:20:00Z',
      eventType: 'policy_check',
      summary: 'Enforced constraint: Preserve error monitoring and incident visibility',
      details: 'Reviewed and rejected ADR-RF-05 (Decommission Sentry). Error tracking required to achieve 90-day MTTR reduction target (100min to 80min).',
      relatedDecisionCode: 'ADR-RF-05',
      relatedToolId: 'tool-sentry',
      isSynthetic: true
    }
  ],
  'acme-corp': [
    {
      id: 'mem-acme-01',
      company_id: 'acme-corp',
      timestamp: '2026-10-08T11:20:00Z',
      eventType: 'decision_recorded',
      summary: 'Ratified ADR-031: Deploy FalkorDB as Canonical Route Topology Graph Store',
      details: 'Ratified by Architecture Review Board with sub-20ms p99 query latency verified.',
      relatedDecisionCode: 'ADR-031',
      isSynthetic: true
    }
  ]
};

export const mockPlaybooks: Record<string, PlaybookItem[]> = {
  'relayforge': [
    {
      id: 'pb-rf-01',
      code: 'PLAYBOOK-RF-01',
      title: 'Infrastructure Cost Audit & AWS Activate Verification',
      category: 'Cost Optimization',
      triggerCondition: 'Monthly cloud spend exceeds $450/mo or new promotional credit grant opportunity identified.',
      steps: [
        'Review current compute utilization on AWS ECS Fargate tasks.',
        'Collect formal proof of self-funded pre-seed startup status and active domain verification.',
        'Obtain mandatory human approval sign-off from Founder / Tech Lead before application submission.',
        'Submit dossier through official AWS Startups portal (https://aws.amazon.com/startups/credits/).'
      ],
      humanApprovalRequired: true,
      governingConstraint: 'Production changes require human approval.',
      isSynthetic: true
    },
    {
      id: 'pb-rf-02',
      code: 'PLAYBOOK-RF-02',
      title: 'p95 API Latency Degradation & Incident Triage',
      category: 'Reliability & MTTR',
      triggerCondition: 'p95 API response latency exceeds 400ms across 3 consecutive 5-minute sampling windows.',
      steps: [
        'Inspect real-time exception transactions in Sentry console for unhandled database timeouts.',
        'Check ECS task CPU/Memory throttling metrics in CloudWatch.',
        'Trigger automated rollback script (ADR-RF-04) if error rate persists above 1%.',
        'Record incident timestamp and log post-mortem to track MTTR against 80-minute goal.'
      ],
      humanApprovalRequired: true,
      governingConstraint: 'Preserve error monitoring and incident visibility.',
      isSynthetic: true
    }
  ],
  'acme-corp': [
    {
      id: 'pb-acme-01',
      code: 'PLAYBOOK-ACME-01',
      title: 'Graph Topology Failover & Redis Cache Resynchronization',
      category: 'High Availability',
      triggerCondition: 'FalkorDB primary node heartbeat lost for > 5 seconds.',
      steps: [
        'Promote hot standby replica in AWS EKS cluster.',
        'Update client connection pools to new master endpoint.',
        'Verify sub-20ms p99 route calculations across transit graph.'
      ],
      humanApprovalRequired: false,
      governingConstraint: '99.95% logistics route dispatch availability SLA.',
      isSynthetic: true
    }
  ]
};
