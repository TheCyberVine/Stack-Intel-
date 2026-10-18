# Backend Schema Reference & Frontend Endpoint Alignment

A non-invasive plan to inspect a public backend GitHub repository, extract its exact API endpoint contracts, models, and HTTP routes, and align the frontend request URLs and typed contracts accordingly—without modifying backend code or forcing a live connection.

### User Review & Critical Decisions

> [!IMPORTANT]
> The backend repository will remain completely unmodified and standalone. The frontend will remain strictly decoupled with independent runtime execution, updated only to align its endpoint mappings and data models with the real backend specifications.

- **Confirmed Decision 1**: Backend repository will be provided via public GitHub URL.
- **Confirmed Decision 2**: Primary frontend goal is to map client request paths to real backend endpoint routes.
- **Next Step**: Once you provide the backend GitHub repository URL (or when you click Proceed), we will inspect the repository's router/controller definitions and align the frontend API routes.

---

### 1. Overview & Core Concept

- **What It Does**: Inspects the backend repository's route declarations, controller definitions, and data models to update the frontend's centralized API client (`src/api/client.ts`), contract specifications (`BACKEND_INTEGRATION.md`), and TypeScript definitions (`src/types/`).
- **Target Persona**: Engineers and hackathon judges reviewing Stack Intel's API integration readiness and architectural accuracy.
- **Key Value**: Guarantees 1:1 route alignment with the real backend service while preserving zero backend modification and ensuring reliable fallback/demo behavior when running disconnected.

---

### 2. User Experience & Visual Design

- **Navigation & Inspection**:
  - The frontend UI retains its 4 dedicated workspaces:
    1. **Company Intelligence** (RelayForge overview, company goals, constraints)
    2. **StackHub & Tooling** (AWS, Sentry, deep inventory)
    3. **Investigations & Sandbox** (AWS Activate credits, requirement verification, custom sandbox)
    4. **Decisions & Memory** (ADR lifecycle, institutional timeline, playbooks)
- **Endpoint Alignment Visibility**:
  - Add or update the Developer / API Status Inspector to display the exact mapped endpoint URL paths (e.g. `/api/v1/companies`, `/api/v1/investigations`), showing active target route paths alongside HTTP status indicators.
- **Visual Identity**:
  - High-density dark slate theme (`#0B0F17` background with `#1E293B` surfaces), monospaced tabular figures (`tabular-nums`) for numeric data and timestamps, and zero-pill typographic metadata separators (`·`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero Backend Code Changes**:
  - *Chosen Approach*: The backend repository is treated as a read-only reference or upstream specification. No backend files or database configurations will be touched.
  - *Why*: Satisfies the strict architectural constraint that the frontend development must not alter the backend.
- **Decision 2: Centralized Endpoint Configuration**:
  - *Chosen Approach*: All mapped endpoint paths are consolidated inside `src/api/client.ts` with explicit route path constants matching the backend router.
  - *Why*: Allows swapping between live backend base URLs (`VITE_API_BASE_URL`) and simulated sandbox fixtures with zero code duplication.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│             Reference Backend Repository               │
│   (Read-only inspection of routes, controllers, DTOs)   │
└───────────────────────────┬────────────────────────────┘
                            │ Read & Map Endpoints
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Frontend Client                      │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │  src/api/client.ts (Mapped Endpoint Paths)     │   │
│   └───────────────────────┬────────────────────────┘   │
│                           │                            │
│           ┌───────────────┴───────────────┐            │
│           ▼                               ▼            │
│  Live API Request               Offline / Demo Fixture │
│  (Real endpoints)               (Contract-conforming)  │
│           │                               │            │
│           └───────────────┬───────────────┘            │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │  Normalized React State & UI Components        │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

- **Alignment Phases**:
  1. **Inspection**: Once the repo URL is provided, clone or read route files (e.g., FastAPI/Express/NestJS routes) to extract exact HTTP methods, path strings, and parameter names.
  2. **Endpoint Mapping**: Update `src/api/client.ts` with confirmed URL paths.
  3. **Documentation**: Update `BACKEND_INTEGRATION.md` with verified route signatures.
  4. **Verification**: Run TypeScript build and tests to verify flawless compilation.
