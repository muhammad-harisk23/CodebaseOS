// Mock data for Knowledge Interview page

interface InterviewQuestion {
  id: string;
  text: string;
  context: string;
  module: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  expectedTopics: string[];
  followUps: string[];
}

interface ScoringCategory {
  id: string;
  label: string;
  score: number;
  max: number;
  questions: number;
  strengths: string[];
  gaps: string[];
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'q-1',
    text: 'How does JWT authentication work in this codebase?',
    context:
      'The platform uses JWT for stateless authentication. Tokens are issued on login and attached to API requests. Understanding the full lifecycle — from login to token refresh to logout — is essential for anyone working on the platform.',
    module: 'Authentication',
    difficulty: 'foundational',
    expectedTopics: [
      'JWT token generation with HS256 signing',
      'Token storage in HTTP-only cookies vs localStorage',
      'Token verification in middleware',
      'Access token vs refresh token pattern',
      'Token expiry and refresh flow',
    ],
    followUps: [
      'Where exactly is the JWT secret configured and how is it rotated?',
      'What happens when a refresh token is also expired?',
      'How does the middleware decide which routes require authentication?',
    ],
  },
  {
    id: 'q-2',
    text: 'Where is the JWT token generated and validated?',
    context:
      'The authentication module spans multiple files including the login route handler, JWT utility library, and Next.js middleware. Tracing the exact token flow from generation to consumption is a key test of codebase navigation ability.',
    module: 'Authentication',
    difficulty: 'intermediate',
    expectedTopics: [
      'src/lib/auth/jwt.ts — generateToken() and verifyToken() functions',
      'src/app/api/auth/login/route.ts — token generation on successful login',
      'src/middleware.ts — token verification before protected routes',
      'Token payload structure including userId and role fields',
      'Error handling for expired and malformed tokens',
    ],
    followUps: [
      'How are token errors surfaced to the client?',
      'What logging or monitoring exists around token validation failures?',
      'How does this interact with NextAuth.js sessions?',
    ],
  },
  {
    id: 'q-3',
    text: 'How is role-based authorization implemented?',
    context:
      'The platform supports three user roles: admin, customer, and vendor. Authorization is enforced at the route level and within business logic. Understanding the role system is critical for implementing new features securely.',
    module: 'Security',
    difficulty: 'intermediate',
    expectedTopics: [
      'Role field in the User Mongoose schema',
      'Role extraction from verified JWT payload',
      'Route-level role guards in middleware',
      'Function-level authorization checks in service layer',
      'Admin-only route protection patterns',
    ],
    followUps: [
      'Can a user have multiple roles simultaneously?',
      'How are vendor-specific permissions scoped to their own products?',
      'What happens if the role in the token differs from the database?',
    ],
  },
  {
    id: 'q-4',
    text: 'How does the Stripe payment processing flow work?',
    context:
      'Payments are the revenue-critical path of the platform. The Stripe integration handles one-time payments, subscriptions, refunds, and webhook notifications. A failure in understanding this flow could lead to data inconsistencies or revenue loss.',
    module: 'Payments',
    difficulty: 'foundational',
    expectedTopics: [
      'Stripe checkout session creation in src/lib/stripe/checkout-session.ts',
      'Line items, tax calculation, and discount code application',
      'Success and cancel URL routing after payment',
      'Payment intent status tracking in the Order model',
      'Idempotency keys for preventing duplicate charges',
    ],
    followUps: [
      'How are partial refunds handled?',
      'What happens if a customer closes the browser during payment?',
      'How is the payment status synchronized between Stripe and the database?',
    ],
  },
  {
    id: 'q-5',
    text: 'What happens when a Stripe webhook is received?',
    context:
      'Stripe webhooks are the source of truth for asynchronous payment events. The webhook handler must be idempotent, handle retries correctly, and update the order state machine. Misunderstanding this can lead to fulfillment errors.',
    module: 'Payments',
    difficulty: 'advanced',
    expectedTopics: [
      'Webhook endpoint at src/app/api/stripe/webhooks/route.ts',
      'Stripe webhook signature verification for security',
      'Handling payment_intent.succeeded, charge.failed, and subscription events',
      'Idempotency handling using Stripe event IDs',
      'Order state machine transitions triggered by webhook events',
      'Error handling and retry logic for failed webhook processing',
    ],
    followUps: [
      'How does the system handle out-of-order webhook delivery?',
      'What happens if the same webhook is received twice?',
      'How are webhook processing failures monitored and alerted?',
    ],
  },
  {
    id: 'q-6',
    text: 'How are database entities and relationships structured?',
    context:
      'The MongoDB schema design uses Mongoose with 23 entities spanning users, products, orders, carts, reviews, and more. Understanding entity relationships is essential for building new features and debugging data issues.',
    module: 'Database',
    difficulty: 'intermediate',
    expectedTopics: [
      'Mongoose schema definitions in src/lib/db/models/',
      'User, Product, Order, Cart, and Review entity relationships',
      'Referencing vs embedding strategy for different entity pairs',
      'Mongoose virtual fields and computed properties',
      'Index definitions for query optimization',
      'Schema middleware (pre/post hooks) for data validation',
    ],
    followUps: [
      'Why was MongoDB chosen over a relational database for this schema?',
      'How are migrations handled when the schema changes?',
      'What are the most common query performance issues?',
    ],
  },
  {
    id: 'q-7',
    text: 'Describe the API gateway and middleware pipeline',
    context:
      'All API requests flow through the Next.js middleware pipeline which handles authentication, rate limiting, request logging, and CORS. Understanding this pipeline is critical for debugging request failures and adding new middleware.',
    module: 'Architecture',
    difficulty: 'advanced',
    expectedTopics: [
      'src/middleware.ts as the single entry point for API routes',
      'JWT validation step and token extraction',
      'Rate limiting implementation with Redis-backed counters',
      'Request/response logging with correlation IDs',
      'CORS configuration for cross-origin API access',
      'Route matching patterns and middleware execution order',
      'tRPC integration alongside REST API routes',
    ],
    followUps: [
      'How is rate limiting configured differently for authenticated vs unauthenticated users?',
      'What happens when the Redis connection for rate limiting fails?',
      'How are tRPC calls authenticated differently from REST calls?',
    ],
  },
  {
    id: 'q-8',
    text: 'How does the caching layer work across the application?',
    context:
      'The application uses Redis as a distributed cache with a cache-aside pattern. Caching is applied to product listings, user sessions, and frequently accessed configuration. Cache invalidation strategy is critical for data consistency.',
    module: 'Infrastructure',
    difficulty: 'advanced',
    expectedTopics: [
      'Redis client configuration in src/lib/cache/redis-client.ts',
      'Cache-aside pattern implementation with TTL-based expiry',
      'Product listing cache with invalidation on catalog updates',
      'Session storage in Redis for server-side session management',
      'Cache key naming conventions and namespacing strategy',
      'Graceful degradation when Redis is unavailable',
      'Cache warming strategy on application startup',
    ],
    followUps: [
      'What is the cache hit ratio and how is it monitored?',
      'How does cache invalidation work for product price updates?',
      'What happens to user sessions during a Redis failover?',
    ],
  },
];

export const interviewScoring: ScoringCategory[] = [
  {
    id: 'scoring-1',
    label: 'Authentication',
    score: 72,
    max: 100,
    questions: 2,
    strengths: [
      'Solid understanding of JWT lifecycle and token generation flow',
      'Can locate and explain the middleware-based route protection mechanism',
    ],
    gaps: [
      'Unclear on refresh token rotation and edge case handling',
      'Limited knowledge of NextAuth.js integration with custom JWT logic',
    ],
  },
  {
    id: 'scoring-2',
    label: 'Database',
    score: 58,
    max: 100,
    questions: 1,
    strengths: [
      'Identifies core entities and their Mongoose schema definitions',
      'Understands basic referencing vs embedding patterns',
    ],
    gaps: [
      'Uncertain about schema migration strategies',
      'Missing knowledge of query optimization and index usage patterns',
      'Not aware of Mongoose middleware hooks used for data validation',
    ],
  },
  {
    id: 'scoring-3',
    label: 'Security',
    score: 45,
    max: 100,
    questions: 1,
    strengths: [
      'Understands the basic concept of role-based access control',
    ],
    gaps: [
      'Cannot explain how roles are enforced at both route and function levels',
      'Unaware of vendor permission scoping to own resources',
      'No knowledge of token-to-database role consistency checks',
    ],
  },
  {
    id: 'scoring-4',
    label: 'Architecture',
    score: 63,
    max: 100,
    questions: 1,
    strengths: [
      'Understands the middleware pipeline execution order',
      'Can describe the relationship between REST and tRPC routes',
    ],
    gaps: [
      'Unclear on Redis failover behavior for rate limiting',
      'Limited understanding of correlation ID propagation across services',
      'Not familiar with tRPC type-safety benefits in the middleware context',
    ],
  },
  {
    id: 'scoring-5',
    label: 'Business Logic',
    score: 52,
    max: 100,
    questions: 2,
    strengths: [
      'Understands the basic Stripe checkout session creation flow',
      'Knows that webhooks are used for asynchronous payment events',
    ],
    gaps: [
      'Cannot explain idempotency handling for webhooks',
      'Unaware of order state machine transitions',
      'Missing knowledge of out-of-order webhook delivery handling',
      'Limited understanding of partial refund business rules',
    ],
  },
  {
    id: 'scoring-6',
    label: 'Infrastructure',
    score: 38,
    max: 100,
    questions: 1,
    strengths: [
      'Knows that Redis is used for caching',
    ],
    gaps: [
      'Cannot explain the cache-aside pattern implementation',
      'Unaware of cache key namespacing and invalidation strategies',
      'No knowledge of graceful degradation when Redis is unavailable',
      'Missing understanding of cache warming on startup',
      'Unfamiliar with cache hit ratio monitoring',
    ],
  },
];