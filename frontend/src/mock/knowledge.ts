import type { KnowledgeGraphNode, KnowledgeGraphEdge } from '@/types';

export const knowledgeGraphNodes: KnowledgeGraphNode[] = [
  {
    id: 'kg-auth',
    label: 'Authentication',
    category: 'Security',
    weight: 95,
    description:
      'The process of verifying user identity. This codebase implements JWT-based authentication with OAuth provider support (Google, GitHub). The system is critically underdocumented with 12 involved files and zero documentation, making it the highest-risk knowledge area.',
  },
  {
    id: 'kg-authorization',
    label: 'Authorization',
    category: 'Security',
    weight: 80,
    description:
      'Determining what actions an authenticated user is permitted to perform. Implemented via a role-based access control (RBAC) matrix embedded in middleware and component-level guards. Roles include admin, editor, viewer, and custom permission sets.',
  },
  {
    id: 'kg-jwt',
    label: 'JWT',
    category: 'Security',
    weight: 90,
    description:
      'JSON Web Tokens used for stateless authentication. The codebase uses a dual-token pattern: short-lived RS256-signed access tokens (15-min expiry) and long-lived refresh tokens (7-day expiry, httpOnly cookie). Token rotation is implemented on refresh to prevent replay attacks.',
  },
  {
    id: 'kg-sessions',
    label: 'Sessions',
    category: 'Security',
    weight: 70,
    description:
      'Session management layer bridging JWT tokens with Redis-backed session storage. Session data includes user preferences, cart reference (for anonymous→authenticated merge), and recent activity. Sessions are invalidated on password change and security events.',
  },
  {
    id: 'kg-oauth',
    label: 'OAuth',
    category: 'Security',
    weight: 75,
    description:
      'OAuth 2.0 integration with Google and GitHub identity providers. Uses the authorization code flow with PKCE. Provider configuration is stored in environment variables. Callback handling includes account linking for users who sign in with multiple providers.',
  },
  {
    id: 'kg-api-design',
    label: 'API Design',
    category: 'Architecture',
    weight: 85,
    description:
      'RESTful API design principles applied across the Next.js API routes layer. All endpoints follow consistent patterns: Zod validation, standardized error responses, pagination, and HATEOAS-style linking. Rate limiting and authentication guards are applied at the gateway level.',
  },
  {
    id: 'kg-rest',
    label: 'REST',
    category: 'Architecture',
    weight: 78,
    description:
      'REST architecture style governing all HTTP API endpoints. Follows resource-oriented URL patterns (e.g., /api/v1/products/:id, /api/v1/orders/:id/status). Uses standard HTTP methods (GET, POST, PUT, PATCH, DELETE) with appropriate status codes and Content-Type negotiation.',
  },
  {
    id: 'kg-graphql',
    label: 'GraphQL',
    category: 'Architecture',
    weight: 35,
    description:
      'GraphQL API layer planned but not yet implemented. A schema-first design exists in /docs/graphql-schema.md as a proposal for the v2 API. The admin dashboard currently uses REST; GraphQL was considered to reduce over-fetching for complex dashboard queries.',
  },
  {
    id: 'kg-database',
    label: 'Database',
    category: 'Data',
    weight: 88,
    description:
      'PostgreSQL database with Prisma ORM as the primary data store. Schema includes 24 models covering users, products, orders, payments, and analytics. The database uses a single writer and two read replicas. Migration strategy follows Prisma Migrate with two-phase changes for backward incompatibility.',
  },
  {
    id: 'kg-orm',
    label: 'ORM',
    category: 'Data',
    weight: 82,
    description:
      'Prisma ORM providing type-safe database access, automatic query building, and migration management. Custom Prisma extensions handle soft deletes, audit logging, and multi-tenant data isolation. The schema is the single source of truth for the data model.',
  },
  {
    id: 'kg-caching',
    label: 'Caching',
    category: 'Infrastructure',
    weight: 76,
    description:
      'Multi-layer caching strategy: CDN (CloudFront) for static assets, Redis for API responses and session data, Next.js ISR for product pages, and client-side TanStack Query for local state. Cache invalidation uses Redis pub/sub to coordinate purges across layers.',
  },
  {
    id: 'kg-middleware',
    label: 'Middleware',
    category: 'Architecture',
    weight: 83,
    description:
      'Next.js middleware layer handling cross-cutting concerns: authentication token validation, rate limiting, error handling, request logging, CORS enforcement, and locale detection. Middleware runs on the Edge Runtime for low-latency request interception.',
  },
];

export const knowledgeGraphEdges: KnowledgeGraphEdge[] = [
  // Authentication relationships
  {
    id: 'kge-auth-authz',
    source: 'kg-auth',
    target: 'kg-authorization',
    relationType: 'enables',
    weight: 0.9,
  },
  {
    id: 'kge-auth-jwt',
    source: 'kg-auth',
    target: 'kg-jwt',
    relationType: 'implements-with',
    weight: 0.95,
  },
  {
    id: 'kge-auth-session',
    source: 'kg-auth',
    target: 'kg-sessions',
    relationType: 'manages',
    weight: 0.7,
  },
  {
    id: 'kge-auth-oauth',
    source: 'kg-auth',
    target: 'kg-oauth',
    relationType: 'integrates',
    weight: 0.8,
  },
  {
    id: 'kge-auth-middleware',
    source: 'kg-auth',
    target: 'kg-middleware',
    relationType: 'enforced-by',
    weight: 0.85,
  },
  {
    id: 'kge-jwt-session',
    source: 'kg-jwt',
    target: 'kg-sessions',
    relationType: 'stores-in',
    weight: 0.75,
  },

  // Authorization relationships
  {
    id: 'kge-authz-middleware',
    source: 'kg-authorization',
    target: 'kg-middleware',
    relationType: 'enforced-by',
    weight: 0.8,
  },
  {
    id: 'kge-authz-api',
    source: 'kg-authorization',
    target: 'kg-api-design',
    relationType: 'scoped-by',
    weight: 0.7,
  },

  // OAuth relationships
  {
    id: 'kge-oauth-jwt',
    source: 'kg-oauth',
    target: 'kg-jwt',
    relationType: 'issues',
    weight: 0.85,
  },

  // API relationships
  {
    id: 'kge-api-rest',
    source: 'kg-api-design',
    target: 'kg-rest',
    relationType: 'follows',
    weight: 0.9,
  },
  {
    id: 'kge-api-graphql',
    source: 'kg-api-design',
    target: 'kg-graphql',
    relationType: 'planned-migration',
    weight: 0.3,
  },
  {
    id: 'kge-api-middleware',
    source: 'kg-api-design',
    target: 'kg-middleware',
    relationType: 'protected-by',
    weight: 0.8,
  },
  {
    id: 'kge-rest-middleware',
    source: 'kg-rest',
    target: 'kg-middleware',
    relationType: 'routed-through',
    weight: 0.75,
  },

  // Data relationships
  {
    id: 'kge-db-orm',
    source: 'kg-database',
    target: 'kg-orm',
    relationType: 'accessed-via',
    weight: 0.95,
  },
  {
    id: 'kge-orm-api',
    source: 'kg-orm',
    target: 'kg-api-design',
    relationType: 'powers',
    weight: 0.7,
  },
  {
    id: 'kge-cache-db',
    source: 'kg-caching',
    target: 'kg-database',
    relationType: 'caches-data-from',
    weight: 0.8,
  },
  {
    id: 'kge-session-cache',
    source: 'kg-sessions',
    target: 'kg-caching',
    relationType: 'stored-in',
    weight: 0.85,
  },
];
