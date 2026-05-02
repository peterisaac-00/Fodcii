# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle via `build.mjs`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/fodci run dev` — run frontend locally

## Artifacts

| Artifact | Dir | Port | Path |
|---|---|---|---|
| Fodci frontend | `artifacts/fodci` | 19469 | `/` |
| API server | `artifacts/api-server` | 8080 | `/api` |
| Mockup sandbox | `artifacts/mockup-sandbox` | 8082 | `/__mockup` |

## API Server Architecture (`artifacts/api-server`)

### Distributed Backend Infrastructure

All production-grade infrastructure is in `src/lib/` and `src/middleware/`:

| File | Purpose |
|---|---|
| `src/lib/job-queue.ts` | Generic `JobQueue<T>` — async FIFO, retry (exp backoff), dead-letter, configurable concurrency |
| `src/lib/submission-worker.ts` | Submission-specific queue singleton (concurrency=4). Processor: judge → update DB → record metrics → invalidate cache |
| `src/lib/cache.ts` | In-process TTL cache with tag-based invalidation. TTLs: problems 120s, detail 300s, leaderboard 30s |
| `src/lib/circuit-breaker.ts` | DB circuit breaker — opens after 5 failures, half-open after 10s |
| `src/middleware/rate-limit.ts` | `authRateLimit` (20/15min), `submitRateLimit` (15/min, keyed by userId), `readRateLimit` (300/min) |

### Async Submission Flow

1. `POST /api/code/submit` → creates PENDING row in DB → enqueues job → returns `{ submissionId, status: "pending", pollUrl }` in < 20ms (202 Accepted)
2. Worker processes job: runs judge engine → updates DB with results + testCasesJson
3. `GET /api/submissions/:id/status` → returns current status + full test case results when done
4. Frontend polls every 600ms until `isDone: true`

### Observability Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | DB ping + queue depth + cache stats + circuit breaker state |
| `GET /api/metrics` | Request throughput, success rate, avg response time |
| `GET /api/metrics/live` | Real-time: queue stats, cache hit rate, circuit breaker, uptime |
| `GET /api/security/report` | 7-test self-testing security suite |

### Submissions Schema (`lib/db/src/schema/submissions.ts`)

Added columns: `test_cases_json` (jsonb), `processed_at` (timestamp), `error_message` (text)
Status values: `pending` → `processing` → `accepted` | `wrong_answer` | `time_limit_exceeded` | `error`

### Services

| File | Purpose |
|---|---|
| `src/services/submission.service.ts` | `createPendingSubmission`, `updateSubmissionResult`, `getSubmissionById` |
| `src/services/problems.service.ts` | `listProblems`, `getProblemById`, `createProblem`, `recordSubmission` |

### Caching Strategy

- Problems list: 120s TTL, tag `problems`
- Problem detail: 300s TTL, tag `problems`
- Leaderboard: 60s TTL, tag `leaderboard`
- Cache invalidated by tag when an accepted submission is recorded
- `X-Cache: HIT/MISS` response header on all cached routes

## Docker

- `Dockerfile.api` — multi-stage build for API server
- `docker-compose.yml` — full stack: PostgreSQL + Redis + API + Frontend
- Redis is wired in docker-compose for future BullMQ upgrade (currently uses in-process queue)

## Auth

- bcrypt password hashing, JWT tokens (HS256), `optionalAuth` / `requireAuth` / `requireAdmin` middleware
- JWT secret from `JWT_SECRET` env var

## Judge Engine

- Real execution via `src/lib/executor.ts` (spawns python3 / node / g++)
- Problem test suites in `src/lib/judge.ts` (6 problems × 3 languages)
- Runs inside the API process at configurable concurrency (default: 4 workers)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
