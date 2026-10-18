import { HealthResponse } from '../api/types';

export const mockHealthResponse: HealthResponse = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '1.4.0-edge',
  database: 'falkordb-graph-engine',
  services: {
    falkordb: 'up',
    cypher_indexer: 'up',
    telemetry_pipeline: 'up',
    evidence_verifier: 'up'
  }
};
