import type { MemoryEntry } from '@/types';

export const memoryEntries: MemoryEntry[] = [
  {
    id: 'mem-1',
    concept: 'JWT Token Flow',
    category: 'Authentication',
    description:
      'The application uses a dual-token strategy: a short-lived access token (15-minute expiry) and a long-lived refresh token (7-day expiry, stored in an httpOnly cookie). Access tokens are signed with RS256 using a rotating key pair. Token refresh happens automatically via the middleware, which intercepts 401 responses and attempts a silent refresh before retrying the original request. The refresh token endpoint at /api/auth/refresh implements token rotation — each refresh invalidates the previous refresh token to prevent replay attacks. Currently only sarah.chen understands the complete token lifecycle including edge cases like concurrent refresh requests and token revocation on password change.',
    relatedFiles: [
      'src/lib/auth.ts',
      'src/utils/token.ts',
      'src/api/auth/refresh/route.ts',
      'src/middleware/auth.ts',
      'src/server/session.ts',
    ],
    relatedConcepts: [
      'Session Management',
      'Authentication Middleware',
      'OAuth Integration',
    ],
    confidence: 92,
    lastUpdated: '2025-01-14T09:00:00Z',
    source: 'agent-generated',
  },
  {
    id: 'mem-2',
    concept: 'Stripe Webhook Handler',
    category: 'Payment Processing',
    description:
      'Stripe webhooks are received at /api/payment/webhook and validated using the raw body with stripe.webhooks.constructEvent(). The handler processes 7 event types: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed, invoice.paid, invoice.payment_failed, charge.refunded, and charge.dispute.created. Each event type maps to a specific handler function in the payment event processor. Critical: the webhook endpoint must read the raw body before any middleware parses it, as Stripe signature verification requires the exact request body. The current implementation stores processed event IDs in Redis to prevent duplicate processing (idempotency), with a 24-hour TTL on the deduplication cache.',
    relatedFiles: [
      'src/api/payment/webhook/route.ts',
      'src/lib/payment/stripe.ts',
      'src/services/payment-service.ts',
      'src/utils/payment-helpers.ts',
    ],
    relatedConcepts: [
      'Payment Processing',
      'Database Migration Strategy',
      'Error Handling Pattern',
    ],
    confidence: 88,
    lastUpdated: '2025-01-13T14:30:00Z',
    source: 'auto-detected',
  },
  {
    id: 'mem-3',
    concept: 'Data Pipeline Orchestration',
    category: 'Data Engineering',
    description:
      'The analytics data pipeline runs on Apache Airflow with 5 DAGs: (1) nightly-product-sync — pulls product catalog changes from the main database at 2 AM UTC, (2) hourly-events-ingestion — consumes Kafka topics for user events and writes to the data warehouse, (3) daily-revenue-aggregation — computes revenue metrics by product, region, and channel, (4) weekly-customer-segments — runs a Python segmentation model using RFM analysis, (5) monthly-model-retraining — retrains the product recommendation model and deploys updated weights to the inference endpoint. All DAGs use Airflow\'s KubernetesPodOperator for isolation. Failure alerts go to the #data-pipeline Slack channel.',
    relatedFiles: [
      'dags/nightly_product_sync.py',
      'dags/hourly_events_ingestion.py',
      'dags/daily_revenue_aggregation.py',
      'dags/weekly_customer_segments.py',
      'dags/monthly_model_retraining.py',
    ],
    relatedConcepts: [
      'Database Migration Strategy',
      'Caching Strategy',
      'API Rate Limiting',
    ],
    confidence: 85,
    lastUpdated: '2025-01-12T18:00:00Z',
    source: 'user-contributed',
  },
  {
    id: 'mem-4',
    concept: 'API Rate Limiting',
    category: 'Infrastructure',
    description:
      'Rate limiting is implemented at two levels: (1) Nginx reverse proxy applies a global rate limit of 100 requests/second per IP address using the limit_req module with a burst allowance of 20 requests, (2) Application-level rate limiting via a custom middleware uses Redis sliding window counters for per-user and per-endpoint limits. The checkout endpoint has a stricter limit of 5 requests/minute per user to prevent accidental double-purchases. Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) are included in all API responses. When a client exceeds the limit, a 429 status is returned with a Retry-After header.',
    relatedFiles: [
      'src/middleware/rate-limit.ts',
      'deploy/nginx.conf',
      'src/lib/redis.ts',
    ],
    relatedConcepts: [
      'Caching Strategy',
      'Authentication Middleware',
      'Error Handling Pattern',
    ],
    confidence: 78,
    lastUpdated: '2025-01-11T10:15:00Z',
    source: 'auto-detected',
  },
  {
    id: 'mem-5',
    concept: 'Database Migration Strategy',
    category: 'Database',
    description:
      'Schema migrations are managed with Prisma Migrate. The migration workflow requires: (1) make schema changes in schema.prisma, (2) run prisma migrate dev --name descriptive-name to generate and apply migration locally, (3) run prisma generate to update the client, (4) test with existing seed data, (5) commit the migration SQL file and schema changes together. Production deployments use prisma migrate deploy which applies pending migrations non-interactively. Critical: backward-incompatible schema changes must be done in two-phase migrations — first add the new column/table alongside the old one, deploy and verify, then remove the old one in a separate migration. The database has a single primary with two read replicas; migrations run only on the primary.',
    relatedFiles: [
      'prisma/schema.prisma',
      'src/lib/db.ts',
      'src/scripts/seed.ts',
    ],
    relatedConcepts: [
      'Stripe Webhook Handler',
      'Data Pipeline Orchestration',
      'Error Handling Pattern',
    ],
    confidence: 91,
    lastUpdated: '2025-01-10T22:00:00Z',
    source: 'agent-generated',
  },
  {
    id: 'mem-6',
    concept: 'Error Handling Pattern',
    category: 'Architecture',
    description:
      'The application uses a layered error handling strategy: (1) Domain-specific errors extend a custom AppError class with error codes, HTTP status mappings, and structured context, (2) API route handlers wrap logic in try-catch blocks that delegate to a central handleError() function, (3) The central handler logs the error with correlation ID, determines the appropriate HTTP response, and strips internal details from client-facing messages, (4) Unhandled errors at the Next.js level are caught by a global error boundary and reported to Sentry via the sentry.client.config.ts integration. Error codes follow the format MODULE-ACTION-SEQUENCE (e.g., AUTH-LOGIN-001 for login failures, PAY-CAPTURE-003 for payment capture errors).',
    relatedFiles: [
      'src/lib/errors.ts',
      'src/middleware/error-handler.ts',
      'src/utils/handle-error.ts',
      'sentry.client.config.ts',
    ],
    relatedConcepts: [
      'API Rate Limiting',
      'Authentication Middleware',
      'Database Migration Strategy',
    ],
    confidence: 82,
    lastUpdated: '2025-01-09T16:45:00Z',
    source: 'auto-detected',
  },
  {
    id: 'mem-7',
    concept: 'Caching Strategy',
    category: 'Infrastructure',
    description:
      'Multi-layer caching approach: (1) CDN layer (CloudFront) caches static assets and pre-rendered product pages with a 5-minute TTL, (2) Redis cache layer stores product catalog data (15-minute TTL), user session data (7-day TTL matching refresh token), and API response caches (variable TTL per endpoint), (3) Next.js ISR (Incremental Static Regeneration) revalidates product pages every 60 seconds on-demand, (4) Client-side TanStack Query with staleTime: 5 minutes and cacheTime: 30 minutes for product and cart data. Cache invalidation for product updates uses a Redis pub/sub channel — when a product is modified via the admin dashboard, a PUBLISH event triggers cache purging across all CDN edge locations and Redis instances.',
    relatedFiles: [
      'src/lib/redis.ts',
      'src/lib/cache.ts',
      'src/config/cache.config.ts',
      'src/middleware/revalidate.ts',
    ],
    relatedConcepts: [
      'Data Pipeline Orchestration',
      'API Rate Limiting',
      'Database Migration Strategy',
    ],
    confidence: 86,
    lastUpdated: '2025-01-08T12:30:00Z',
    source: 'user-contributed',
  },
  {
    id: 'mem-8',
    concept: 'Authentication Middleware',
    category: 'Authentication',
    description:
      'Next.js middleware (src/middleware/auth.ts) runs on every request to /api/* and /dashboard/* routes. It extracts the JWT from the Authorization header (or falls back to the httpOnly cookie for browser requests), validates the token signature using the public key, checks the token expiry, and enriches the request with a decoded user object including userId, email, roles, and permissions. The middleware also handles automatic token refresh: if the access token is expired but a valid refresh token cookie exists, it proxies the request to /api/auth/refresh, swaps in the new token, and retries the original request transparently. Role-based route protection is configured via a matcher map that maps route patterns to required permission arrays.',
    relatedFiles: [
      'src/middleware/auth.ts',
      'src/utils/token.ts',
      'src/utils/permissions.ts',
      'src/lib/auth.ts',
      'src/components/auth/AuthGuard.tsx',
    ],
    relatedConcepts: [
      'JWT Token Flow',
      'OAuth Integration',
      'Error Handling Pattern',
    ],
    confidence: 89,
    lastUpdated: '2025-01-14T09:30:00Z',
    source: 'agent-generated',
  },
];
