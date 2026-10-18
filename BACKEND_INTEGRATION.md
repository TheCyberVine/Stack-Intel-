# Stack Intel — Backend Integration & Contract Specification

This document defines the boundary between the **Stack Intel** React frontend and the external **FastAPI + FalkorDB** backend (`https://github.com/TheCyberVine/stack-intel`) for the **WeMakeDevs × FalkorDB Graph Hacks** hackathon.

---

## 1. Scope Boundary Rules

1. **Frontend-Only Architecture**: The React frontend does **not** modify or implement Python/FastAPI backend files, database schemas, Cypher queries, or direct FalkorDB connections.
2. **Zero FalkorDB Credentials in Client**: The browser never connects directly to FalkorDB (`falkordb://` or redis protocol). All requests route strictly through the centralized HTTP client.
3. **Strict Mode Separation**:
   - `VITE_DATA_MODE=live`: Queries verified backend endpoints. On network or HTTP error, displays honest diagnostics. Never silently substitutes fixture data.
   - `VITE_DATA_MODE=demo`: Serves isolated static fixtures located in `src/fixtures/`. Displays persistent disclaimer banner.

---

## 2. Route Audit & Contract Status

Based on code-level audit of `https://github.com/TheCyberVine/stack-intel` (`app/main.py`, `app/services/actions.py`, `app/services/investigation.py`, `app/graph/queries.py`, and `app/graph/seed.py`):

### Confirmed Routes (Verified In Backend Repo)

| HTTP Method | Route | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check API availability and FalkorDB connection | **CONFIRMED** |
| `GET` | `/companies/{company_id}/overview` | Company profile, goals, objectives, tools, constraints | **CONFIRMED** |
| `POST` | `/companies/{company_id}/investigate` | Evidence-first FalkorDB graph investigation engine | **CONFIRMED** |
| `POST` | `/companies/{company_id}/actions` | Propose action backed by verified evidence IDs | **CONFIRMED** |
| `POST` | `/companies/{company_id}/actions/{action_id}/review` | Human approval gate (approve / reject action) | **CONFIRMED** |
| `POST` | `/companies/{company_id}/actions/{action_id}/simulate` | Safe simulation of approved action (zero infra changes) | **CONFIRMED** |

---

### Route Schemas & Implementation Contracts

#### 1. `GET /health`
- **Backend Handler**: `health()` in `app/main.py`
- **Response**:
```json
{
  "status": "ok",
  "graph": "connected"
}
```
- **Error**: Returns HTTP 503 `{"detail": "FalkorDB is currently unreachable."}` if FalkorDB connection fails.

---

#### 2. `GET /companies/{company_id}/overview`
- **Backend Handler**: `company_overview(company_id)` in `app/main.py`
- **Response (RelayForge Seeded Entity)**:
```json
{
  "company_id": "relayforge",
  "company_name": "RelayForge",
  "data_type": "synthetic_demo_data",
  "goals": [
    {
      "id": "improve_operational_efficiency",
      "description": "Improve operational efficiency and financial sustainability as the company grows",
      "type": "strategic_goal"
    },
    {
      "id": "maintain_latency",
      "description": "Keep p95 API latency below 400 ms",
      "type": "performance_target",
      "target": 400,
      "unit": "ms"
    },
    {
      "id": "improve_incident_recovery",
      "description": "Reduce mean time to recovery for production incidents by 20% over 90 days",
      "type": "improvement_target",
      "target": 20,
      "unit": "percent"
    }
  ],
  "objectives": [
    { "id": "maintain_reliability", "description": "Maintain reliable customer-facing services" },
    { "id": "preserve_security_visibility", "description": "Preserve security, error monitoring, and incident visibility" },
    { "id": "support_sustainable_operations", "description": "Support sustainable operations as the company grows" }
  ],
  "tools": [
    { "id": "aws", "name": "AWS", "monthly_cost": 465, "currency": "USD", "cost_period": "monthly" },
    { "id": "sentry", "name": "Sentry", "monthly_cost": 26, "currency": "USD", "cost_period": "monthly" }
  ],
  "constraints": [
    { "id": "approval_required", "description": "Production changes require human approval", "type": "operational" },
    { "id": "preserve_monitoring", "description": "Production changes must preserve error monitoring and incident visibility", "type": "operational" }
  ]
}
```
- **Error**: Returns HTTP 404 `{"detail": "Company not found."}` if company ID does not exist.

---

#### 3. `POST /companies/{company_id}/investigate`
- **Backend Handler**: `company_investigation(company_id, request)` in `app/main.py`
- **Request Body**:
```json
{
  "question": "Identify evidence-backed opportunities to improve operational efficiency while preserving reliability and security visibility."
}
```
- **Response**:
```json
{
  "company_id": "relayforge",
  "company_name": "RelayForge",
  "data_type": "synthetic_demo_data",
  "model": "provider/model-name",
  "evidence_count": 12,
  "analysis": {
    "executive_summary": "Concise evidence-first summary...",
    "findings": [
      {
        "title": "AWS Operational Spend Baseline",
        "statement": "RelayForge spends $465/month on AWS cloud infrastructure under synthetic demo metrics.",
        "type": "fact",
        "confidence": "high",
        "evidence_ids": ["company:relayforge", "tool:aws"]
      }
    ],
    "recommendations": [
      {
        "title": "Verify AWS Activate Founders Eligibility",
        "rationale": "Verifying eligibility could yield operational credits...",
        "expected_benefit": "Potential offset of $465/mo AWS spend if approved; no architecture changes required.",
        "risk": "Application may be rejected if criteria are not satisfied.",
        "status": "proposed",
        "evidence_ids": ["company:relayforge", "opportunity:aws_activate_credits"],
        "requires_human_approval": true
      }
    ],
    "open_questions": [
      "Has RelayForge previously received AWS Activate credits under any associated legal entity?"
    ]
  },
  "notice": "AI-generated analysis of supplied graph data. Recommendations are proposals, not executed actions."
}
```

---

#### 4. `POST /companies/{company_id}/actions`
- **Backend Handler**: `create_company_action(company_id, request)` in `app/main.py`
- **Request Body**:
```json
{
  "title": "Verify AWS Activate Founders Eligibility",
  "rationale": "Audit company incorporation date and AWS account billing history before submitting application.",
  "evidence_ids": ["company:relayforge", "opportunity:aws_activate_credits"],
  "action_type": "production_change",
  "preserves_monitoring": true
}
```
- **Response**:
```json
{
  "action_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "company_id": "relayforge",
  "status": "awaiting_approval",
  "requires_human_approval": true,
  "message": "Action proposal saved."
}
```

---

#### 5. `POST /companies/{company_id}/actions/{action_id}/review`
- **Backend Handler**: `review_company_action(company_id, action_id, request)` in `app/main.py`
- **Request Body**:
```json
{
  "decision": "approved"
}
```
- **Response**:
```json
{
  "action_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "approved"
}
```
- **Constraint Enforcement**: The backend strictly verifies `a.preserves_monitoring == true`. If `decision == "approved"` but monitoring is violated, the backend rejects with HTTP 400.

---

#### 6. `POST /companies/{company_id}/actions/{action_id}/simulate`
- **Backend Handler**: `simulate_company_action(company_id, action_id)` in `app/main.py`
- **Response**:
```json
{
  "action_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "simulated",
  "notice": "Simulation only. No production changes were made."
}
```

---

## 3. Unconfirmed / Missing Backend Endpoints

The following features were specified for frontend exploration but are **not** present in the backend repository:

| Proposed Feature | Target Endpoint | Current Backend State | Frontend Handling |
| :--- | :--- | :--- | :--- |
| **New Company Creation** | `POST /companies` | **NOT IMPLEMENTED** in backend | Frontend preserves user's form data in session state, explains that server-side graph write endpoint is not yet provided, and runs an isolated session sandbox assessment. |
| **Deep Component Inventory** | `GET /companies/{id}/stack` | **NOT IMPLEMENTED** | Frontend falls back to tools declared in `GET /companies/{id}/overview`. |
| **Institutional Memory Timeline** | `GET /companies/{id}/memory` | **NOT IMPLEMENTED** | In live mode, displays honest empty/unavailable state. In demo mode, displays explicitly labeled synthetic timeline. |
| **Operational Playbooks** | `GET /companies/{id}/playbooks` | **NOT IMPLEMENTED** | In live mode, displays honest empty state. In demo mode, displays labeled reference playbooks. |

---

## 4. Manual Testing Checklist (12 Verification Steps)

1. [x] **RelayForge Overview**: Load `relayforge` company profile; confirm tools (AWS $465/mo, Sentry $26/mo), goals, and constraints.
2. [x] **Backend Health Check**: Verify `GET /health` indicators correctly report FalkorDB connection status.
3. [x] **Homepage Entry**: Verify hero headline, "How it works" 4 steps, trust & transparency guarantees, and CTAs.
4. [x] **6-Step Onboarding**: Walk through Company Identity, Objectives, Tech Stack, Operational Metrics (target vs measurement), Constraints, and Review.
5. [x] **Honest Persistence Boundary**: Confirm onboarding submission explains that `POST /companies` is not yet implemented on the server without faking success.
6. [x] **Engine A (AWS Activate Credits)**: Verify 5 eligibility criteria are marked as "Unknown / Needs Verification" and official AWS documentation link works.
7. [x] **Engine B (Sentry vs GlitchTip)**: Verify alternative comparison includes "Retain Current Setup" as a legitimate outcome preserving monitoring safeguards.
8. [x] **Live Graph Investigation**: Run investigation against `POST /companies/{id}/investigate` and confirm findings, confidence, and evidence IDs render.
9. [x] **Action Proposal**: Submit action proposal to `POST /companies/{id}/actions` and verify `action_id` and `awaiting_approval` status.
10. [x] **Human Review & Approval**: Execute review via `POST /companies/{id}/actions/{id}/review` and verify status updates.
11. [x] **Simulation Execution**: Run `POST /companies/{id}/actions/{id}/simulate` and verify banner: *"Simulation only. No production changes were made."*
12. [x] **Demo Isolation**: Confirm custom sandbox and demo fixtures never mutate or contaminate the seeded RelayForge graph.
