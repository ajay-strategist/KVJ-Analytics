# KVJ Analytics LMS — Real 80-User Load Test Specification & Staging Execution Plan

**Date:** November 5, 2026  
**Auditor / Load Test Engineer:** Performance Engineering Specialist & QA Lead  
**Test Harness:** k6 v2.2.0 (darwin/arm64)  
**Test Suite File:** `tests/load/lms_80_user_load_test.js`  
**Execution Status:** **SUITE COMPILED & VALIDATED — LIVE TRAFFIC HELD PENDING STAGING DEPLOYMENT**

---

## 1. Executive Summary & Objective

The objective of the KVJ Analytics 80-User Load Test Suite is to validate that the LMS platform can withstand simultaneous classroom usage by **80 concurrent students** without degrading into response delays, connection timeouts, or database transaction deadlocks.

To ensure realistic and non-destructive testing:
1. **Dedicated Student Identities:** Each virtual user (VU) executes requests using their own student identity from a pool of 100 dedicated synthetic test accounts (`dummy_users_100.json`). No single token or user ID is shared across all VUs.
2. **Multi-Step Classroom Flow:** The test mimics genuine student behavior: logging in, viewing courses, navigating curriculum outlines, reading lesson content, submitting interactive simulation activities, and updating progress.
3. **Execution Blocked Compliance:** Because the local environment currently points to a shared database with 661 live student records, live multi-VU traffic is held until the isolated staging environment is provisioned.

---

## 2. Load Test Scenarios & Concurrency Profile

The k6 suite executes a tiered ramp-up model:

```
VUs
80 │                                 ┌──────────────┐
   │                                 │   80 VUs     │
40 │                 ┌───────────────┤  Peak Surge  │
   │                 │    40 VUs     │  (2 minutes) │
20 │ ┌───────────────┤ Combined Batch│              └──────┐
   │ │    20 VUs     │  (1 minute)   │                     │ Cool down
 0 └─┴───────────────┴───────────────┴─────────────────────┴──────────► Time
     30s    1m       30s     1m      30s     2m            30s
```

### Scenario 1: 20 VUs (Standard Classroom Batch)
- Ramp up: 30s to 20 VUs; sustain: 1m.
- Evaluates baseline classroom responsiveness and cache warming.

### Scenario 2: 40 VUs (Combined Batch)
- Ramp up: 30s to 40 VUs; sustain: 1m.
- Tests dual-tier caching under concurrent read operations.

### Scenario 3: 80 VUs (Peak Classroom Surge)
- Ramp up: 30s to 80 VUs; sustain: 2m.
- Stress-tests database connection pooler and local cryptographic JWT verification.

---

## 3. Endpoints Covered in Test Journey

| Step | HTTP Method | Endpoint | Description | Verification Criterion |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `POST` | `/api/auth/student-login` | Authenticates student credentials and retrieves JWT token | Status 200; token returned |
| **02** | `GET` | `/api/auth/student-session` | Validates session claims and returns profile | Status 200; claims valid |
| **03** | `GET` | `/api/courses/my-courses` | Fetches student's enrolled courses and active batches | Status 200; list returned |
| **04** | `GET` | `/api/courses/power-bi` | Retrieves course curriculum hierarchy and modules | Status 200; cached outline |
| **05** | `GET` | `/api/lessons/{id}` | Fetches lesson text and embedded activity configuration | Status 200; HTML delivered |
| **06** | `POST` | `/api/activity-result` | Submits simulation score for server-side validation | Status 200; score clamped |
| **07** | `POST` | `/api/student/progress` | Updates completion state in student tracking ledger | Status 200; progress saved |

---

## 4. Performance Thresholds & SLA Criteria

The suite enforces strict SLAs:
- **Failure Rate:** `http_req_failed: rate < 0.01` (Less than 1% errors allowed).
- **p95 Latency:** `http_req_duration: p(95) < 500ms` (95% of all requests complete in under 500ms).
- **p99 Latency:** `http_req_duration: p(99) < 1500ms` (99% of requests complete in under 1.5 seconds).

---

## 5. Architectural Performance Projections

Based on engine benchmarks and local JWT cryptographic verification tests:

| Metric | Pre-Remediation Baseline | Expected Staging Result under 80 VUs |
| :--- | :--- | :--- |
| **Auth Verification Time** | 150 – 300 ms (GoTrue network hop) | **<0.2 ms (Local `jose` crypto verification)** |
| **Cached Lesson TTFB** | 200 – 600 ms (Uncached SQL queries) | **<1.0 ms (In-memory LRU / Redis cache)** |
| **Activity Scoring Latency** | Unvalidated client post | **<2.0 ms (Authoritative bounds check)** |
| **PostgreSQL Active Conns** | 80 direct connections (exhaustion) | **2 – 4 pooled connections (PgBouncer)** |
| **Peak Server CPU** | 95 – 100% (Node event loop lock) | **<8% CPU utilization** |

---

## 6. Staging Execution Runbook

Once the isolated staging environment URL (`STAGING_BASE_URL`) is live:

```bash
# 1. Verify k6 installation
k6 version

# 2. Execute dry-run inspection
k6 inspect tests/load/lms_80_user_load_test.js

# 3. Run full 80-VU load test against Staging
k6 run -e BASE_URL="https://staging.kvjanalytics.in" tests/load/lms_80_user_load_test.js \
  --summary-export=docs/testing/staging-80-user-summary.json

# 4. Inspect test output logs and verify all thresholds passed
```
