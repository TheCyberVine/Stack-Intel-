# Stack Intel — Evidence-First Company Intelligence Workspace

> **WeMakeDevs × FalkorDB Graph Hacks Hackathon — Full Frontend Integration & User Journey**
> Backend Repository: `https://github.com/TheCyberVine/stack-intel`

Stack Intel is an evidence-first operational intelligence and technology-stack decision-support agent. It connects a company's actual or explicitly declared information to relevant goals, tools, constraints, opportunities, evidence, and potential actions backed by FalkorDB.

---

## 🚀 The Complete End-to-End User Journey

1. **Homepage & Orientation**:
   - First-time visitor entry point explaining the product value proposition: *"Make better decisions about your company's technology stack."*
   - Explains the 4-step workflow: Tell us about your company → Connect the context → Investigate opportunities → Decide with confidence.
   - Core trust & transparency principles: Evidence-linked findings, explicit unknown criteria, human approval gates, and simulation ≠ production changes.
   - 1-click access to the seeded RelayForge demo.

2. **6-Step Structured Onboarding**:
   - **Step 1: Company Identity** (Name, industry/type, stage, website, description).
   - **Step 2: Business Objectives** (Select multiple, set primary goal, linked to graph goal nodes).
   - **Step 3: Existing Technology Stack** (Add multiple tools, categories, plans, and monthly costs; supports unknown costs).
   - **Step 4: Operational Metrics & Problems** (Strictly distinguishes *targets* like p95 latency < 400ms from *measured telemetry*).
   - **Step 5: Constraints & Guardrails** (Human approval required, preserve monitoring, zero downtime).
   - **Step 6: Review & Confirmation** (Summarizes submitted data, explains backend persistence status honestly).

3. **FalkorDB Graph Investigation Engine**:
   - Queries `POST /companies/{id}/investigate` with evidence-backed questions.
   - Displays executive summary, findings with evidence IDs, recommendations, and open questions.
   - **Engine A (Optimize Current Stack)**: Evaluates AWS Activate Founders Credits ($465/mo AWS spend, audits 5 criteria marked as Unknown, links to official AWS portal).
   - **Engine B (Evaluate Alternatives)**: Evaluates Sentry ($26/mo) vs GlitchTip, with **"Retain Current Setup"** as a legitimate outcome to preserve monitoring safeguards.

4. **Action Proposal, Review & Simulation**:
   - **Propose Action** (`POST /companies/{id}/actions`): Validates proposal against evidence IDs.
   - **Human Review Gate** (`POST /companies/{id}/actions/{id}/review`): Explicitly approve or reject actions.
   - **Safe Simulation** (`POST /companies/{id}/actions/{id}/simulate`): Records simulated action without touching real infrastructure; displays *"Simulation completed. No production changes were made."*

### 5. Decisions & Activity (Part 4)
- Traceable Architectural Decision Records (ADRs) with 6 strictly non-interchangeable statuses:
  - `Draft`: Proposed formulation under author draft.
  - `Awaiting Approval`: Pending formal review by designated technical leads.
  - `Approved`: Ratified by architecture review leads, but **not yet executed**.
  - `Rejected`: Declined per constraint violation or unacceptable trade-offs.
  - `Executed`: Infrastructure change deployed, but **empirical outcome unverified**.
  - `Outcome Verified`: Empirical metrics collected and verified against operational goals.
- In Demo mode, status transitions are local to React state and labeled with explicit `SIMULATED` tags. The UI never claims a decision was persisted to the backend when only a local button was clicked.

### 6. Institutional Memory & Governance Playbooks (Part 4)
- Immutable chronological memory timeline capturing events (`stack_detected`, `constraint_audited`, `opportunity_identified`, `decision_recorded`, `evidence_verified`, `policy_check`) with linked ADRs, tools, and requirements.
- Pre-approved Operational Playbooks enforcing human approval guardrails and governing constraints.

### 7. Security & Correctness Audit (Part 4)
- Zero backend files modified; no FalkorDB credentials or secret keys exposed to the client.
- All external links sanitized via `isValidHttpUrl` to prevent `javascript:` or `data:` script injection.
- User inputs sanitized and bounded via `sanitizeInput`.
- Centralized API client with request cancellation and zero silent fixture fallback.

---

## 📋 Final Implementation Report

### 1. Implemented and Verified
- **RelayForge Overview & Stack Inventory**: Verified display of company metadata, AWS ($465) and Sentry ($26) toolcards, total costs ($491), goals, and constraints.
- **REST Health Check & FalkorDB Status**: Verified dual-check status reporting REST API availability and FalkorDB graph connectivity.
- **AWS Activate Credits Investigation**: Verified presentation with official source link, unverified initial requirements, trade-offs, and 6-stage benefit lifecycle.
- **Evidence Review & URL Sanitization**: Verified submission modal, origin labeling (`user_provided`), and HTTP/HTTPS scheme enforcement.
- **Custom Sandbox**: Verified isolated multi-tool and multi-goal form with independent React session state.
- **RelationshipPath Visualization**: Verified responsive graph traversal paths from Company down to Evidence and Assessment.
- **Decisions Lifecycle**: Verified ADR inspector with all 6 non-interchangeable statuses, local simulation controls in Demo mode, and status filter pills.
- **Institutional Memory Timeline**: Verified event list with timestamp formatting, event type badges, and linked entity tags.
- **Operational Playbooks**: Verified guardrail policy display with mandatory human approval flags.
- **Automated Test Suite**: 14 tests passing cleanly via `npm test` (`node:test`).
- **Production Build & Lint**: `npm run build` and `npm run lint` succeed with zero errors.

### 2. Implemented but Not Fully Verified (Pending Live Backend Endpoints)
- **Live Memory Timeline (`GET /companies/{id}/memory`)**: Frontend client and UI view ready; tested against synthetic demo fixtures.
- **Live Playbooks Query (`GET /companies/{id}/playbooks`)**: Frontend client and UI view ready; tested against synthetic demo fixtures.
- **Live Decision Action Persistence (`POST /companies/{id}/decisions/{id}/actions`)**: Frontend handles simulated local transitions with explicit disclaimer; backend route is unconfirmed.
- **Live Evidence Submission (`POST /investigations/{id}/evidence`)**: Frontend handles local user-provided evidence submission; backend route is unconfirmed.

### 3. Demo Fixtures Only
- **Synthetic RelayForge ADRs (`mockDecisions`)**: Pre-populated with 6 realistic ADRs illustrating each distinct status (Draft, Awaiting approval, Approved, Rejected, Executed, Outcome verified).
- **Synthetic Memory Events (`mockMemoryEvents`)**: Realistic audit events demonstrating stack detection, constraint audits, and policy enforcement.
- **Synthetic Playbooks (`mockPlaybooks`)**: Standard operating procedures for zero-downtime database upgrades and high-latency incident rollback.
- **AWS Activate Synthetic Requirements**: Initial unknown status fixtures.

### 4. Blocked by Backend Dependencies
- **Persistent Company Creation**: Saving custom sandbox entities permanently requires a backend `POST /companies` endpoint. Currently kept in isolated React session state.
- **Automated Evidence Verification**: Transitioning user-submitted links from `user_provided` to `verified` requires backend crawler or human review API.
- **Real-time FalkorDB Cypher Mutation**: Persisting status changes to the graph database requires backend RPC routes.

---

## 🧪 Verification & Test Results

```bash
$ npm test
TAP version 13
# Subtest: formatConfidencePercent formats clamped percentages (ok)
# Subtest: formatIsoDate formats valid dates gracefully (ok)
# Subtest: calculateStackHealthScore calculates weighted normalized score (ok)
# Subtest: getStatusDetails provides status label and accessibility symbol (ok)
# Subtest: getStatusDetails distinguishes non-interchangeable Part 4 decision statuses (ok)
# Subtest: isValidHttpUrl rejects unsafe schemes and accepts valid HTTP/HTTPS URLs (ok)
# Subtest: sanitizeInput enforces boundaries and trims whitespace (ok)
# Subtest: getEvidenceStatusDetails maps all defined statuses correctly (ok)
# Subtest: getEvidenceOriginDetails identifies user-provided vs public sources (ok)
# Subtest: getRelationshipStatusDetails formats relationship symbols (ok)
# Subtest: generateCustomSandboxAssessment produces isolated result without RelayForge data (ok)
# Subtest: formatCurrency formats USD amounts correctly (ok)
# Subtest: normalizeCompanyOverview handles full RelayForge payload (ok)
# Subtest: normalizeCompanyOverview handles sparse or missing payload gracefully (ok)
1..14
# tests 14
# pass 14
# fail 0
```

```bash
$ npm run lint
> tsc --noEmit
(zero errors)
```

```bash
$ npm run build
> vite build
✓ built in 1.4s
(zero errors)
```

---

## 🚀 Getting Started

### Development
```bash
npm run dev
```

### Running Unit Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

