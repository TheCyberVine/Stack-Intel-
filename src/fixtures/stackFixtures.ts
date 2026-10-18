import { TechStackComponent } from '../api/types';

export const mockStackComponents: Record<string, TechStackComponent[]> = {
  'relayforge': [
    {
      id: 'tool-aws',
      name: 'AWS',
      category: 'Infrastructure',
      version: 'Cloud Platform (On-Demand)',
      status: 'operational',
      confidence: 1.0,
      evidenceSource: 'Synthetic Demo Billing: AWS Monthly Estimate ($465)',
      license: 'Commercial Cloud',
      lastAudited: '2026-10-15T16:00:00Z',
      dependenciesCount: 1,
      ecosystem: 'Cloud Container & Network',
      description: 'Primary cloud hosting environment supporting RelayForge workflow automation engine and API containers.',
      monthlyCostEstimate: 465,
      openIssuesCount: 0,
      provenance: {
        sourceType: 'synthetic_fixture',
        sourceName: 'fixtures/relayforge/billing.json',
        confidence: 1.0,
        verifiedAt: '2026-10-15T16:00:00Z',
        notes: 'Synthetic demo data for RelayForge. Not verified cloud telemetry.'
      }
    },
    {
      id: 'tool-sentry',
      name: 'Sentry',
      category: 'Observability',
      version: 'Team SaaS Subscription',
      status: 'operational',
      confidence: 1.0,
      evidenceSource: 'Synthetic Demo Billing: Sentry Team Plan ($26)',
      license: 'Commercial SaaS',
      lastAudited: '2026-10-15T16:00:00Z',
      dependenciesCount: 1,
      ecosystem: 'Error Monitoring & Triage',
      description: 'Centralized exception alerting and crash triage for RelayForge backend services.',
      monthlyCostEstimate: 26,
      openIssuesCount: 0,
      provenance: {
        sourceType: 'synthetic_fixture',
        sourceName: 'fixtures/relayforge/billing.json',
        confidence: 1.0,
        verifiedAt: '2026-10-15T16:00:00Z',
        notes: 'Synthetic demo data for RelayForge. Not verified cloud telemetry.'
      }
    }
  ],

  'acme-corp': [
    {
      id: 'comp-falkordb',
      name: 'FalkorDB',
      category: 'Database & Graph',
      version: 'v0.4.1',
      status: 'operational',
      confidence: 0.98,
      evidenceSource: 'k8s/falkordb-statefulset.yaml',
      license: 'SSPL / Commercial',
      lastAudited: '2026-10-10T14:20:00Z',
      dependenciesCount: 8,
      ecosystem: 'Graph Engine',
      description: 'Ultra low-latency graph database backed by RedisGraph-derived sparse matrix linear algebra and Cypher query planner.',
      monthlyCostEstimate: 1200,
      openIssuesCount: 0,
      provenance: {
        sourceType: 'repo_config',
        sourceName: 'infra/k8s/falkordb-statefulset.yaml',
        confidence: 0.98,
        verifiedAt: '2026-10-10T14:20:00Z',
        notes: 'Verified running on 3 HA replica nodes in eu-west-1'
      }
    },
    {
      id: 'comp-fastapi',
      name: 'FastAPI',
      category: 'Backend API',
      version: '0.115.0',
      status: 'operational',
      confidence: 0.95,
      evidenceSource: 'services/dispatch-api/pyproject.toml',
      license: 'MIT',
      lastAudited: '2026-10-12T08:15:00Z',
      dependenciesCount: 14,
      ecosystem: 'Python',
      description: 'High-performance ASGI API gateway serving routing coordinates to mobile driver terminals.',
      monthlyCostEstimate: 450,
      openIssuesCount: 2,
      provenance: {
        sourceType: 'package_manifest',
        sourceName: 'services/dispatch-api/pyproject.toml',
        confidence: 0.95,
        verifiedAt: '2026-10-12T08:15:00Z'
      }
    }
  ]
};
