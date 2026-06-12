import type { ArchitectureNode, ArchitectureEdge } from '@/types';

export const architectureNodes: ArchitectureNode[] = [
  {
    id: 'arch-cdn',
    label: 'CDN (CloudFront)',
    type: 'external',
    description:
      'Amazon CloudFront CDN distributing static assets, pre-rendered product pages, and media files. Configured with 5-minute TTL for product pages and custom cache invalidation via Redis pub/sub triggers on product updates.',
    files: ['deploy/cloudfront.tf', 'src/middleware/revalidate.ts'],
    complexity: 3,
    connections: 2,
  },
  {
    id: 'arch-frontend',
    label: 'Frontend App (Next.js)',
    type: 'component',
    description:
      'Next.js 14 application with App Router, Server Components for product pages, and Client Components for interactive features (cart, search, filters). Uses TanStack Query for server state management and a custom design system built on Radix UI primitives.',
    files: [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/components/',
      'src/hooks/',
    ],
    complexity: 7,
    connections: 4,
  },
  {
    id: 'arch-api-gateway',
    label: 'API Gateway',
    type: 'service',
    description:
      'Central API routing layer implemented as Next.js API routes. Handles request validation with Zod schemas, rate limiting via Redis sliding windows, CORS configuration, and request/response transformation. All client requests flow through this layer before reaching business logic.',
    files: [
      'src/app/api/',
      'src/middleware/rate-limit.ts',
      'src/middleware/error-handler.ts',
    ],
    complexity: 6,
    connections: 6,
  },
  {
    id: 'arch-auth-service',
    label: 'Auth Service',
    type: 'service',
    description:
      'Authentication and authorization service handling JWT lifecycle, OAuth provider callbacks (Google, GitHub), session management, role-based access control, and MFA enrollment. The highest-risk module with a bus factor of 1 and zero documentation.',
    files: [
      'src/lib/auth.ts',
      'src/api/auth/',
      'src/middleware/auth.ts',
      'src/utils/token.ts',
      'src/utils/permissions.ts',
      'src/server/session.ts',
    ],
    complexity: 9,
    connections: 4,
  },
  {
    id: 'arch-product-service',
    label: 'Product Service',
    type: 'service',
    description:
      'Product catalog management including CRUD operations, variant handling, category tree management, search indexing via Meilisearch, and product image processing. Serves both the customer storefront and admin dashboard with different projection models.',
    files: [
      'src/services/product-service.ts',
      'src/api/products/',
      'src/lib/search.ts',
    ],
    complexity: 6,
    connections: 5,
  },
  {
    id: 'arch-cart-service',
    label: 'Cart Service',
    type: 'service',
    description:
      'Shopping cart management with support for anonymous carts (stored in Redis), authenticated carts (persisted in PostgreSQL), cart merging on login, and real-time price recalculation. Implements optimistic locking for concurrent cart modifications.',
    files: [
      'src/services/cart-service.ts',
      'src/api/cart/',
      'src/lib/cart-pricing.ts',
    ],
    complexity: 5,
    connections: 4,
  },
  {
    id: 'arch-order-service',
    label: 'Order Service',
    type: 'service',
    description:
      'Order lifecycle management from creation through fulfillment. Handles order placement with inventory reservation, status transitions (pending → confirmed → shipped → delivered), partial fulfillment, and order history queries. Emits events for downstream services.',
    files: [
      'src/services/order-service.ts',
      'src/api/orders/',
      'src/lib/order-validation.ts',
    ],
    complexity: 7,
    connections: 5,
  },
  {
    id: 'arch-payment-service',
    label: 'Payment Service',
    type: 'service',
    description:
      'Stripe integration handling checkout session creation, webhook processing, payment intent management, refund processing, and subscription billing. Only 7% test coverage. Second highest-risk module with a bus factor of 1.',
    files: [
      'src/lib/payment/stripe.ts',
      'src/api/payment/',
      'src/services/payment-service.ts',
      'src/utils/payment-helpers.ts',
    ],
    complexity: 8,
    connections: 5,
  },
  {
    id: 'arch-database',
    label: 'Database (PostgreSQL)',
    type: 'data',
    description:
      'Primary PostgreSQL database managed via Prisma ORM with a single writer and two read replicas. Stores users, products, orders, payments, and analytics data. Schema migrations use Prisma Migrate with a two-phase strategy for backward-incompatible changes.',
    files: [
      'prisma/schema.prisma',
      'src/lib/db.ts',
      'src/scripts/seed.ts',
    ],
    complexity: 7,
    connections: 7,
  },
  {
    id: 'arch-cache',
    label: 'Cache Layer (Redis)',
    type: 'data',
    description:
      'Redis cluster serving as session store, product catalog cache (15-min TTL), API response cache, rate limiter state, and pub/sub channel for cache invalidation events. Also stores anonymous cart data and webhook event deduplication records.',
    files: [
      'src/lib/redis.ts',
      'src/lib/cache.ts',
      'src/config/cache.config.ts',
    ],
    complexity: 5,
    connections: 6,
  },
];

export const architectureEdges: ArchitectureEdge[] = [
  // CDN connections
  {
    id: 'edge-cdn-frontend',
    source: 'arch-cdn',
    target: 'arch-frontend',
    type: 'dependency',
    strength: 'strong',
  },
  {
    id: 'edge-cdn-cache',
    source: 'arch-cdn',
    target: 'arch-cache',
    type: 'event',
    strength: 'medium',
  },

  // Frontend connections
  {
    id: 'edge-frontend-gateway',
    source: 'arch-frontend',
    target: 'arch-api-gateway',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-frontend-cdn',
    source: 'arch-frontend',
    target: 'arch-cdn',
    type: 'data-flow',
    strength: 'medium',
  },
  {
    id: 'edge-frontend-auth',
    source: 'arch-frontend',
    target: 'arch-auth-service',
    type: 'api-call',
    strength: 'strong',
  },

  // API Gateway connections
  {
    id: 'edge-gateway-auth',
    source: 'arch-api-gateway',
    target: 'arch-auth-service',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-gateway-product',
    source: 'arch-api-gateway',
    target: 'arch-product-service',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-gateway-cart',
    source: 'arch-api-gateway',
    target: 'arch-cart-service',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-gateway-order',
    source: 'arch-api-gateway',
    target: 'arch-order-service',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-gateway-payment',
    source: 'arch-api-gateway',
    target: 'arch-payment-service',
    type: 'api-call',
    strength: 'strong',
  },
  {
    id: 'edge-gateway-cache',
    source: 'arch-api-gateway',
    target: 'arch-cache',
    type: 'api-call',
    strength: 'medium',
  },

  // Service to Database connections
  {
    id: 'edge-auth-db',
    source: 'arch-auth-service',
    target: 'arch-database',
    type: 'data-flow',
    strength: 'strong',
  },
  {
    id: 'edge-product-db',
    source: 'arch-product-service',
    target: 'arch-database',
    type: 'data-flow',
    strength: 'strong',
  },
  {
    id: 'edge-cart-db',
    source: 'arch-cart-service',
    target: 'arch-database',
    type: 'data-flow',
    strength: 'medium',
  },
  {
    id: 'edge-order-db',
    source: 'arch-order-service',
    target: 'arch-database',
    type: 'data-flow',
    strength: 'strong',
  },
  {
    id: 'edge-payment-db',
    source: 'arch-payment-service',
    target: 'arch-database',
    type: 'data-flow',
    strength: 'strong',
  },
  {
    id: 'edge-order-payment',
    source: 'arch-order-service',
    target: 'arch-payment-service',
    type: 'event',
    strength: 'strong',
  },
];
