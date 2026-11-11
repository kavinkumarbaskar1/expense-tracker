# Architecture Requirements Document (ARD)

> Replace all `<PLACEHOLDER>` values. Every material architecture decision or constraint should have a stable ID that feature specifications can reference.

## Document Metadata

- **Product/Application:** Daily Expense Tracker MVP
- **Document ID:** ARD-DET-MVP
- **Version:** 0.1
- **Status:** Draft
- **Architecture Owner:** TBD
- **Contributors:** TBD
- **Last Updated:** 2026-11-11
- **Reference PRD:** `PRD.md`

---

## 1. Architecture Summary

Daily Expense Tracker MVP will be implemented as a desktop-first internal web application with a React frontend, Python/FastAPI REST backend, and SQLite relational database running on a single local or internal host. The browser will interact only with the REST API; it will not access persistence directly. FastAPI will own validation, persistence orchestration, aggregate calculations, and structured JSON error responses. SQLite will be the system of record for expense records.

The architecture is intentionally small and modular: presentation, API orchestration, domain validation, aggregate calculations, and persistence are separated so the MVP can satisfy expense CRUD, filtering, totals, summaries, and persistence requirements while remaining clear enough for future accounting integrations. The MVP excludes user accounts, authentication, authorization, third-party integrations, mobile optimization, and performance commitments beyond PRD-defined acceptance outcomes.

## 2. Architecture Drivers

- PRD-FR-001 — The architecture must support creation of expenses with title, amount, category, expense date, and optional description.
- PRD-FR-002 — The architecture must enforce validation in the frontend workflow and at the API boundary before persistence.
- PRD-FR-003 — The architecture must return and render all persisted expenses with required fields and empty states.
- PRD-FR-004 — The architecture must support validated updates while preserving persisted state on failed validation.
- PRD-FR-005 — The architecture must support confirmed permanent deletion and recalculation of displayed summaries.
- PRD-FR-006 — The architecture must support category filtering for Food, Travel, Shopping, Bills, and Other.
- PRD-FR-007 — The architecture must expose total spending for the currently displayed expense list.
- PRD-FR-008 — The architecture must expose category-wise spending summary for the currently displayed expense list.
- PRD-FR-009 — The architecture must persist expenses so records survive browser refresh and application restart.
- PRD-FR-010 — The architecture must provide structured REST endpoints for CRUD, filtering, totals, and summary.
- PRD-NFR-001 — The architecture must apply basic internal MVP security controls, including server-side validation, safe database access, and no sensitive payment data storage.
- PRD-NFR-002 — The architecture must support a clean, desktop-first internal dashboard with readable labels and user-friendly errors.
- PRD-NFR-003 — The data architecture must limit stored fields to the MVP expense-tracking fields.
- CON-001 — The company context is a small business in the financial-services industry.
- CON-002 — The MVP must be local or internal-only and used by one person at a time.
- CON-003 — The MVP must not include user accounts or authentication.
- CON-004 — The frontend must use a REST API rather than direct database access.
- CON-005 — Persistence must use a relational database such as SQLite.
- CON-006 — Supported categories are limited to Food, Travel, Shopping, Bills, and Other.
- CON-007 — Mobile responsiveness is not a requirement for the MVP; the dashboard is desktop-first.
- CON-008 — No formal performance requirement is defined for the MVP.

## 3. Architecture Principles

1. Keep the MVP local/internal-only and single-user unless the PRD is revised.
2. Validate all expense data at the API boundary before database writes.
3. Reuse established repository and platform patterns where appropriate.
4. Keep presentation, orchestration, domain, integration, and persistence concerns separated.
5. Store only PRD-approved expense data and exclude sensitive payment, bank, credential, receipt, and account data.
6. Prefer explicit REST contracts and structured error payloads to keep future integration paths understandable.

## 4. System Context

### 4.1 Actors

- PERSONA-001 Individual Employee — Uses the browser dashboard to add, view, edit, delete, filter, and summarize expenses.
- Browser Runtime — Hosts the React single-page interface and sends REST requests to the FastAPI backend.
- FastAPI Backend — Provides REST endpoints, validation, aggregate calculations, persistence orchestration, and structured API errors.
- SQLite Database — Stores expense records for persistence across browser refresh and application restart.

### 4.2 External Systems

| ID | System | Purpose | Interface | Owner |
|---|---|---|---|---|
| EXT-001 | None for MVP | No external systems or third-party integrations are included in the approved MVP scope | Not applicable | Not applicable |

## 5. Technology Stack

| Layer | Technology | Version/Constraint | Rationale |
|---|---|---|---|
| Frontend | React | Version TBD by Engineering Lead under ARC-OQ-001 | Supports a clean dashboard UI and component-based expense workflows |
| Backend | Python/FastAPI | Python and FastAPI versions TBD by Engineering Lead under ARC-OQ-001 | Provides explicit REST endpoints, request validation, JSON error models, and lightweight API implementation |
| Data | SQLite | SQLite version/runtime TBD by Engineering Lead under ARC-OQ-001 | Satisfies relational persistence for a local/internal single-user MVP |
| Hosting | Single local/internal host | Frontend static assets, FastAPI service, and SQLite database run on the same local/internal machine | Matches single-user local/internal scope and avoids unnecessary deployment complexity |

## 6. Logical Architecture

### 6.1 Components

#### COMP-001 — React Dashboard

- **Responsibility:** Render the desktop-first dashboard, expense form, expense list, filters, total spending, category summary, empty states, and user-friendly validation/API error messages.
- **Inputs:** User-entered expense fields, category filter selections, delete confirmations, REST API responses.
- **Outputs:** REST API requests, rendered dashboard state, validation and API error displays.
- **Dependencies:** COMP-002.
- **Repository Area:** `frontend/` or TBD under ARC-OQ-002.

#### COMP-002 — FastAPI REST API

- **Responsibility:** Expose REST endpoints for expense CRUD, category filtering, total spending, and category summary; enforce server-side validation; return structured JSON errors.
- **Inputs:** HTTP REST requests from COMP-001.
- **Outputs:** Expense JSON, aggregate JSON, structured error JSON, persistence commands to COMP-004.
- **Dependencies:** COMP-003, COMP-004.
- **Repository Area:** `backend/` or TBD under ARC-OQ-002.

#### COMP-003 — Expense Domain Service

- **Responsibility:** Apply domain rules for supported categories, positive amounts, required titles, editable expense dates, deletion behavior, and aggregate calculations.
- **Inputs:** Parsed expense commands and queries from COMP-002.
- **Outputs:** Validated expense data, total spending values, category summary values, domain validation errors.
- **Dependencies:** COMP-004.
- **Repository Area:** `backend/app/domain/` or TBD under ARC-OQ-002.

#### COMP-004 — SQLite Persistence Layer

- **Responsibility:** Store, retrieve, update, and permanently delete expense records using safe parameterized or ORM-mediated database access.
- **Inputs:** Validated persistence operations from COMP-003.
- **Outputs:** Persisted expense records and query results.
- **Dependencies:** DATA-001.
- **Repository Area:** `backend/app/persistence/` or TBD under ARC-OQ-002.

#### COMP-005 — Local/Internal Runtime

- **Responsibility:** Run the static frontend, FastAPI service, and SQLite database file on a single local/internal host.
- **Inputs:** Application build artifacts, runtime configuration, SQLite database file path.
- **Outputs:** Running local/internal MVP application.
- **Dependencies:** COMP-001, COMP-002, COMP-004.
- **Repository Area:** `deploy/` or TBD under ARC-OQ-002.

### 6.2 Data Flow

1. PERSONA-001 uses COMP-001 to enter or modify expense data, select filters, or confirm deletion.
2. COMP-001 sends structured REST requests to COMP-002 for CRUD, filtered expense lists, totals, and category summaries.
3. COMP-002 parses requests and delegates validation, category rules, and aggregate calculations to COMP-003.
4. COMP-003 rejects invalid title, amount, or category values before persistence and returns domain errors to COMP-002.
5. COMP-004 persists valid expense changes in SQLite and returns stored records or query results.
6. COMP-002 returns expense, total, summary, or structured error JSON to COMP-001.
7. COMP-001 renders the expense list, empty/no-results states, total spending, category-wise summary, and user-friendly messages.

## 7. Architecture Decisions

### ARD-DEC-001 — Use React, FastAPI, and SQLite for the MVP

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-003, PRD-FR-009, PRD-FR-010, PRD-NFR-002

**Decision**

The MVP will use a React frontend, Python/FastAPI backend, and SQLite relational database.

**Rationale**

This stack supports a clean dashboard, explicit REST API contracts, server-side validation, and simple relational persistence appropriate for a small local/internal single-user MVP.

**Consequences**

- React can isolate dashboard, form, list, filter, and summary UI concerns.
- FastAPI can provide request validation and structured JSON responses.
- SQLite simplifies deployment but is not selected for multi-user, high-concurrency, or public internet use cases.
- Exact framework versions remain TBD under ARC-OQ-001.

**Alternatives Considered**

- React, Node.js/Express, and SQLite — Not selected because the approved architecture choice is Python/FastAPI.
- Server-rendered Django app with SQLite — Not selected because the approved architecture separates a React frontend from a REST API.
- Stack-neutral architecture — Not selected because implementation stack standardization was requested for the ARD.

### ARD-DEC-002 — Run on a Single Local/Internal Host

- **Status:** Accepted
- **Related Requirements:** PRD-FR-009, PRD-FR-010, PRD-NFR-001, PRD-NFR-003

**Decision**

The MVP will run frontend static assets, the FastAPI backend, and SQLite persistence on one local/internal host.

**Rationale**

The PRD limits the MVP to local or internal-only, single-user operation with no authentication. A single-host deployment minimizes operational complexity and reduces the exposure surface.

**Consequences**

- Deployment is simpler than a distributed topology.
- SQLite file access stays local to the backend host.
- The app must not be treated as safe for public internet exposure without revisiting authentication, authorization, and deployment controls.

**Alternatives Considered**

- Separate frontend and backend hosts — Not selected because it adds complexity not required for the MVP.
- Containerized local/internal deployment with SQLite volume — Viable later, but not selected as the baseline unless Engineering chooses it under ARC-OQ-005.
- Public internet-facing deployment — Not selected because it conflicts with CON-002 and increases risk from CON-003.

### ARD-DEC-003 — Backend Owns Summary and Total Calculations

- **Status:** Accepted
- **Related Requirements:** PRD-FR-006, PRD-FR-007, PRD-FR-008, PRD-FR-010

**Decision**

The FastAPI backend will expose endpoints that return expense lists, total spending, and category-wise summaries for the requested category filter context.

**Rationale**

Centralizing calculations in the backend keeps totals consistent with persisted data and positions the REST API for future integration consumers without adding accounting-specific endpoints.

**Consequences**

- The frontend can render aggregates without duplicating authoritative calculation logic.
- Backend aggregate tests become required for correctness.
- API endpoints must consistently apply category filters to list and summary results.

**Alternatives Considered**

- Frontend-only calculations — Not selected because it duplicates domain logic and weakens future API reuse.
- Backend all-time totals with frontend filtered totals — Not selected because it splits aggregate responsibility.

### ARD-DEC-004 — Store Monetary Amounts as Floating-Point Values for MVP Simplicity

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-007, PRD-FR-008

**Decision**

The MVP will store expense amounts as floating-point values in SQLite and display them with two decimal places using a default currency display that remains TBD.

**Rationale**

The approved architecture decision prioritizes MVP simplicity over production-grade monetary precision, and the PRD does not define currency code, accounting reconciliation, or multi-currency requirements.

**Consequences**

- Implementation is simple for the MVP.
- Floating-point rounding may create precision issues if the app later supports accounting integration, reconciliation, or high-precision financial reporting.
- Future architecture may need migration to integer minor units or fixed decimal storage.

**Alternatives Considered**

- Integer minor units with currency metadata — Not selected because the approved architecture choice was floating-point MVP storage.
- Decimal numeric values with two decimal places — Not selected for this MVP decision, but remains a future hardening option.

### ARD-DEC-005 — Use Structured JSON API Errors

- **Status:** Accepted
- **Related Requirements:** PRD-FR-002, PRD-FR-010, PRD-NFR-002

**Decision**

The REST API will return JSON errors with a machine-readable code, user-safe message, and field-level validation details when applicable.

**Rationale**

Structured errors let the frontend display plain-language validation and API messages near relevant workflows while preserving stable programmatic error handling.

**Consequences**

- The frontend can map field-level errors to form controls.
- API implementation must normalize validation, not-found, and server errors.
- Error payloads must not expose stack traces, SQL details, secrets, or sensitive host information.

**Alternatives Considered**

- Plain-text HTTP errors — Not selected because they are harder for the UI to map to fields and user-friendly messages.
- Framework-default error payloads only — Not selected because they may be inconsistent or expose implementation details.

### ARD-DEC-006 — No External Integrations in MVP

- **Status:** Accepted
- **Related Requirements:** PRD-FR-010, PRD-NFR-003

**Decision**

The MVP architecture will include no external systems, no accounting integration endpoints, and no third-party service dependencies.

**Rationale**

The PRD explicitly keeps future accounting integrations out of scope while requiring a clear REST API structure for possible future use.

**Consequences**

- Integration complexity is avoided in the MVP.
- REST resource design should remain clear and provider-neutral.
- Accounting-specific data fields and provider assumptions must not be added without future PRD approval.

**Alternatives Considered**

- Placeholder accounting integration endpoints — Not selected because accounting integrations are out of scope.
- Provider-specific database schema — Not selected because no accounting provider has been approved.

## 8. API and Integration Architecture

### ARD-API-001 — Expense Collection API

- **Type:** REST
- **Operation/Topic:** `GET /api/expenses`, `POST /api/expenses`
- **Provider:** COMP-002
- **Consumers:** COMP-001
- **Authentication:** None for MVP per CON-003; endpoint must remain local/internal-only per CON-002
- **Versioning:** URI prefix versioning is TBD under ARC-OQ-006; MVP may use `/api` until versioning is finalized

**Request/Input Contract**

`GET /api/expenses` accepts optional query parameter `category` with allowed values `Food`, `Travel`, `Shopping`, `Bills`, or `Other`. `POST /api/expenses` accepts JSON containing `title` string, `amount` positive floating-point number, `category` enum, `expenseDate` date, and optional `description` string.

**Response/Output Contract**

`GET /api/expenses` returns a JSON array of expense objects. `POST /api/expenses` returns the created expense object including generated `id`, `title`, `amount`, `category`, `expenseDate`, optional `description`, and implementation-managed timestamps if adopted under ARC-OQ-007.

**Error Handling**

Validation failures return a JSON error with machine-readable `code`, user-safe `message`, and field-level `details` where applicable. Unsupported categories, empty title, and non-positive amount must be rejected without persistence. Retry is client-driven only; `POST` is not idempotent unless future idempotency keys are approved.

### ARD-API-002 — Expense Item API

- **Type:** REST
- **Operation/Topic:** `GET /api/expenses/{expenseId}`, `PUT /api/expenses/{expenseId}`, `DELETE /api/expenses/{expenseId}`
- **Provider:** COMP-002
- **Consumers:** COMP-001
- **Authentication:** None for MVP per CON-003; endpoint must remain local/internal-only per CON-002
- **Versioning:** URI prefix versioning is TBD under ARC-OQ-006; MVP may use `/api` until versioning is finalized

**Request/Input Contract**

`expenseId` identifies an existing expense. `PUT /api/expenses/{expenseId}` accepts the same editable fields as creation: `title`, `amount`, `category`, `expenseDate`, and optional `description`. `DELETE /api/expenses/{expenseId}` accepts no body.

**Response/Output Contract**

`GET` and `PUT` return the expense object. `DELETE` returns a successful deletion result with no expense body or a minimal JSON confirmation, final shape TBD under ARC-OQ-006.

**Error Handling**

Validation errors use the structured JSON error model from ARD-DEC-005. Missing records return a user-safe not-found error. Failed edit validation must not mutate the stored expense. `DELETE` permanently removes the record after frontend confirmation; repeated delete calls may return not-found.

### ARD-API-003 — Expense Summary API

- **Type:** REST
- **Operation/Topic:** `GET /api/expenses/summary`
- **Provider:** COMP-002
- **Consumers:** COMP-001
- **Authentication:** None for MVP per CON-003; endpoint must remain local/internal-only per CON-002
- **Versioning:** URI prefix versioning is TBD under ARC-OQ-006; MVP may use `/api` until versioning is finalized

**Request/Input Contract**

Accepts optional query parameter `category` with allowed values `Food`, `Travel`, `Shopping`, `Bills`, or `Other`. The filter context must match the currently displayed expense list.

**Response/Output Contract**

Returns JSON containing `totalAmount` as a floating-point number and `categoryTotals` as grouped totals by category for the current filter context. Currency code and symbol remain TBD under ARC-OQ-003.

**Error Handling**

Unsupported category query values return a structured validation error. Empty result sets return zero totals and an empty or zero-spend category summary suitable for frontend empty-state rendering.

## 9. Data Architecture

### DATA-001 — Expense

- **Purpose:** Store the MVP expense record needed for CRUD, category filtering, total spending, and category-wise summary.
- **System of Record:** SQLite database managed by COMP-004.
- **Classification:** TBD under ARC-OQ-004; must not include sensitive payment, card, bank, credential, receipt, or account data per PRD-NFR-003.
- **Retention:** TBD under ARC-OQ-004; deletion is permanent when the user confirms delete per PRD-FR-005.
- **Key Relationships:** Standalone entity for MVP; no user, receipt, budget, recurring expense, export, or accounting integration relationships.

### Data Migration

- **Required:** No
- **Approach:** No existing expense data migration is in scope for the MVP. Future schema changes, including possible migration away from floating-point amount storage, will require a separate migration plan.

## 10. Security Architecture

### ARD-SEC-001 — Basic Internal MVP Security Boundary

- **Related Requirements:** PRD-NFR-001, PRD-NFR-003

The implementation must:

- Enforce server-side validation for title, amount, category, and expense date before persistence.
- Use parameterized SQL or ORM-mediated database access rather than string-concatenated SQL.
- Store only PRD-approved expense fields: title, amount, category, expense date, and optional description.
- Keep the MVP local/internal-only and single-user per CON-002.
- Return user-safe API errors without stack traces, SQL errors, secrets, or host internals.
- Treat security controls beyond PRD-NFR-001 as TBD under ARC-OQ-008.

The implementation must not:

- Store payment card numbers, bank account credentials, bank transaction data, user credentials, receipt files, or other sensitive payment data.
- Add user accounts, login, authorization roles, or identity-provider integration in the MVP.
- Expose the unauthenticated MVP as a public internet-facing application.
- Add accounting-provider-specific endpoints or credentials in the MVP.

### Security Controls

- **Authentication:** None for MVP per CON-003; public exposure is prohibited without future architecture review.
- **Authorization:** None for MVP per CON-003; single-user local/internal operation only.
- **Secrets Management:** TBD under ARC-OQ-008; MVP should avoid third-party secrets because no external integrations are included.
- **Encryption:** In transit and at rest requirements are TBD under ARC-OQ-008; local/internal-only scope does not remove the need to revisit controls for broader deployment.
- **Audit Logging:** TBD under ARC-OQ-008; PRD does not require audit logging.
- **Dependency/CVE Scanning:** TBD under ARC-OQ-009; at minimum, dependency choices must not knowingly include unresolved critical vulnerabilities (assumption).
- **SBOM:** TBD under ARC-OQ-009.

## 11. Reliability, Performance, and Scalability

### ARD-OPS-001 — Persistence Reliability

- **Target:** 100% of PRD-FR-009 acceptance scenarios pass during MVP acceptance testing; broader reliability target remains TBD under ARC-OQ-010.
- **Validation Method:** Create, edit, and delete known test expenses; refresh the browser and restart the application; confirm the latest saved state is displayed from SQLite.

### ARD-OPS-002 — Aggregate Correctness

- **Target:** 100% of KPI-003 known test datasets produce correct total and category-wise summary values for unfiltered and category-filtered views.
- **Validation Method:** Automated API tests and end-to-end dashboard tests compare displayed/API aggregate values to expected sums.

### ARD-OPS-003 — Performance Scope

- **Target:** No formal performance target is defined for the MVP per CON-008.
- **Validation Method:** Architecture review confirms no performance gate is claimed; any future performance target must be added through PRD and ARD update.

### ARD-OPS-004 — Scalability Scope

- **Target:** Single-user local/internal operation only per CON-002; no multi-user scalability target is defined.
- **Validation Method:** Architecture review confirms no multi-user concurrency or public deployment capability is represented as an MVP requirement.

## 12. Observability

- **Logging:** TBD under ARC-OQ-011; logs must not include sensitive payment data, credentials, stack traces in user-facing responses, or unnecessary expense descriptions in high-risk contexts (assumption).
- **Metrics:** TBD under ARC-OQ-011; PRD does not require operational metrics.
- **Tracing:** TBD under ARC-OQ-011; PRD does not require distributed tracing and the MVP has no external systems.
- **Alerting:** TBD under ARC-OQ-011; PRD does not require alerting for local/internal MVP.
- **Sensitive Data Restrictions:** Observability data must honor PRD-NFR-003 and exclude payment card numbers, bank account credentials, user credentials, receipt files, and bank transaction data.

## 13. Deployment Architecture

- **Environments:** Local development and internal MVP only.
- **Deployment Model:** Single local/internal host running React static assets, FastAPI backend, and SQLite database file.
- **CI/CD:** TBD under ARC-OQ-012; manual local/internal deployment is assumed until CI/CD is defined (assumption).
- **Configuration Management:** TBD under ARC-OQ-012; configuration must not introduce external service secrets for the MVP.
- **Rollback:** TBD under ARC-OQ-012; documented restart/restore procedure is assumed until formal rollback is defined (assumption).
- **Infrastructure as Code:** TBD under ARC-OQ-012; no infrastructure-as-code requirement is defined for the MVP.

## 14. Testing Architecture

Required test levels:

- Unit tests
- Integration tests
- Contract tests
- End-to-end tests
- Security tests
- Performance tests, where applicable

Minimum quality expectations:

- **Coverage Threshold:** TBD under ARC-OQ-009.
- **Blocking Security Severity:** TBD under ARC-OQ-009.
- **Required Build/Lint Checks:** TBD under ARC-OQ-009.

## 15. Architecture Constraints

- ARC-CON-001 — The company context is a small business in the financial-services industry.
- ARC-CON-002 — The MVP must remain local or internal-only and used by one person at a time.
- ARC-CON-003 — The MVP must not include user accounts, login, authentication, authorization, or role-based permissions.
- ARC-CON-004 — The frontend must use the REST API and must not access SQLite directly.
- ARC-CON-005 — Persistence must use a relational database, with SQLite selected for the MVP.
- ARC-CON-006 — Supported categories are limited to Food, Travel, Shopping, Bills, and Other.
- ARC-CON-007 — The dashboard is desktop-first; mobile-responsive optimization is out of scope.
- ARC-CON-008 — No formal performance requirement is defined for the MVP.
- ARC-CON-009 — The MVP must not store sensitive payment data, card data, account credentials, bank transaction data, receipt files, or user credentials.
- ARC-CON-010 — No external systems, accounting integrations, integration-specific endpoints, exports, budgets, recurring expenses, receipt uploads, or OCR are included in the MVP.
- ARC-CON-011 — Monetary values are stored and displayed with two decimal places in a single default currency; currency code and symbol remain TBD.
- ARC-CON-012 — Delete is permanent after frontend confirmation.

## 16. Risks and Trade-offs

| ID | Risk/Trade-off | Impact | Mitigation |
|---|---|---|---|
| ARC-RISK-001 | No authentication may expose expense data if the app is deployed outside a trusted local/internal environment | High | Enforce local/internal-only deployment constraint and require future architecture review before public exposure |
| ARC-RISK-002 | Floating-point amount storage can create rounding issues for financial reporting or future accounting integrations | Medium | Limit MVP to simple tracking and document future migration to integer minor units or decimal storage if precision requirements emerge |
| ARC-RISK-003 | Classification and retention are TBD | Medium | Resolve ARC-OQ-004 before production-like use or broader internal rollout |
| ARC-RISK-004 | Security controls beyond PRD-NFR-001 are TBD despite financial-services context | High | Resolve ARC-OQ-008 before deployment beyond local/internal MVP scope |
| ARC-RISK-005 | Testing gates, coverage, dependency scanning, and SBOM are TBD | Medium | Resolve ARC-OQ-009 before implementation completion or release approval |
| ARC-RISK-006 | Operational tooling is TBD | Medium | Resolve ARC-OQ-011 and ARC-OQ-012 before relying on the MVP for business-critical records |
| ARC-RISK-007 | Future accounting integrations may require API and data model changes | Medium | Keep REST contracts provider-neutral and avoid integration-specific schema fields in MVP |

## 17. Open Architecture Questions

| ID | Question | Owner | Status | Decision/Due Date |
|---|---|---|---|---|
| ARC-OQ-001 | What exact React, Python, FastAPI, and SQLite versions should be standardized? | Engineering Lead | Open | TBD |
| ARC-OQ-002 | What repository layout should be used for frontend, backend, domain, persistence, and deployment areas? | Engineering Lead | Open | TBD |
| ARC-OQ-003 | What default currency code and symbol should be used for amount display? | Product Owner | Open | TBD |
| ARC-OQ-004 | What expense data classification and retention policy should apply? | Product Owner | Open | TBD |
| ARC-OQ-005 | Should deployment remain process-based on a host or be packaged as containers with a SQLite volume? | Engineering Lead | Open | TBD |
| ARC-OQ-006 | What final REST versioning strategy and exact response status/body conventions should be used? | Engineering Lead | Open | TBD |
| ARC-OQ-007 | Should expense records include implementation-managed timestamps such as createdAt and updatedAt, or only PRD-defined fields? | Product Owner | Open | TBD |
| ARC-OQ-008 | What security controls beyond PRD-NFR-001 are required for secrets, encryption, audit logging, and network binding? | Security Reviewer | Open | TBD |
| ARC-OQ-009 | What testing gates, coverage threshold, blocking security severities, dependency/CVE scanning, and SBOM requirements should apply? | Engineering Lead | Open | TBD |
| ARC-OQ-010 | Is any reliability target required beyond PRD-FR-009 persistence acceptance testing? | Product Owner | Open | TBD |
| ARC-OQ-011 | What logging, metrics, tracing, and alerting level is required for the internal MVP? | Engineering Lead | Open | TBD |
| ARC-OQ-012 | What CI/CD, configuration management, rollback, backup, and infrastructure-as-code approach should be required? | Engineering Lead | Open | TBD |

## 18. Feature Mapping

| Feature | Relevant Components | Decision IDs | Interface IDs | Security IDs |
|---|---|---|---|---|
| FEAT-001 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-001, ARD-DEC-005 | ARD-API-001 | ARD-SEC-001 |
| FEAT-002 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-001 | ARD-API-001, ARD-API-002 | ARD-SEC-001 |
| FEAT-003 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-001, ARD-DEC-005 | ARD-API-002 | ARD-SEC-001 |
| FEAT-004 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-001 | ARD-API-002, ARD-API-003 | ARD-SEC-001 |
| FEAT-005 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-003, ARD-DEC-005 | ARD-API-001, ARD-API-003 | ARD-SEC-001 |
| FEAT-006 | COMP-001, COMP-002, COMP-003, COMP-004 | ARD-DEC-003, ARD-DEC-004 | ARD-API-003 | ARD-SEC-001 |
| FEAT-007 | COMP-002, COMP-003, COMP-004, COMP-005 | ARD-DEC-001, ARD-DEC-002, ARD-DEC-006 | ARD-API-001, ARD-API-002, ARD-API-003 | ARD-SEC-001 |

## 19. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Solution Architect | TBD | Pending | TBD |
| Security Reviewer | TBD | Pending | TBD |
| Engineering Lead | TBD | Pending | TBD |