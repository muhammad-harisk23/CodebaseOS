interface FreelancerData {
  scenario: {
    clientQuote: string;
    problem: string;
    context: string;
    deadline: string;
    budget: string;
  };
  projectSummary: {
    purpose: string;
    architecture: string;
    techStack: string[];
    criticalModules: string[];
    businessLogic: string[];
    authentication: string;
    database: string;
    payments: string;
    integrations: string[];
  };
  topFiles: {
    file: string;
    reason: string;
    importance: 'critical' | 'high' | 'medium';
    estimatedReadTime: string;
    description: string;
  }[];
  dangerZones: {
    zone: string;
    severity: 'critical' | 'high' | 'medium';
    description: string;
    affectedFiles: string[];
    recommendation: string;
  }[];
  onboardingPlan: {
    day: number;
    title: string;
    tasks: string[];
    milestones: string[];
  }[];
  knowledgeTransfer: {
    category: string;
    items: {
      task: string;
      status: 'pending' | 'in-progress' | 'completed';
      assignee?: string;
    }[];
  }[];
}

export const freelancerData: FreelancerData = {
  scenario: {
    clientQuote:
      'Previous developer disappeared. AI generated most of this. Documentation is missing. Please continue development.',
    problem:
      'Inherited AI-generated Next.js commerce platform with no documentation, no onboarding materials, and the original developer is unreachable.',
    context:
      'Agency engagement, 3 week deadline, client wants to add 2 new features (product review system and multi-currency support).',
    deadline: '3 weeks',
    budget: '$12,000',
  },
  projectSummary: {
    purpose:
      'Full-featured e-commerce platform for a mid-market apparel brand with 15,000 monthly active users. Supports product catalog browsing, cart management, Stripe checkout, order tracking, and customer account management. Built as a headless commerce frontend with custom API routes serving a React-based storefront.',
    architecture:
      'Next.js 14 App Router with server components for product pages and client components for interactive cart/checkout flows. API routes serve as a lightweight BFF (Backend for Frontend) layer. State management uses TanStack Query for server state and Zustand for client-side cart state. Authentication handled via NextAuth.js with custom JWT session strategy. Database accessed through Prisma ORM with a PostgreSQL instance.',
    techStack: [
      'Next.js 14',
      'TypeScript',
      'React 18',
      'TanStack Query v5',
      'Zustand',
      'NextAuth.js v4',
      'Prisma ORM',
      'PostgreSQL',
      'Stripe SDK',
      'Tailwind CSS',
      'Resend (email)',
      'Upstash Redis',
    ],
    criticalModules: [
      'Authentication & Authorization',
      'Payment Processing',
      'Order Management',
      'Product Catalog',
      'Inventory Sync',
    ],
    businessLogic: [
      'Cart persistence across sessions using Redis-backed storage with 30-day TTL',
      'Automatic inventory reservation on cart add, released after 15 minutes of inactivity',
      'Tiered pricing based on customer loyalty tier (Bronze, Silver, Gold, Platinum)',
      'Dynamic tax calculation using customer shipping address and product tax categories',
      'Order status workflow: pending → confirmed → processing → shipped → delivered → closed',
    ],
    authentication:
      'NextAuth.js with custom JWT strategy. Supports email/password credentials, Google OAuth, and magic link login. JWT tokens include role claims (customer, admin, superadmin) used for route protection and API authorization. Session refresh handled via a custom middleware that rotates tokens every 30 minutes.',
    database:
      'PostgreSQL 15 hosted on Railway. Schema includes 18 tables covering users, products, variants, orders, line items, payments, reviews, and inventory. Prisma ORM handles all database access with soft-delete patterns and optimistic concurrency via version columns. Connection pooling managed through PgBouncer.',
    payments:
      'Stripe Checkout Sessions for one-time purchases with automatic tax calculation. Stripe webhook handles payment confirmation, fulfillment triggers, and refund processing. Uses Stripe idempotency keys to prevent duplicate charges. Supports partial captures for pre-orders and multi-item order splits.',
    integrations: [
      'Stripe — payment processing and webhook events',
      'Resend — transactional email (order confirmations, shipping updates)',
      'Upstash Redis — session caching and cart persistence',
      'Cloudinary — product image CDN and on-the-fly transformations',
      'Sentry — error tracking and performance monitoring',
    ],
  },
  topFiles: [
    {
      file: 'src/lib/auth.ts',
      reason:
        'Core authentication configuration — defines JWT callbacks, session strategy, and all auth provider setup. All API routes depend on this module for user identification.',
      importance: 'critical',
      estimatedReadTime: '25 min',
      description:
        'Configures NextAuth.js with custom JWT callbacks that embed user roles and permissions into the access token. Handles token generation, verification, and session rotation logic. Contains the authorization flow for all three login providers.',
    },
    {
      file: 'src/lib/payment/stripe.ts',
      reason:
        'Payment processing engine — creates checkout sessions, manages webhook verification, and handles refund logic. Directly handles revenue-critical paths.',
      importance: 'critical',
      estimatedReadTime: '30 min',
      description:
        'Encapsulates all Stripe API interactions including Checkout Session creation with line item metadata, webhook signature verification using raw body parsing, and refund processing with partial capture support. Implements idempotency key generation for all write operations.',
    },
    {
      file: 'src/api/payment/webhook/route.ts',
      reason:
        'Entry point for all Stripe webhook events — handles payment confirmations, fulfillment triggers, and async refund processing.',
      importance: 'critical',
      estimatedReadTime: '20 min',
      description:
        'Next.js API route that receives and processes Stripe webhook events. Routes events to appropriate handlers based on event type (checkout.session.completed, payment_intent.succeeded, charge.refunded). Includes signature verification and idempotent event processing.',
    },
    {
      file: 'src/middleware.ts',
      reason:
        'Global middleware protecting all /dashboard and /api/admin routes. Implements token refresh rotation and role-based access control at the edge.',
      importance: 'critical',
      estimatedReadTime: '15 min',
      description:
        'Next.js middleware that runs on every matched request. Validates JWT tokens, refreshes expired sessions, enforces route protection based on user roles, and redirects unauthenticated users. Also handles CSRF token validation for mutating requests.',
    },
    {
      file: 'prisma/schema.prisma',
      reason:
        'Database schema definition — the single source of truth for all data models, relationships, indexes, and constraints across 18 tables.',
      importance: 'high',
      estimatedReadTime: '35 min',
      description:
        'Prisma schema defining the complete data model with 18 tables. Includes user authentication fields, product variant polymorphism, order state machine fields, soft-delete patterns, and multi-column indexes. Understanding this file is prerequisite to modifying any data flow.',
    },
    {
      file: 'src/services/order-service.ts',
      reason:
        'Order lifecycle management — handles creation, status transitions, and fulfillment logic. Integrates with inventory, payments, and notifications.',
      importance: 'high',
      estimatedReadTime: '40 min',
      description:
        'Large service module managing the complete order lifecycle from cart submission through fulfillment. Implements the order state machine with validation guards on each transition. Orchestrates inventory reservation, payment capture, and notification dispatch.',
    },
    {
      file: 'src/app/(store)/product/[slug]/page.tsx',
      reason:
        'Main product detail page — demonstrates the server component + client component composition pattern used throughout the storefront.',
      importance: 'medium',
      estimatedReadTime: '15 min',
      description:
        'Server component that fetches product data and renders the product detail layout. Uses Suspense boundaries for image loading and dynamically imports the interactive variant selector and add-to-cart components. Follows the pattern all product-facing pages should use.',
    },
    {
      file: 'src/lib/email.ts',
      reason:
        'Transactional email service — all order confirmations, shipping notifications, and password reset emails flow through this module.',
      importance: 'medium',
      estimatedReadTime: '10 min',
      description:
        'Abstraction over the Resend email API providing typed methods for each email template: order confirmation, shipping update, password reset, and welcome email. Handles template rendering with React Email and queue-based delivery to avoid blocking request handlers.',
    },
  ],
  dangerZones: [
    {
      zone: 'High Coupling in Service Layer',
      severity: 'critical',
      description:
        'The order-service.ts, payment-service.ts, and inventory-service.ts form a circular dependency cycle. Order service imports payment service for capture logic, payment service imports inventory for reservation checks, and inventory imports order service for fulfillment status. This makes it impossible to test any service in isolation and causes fragile startup ordering.',
      affectedFiles: [
        'src/services/order-service.ts',
        'src/services/payment-service.ts',
        'src/services/inventory-service.ts',
        'src/services/notification-service.ts',
      ],
      recommendation:
        'Extract shared interfaces into a src/types/domain.ts module. Use dependency injection to pass service references rather than direct imports. As a quick fix, move cross-service calls into a mediator module (src/services/orchestrator.ts) that coordinates between services.',
    },
    {
      zone: 'Dead Code from Previous Iterations',
      severity: 'medium',
      description:
        'Approximately 18% of the codebase consists of dead code from at least two previous architectural iterations. This includes a legacy gRPC client directory, deprecated utility functions, old type definitions from a previous schema version, and unused React component variants. Dead code increases cognitive load and misleads new developers into following outdated patterns.',
      affectedFiles: [
        'src/lib/abandoned-grpc/',
        'src/utils/deprecated/',
        'src/types/old-schema.ts',
        'src/components/ui/Button.legacy.tsx',
      ],
      recommendation:
        'Before starting any feature work, dedicate a half-day cleanup sprint to remove all identified dead code. Use TypeScript compiler strictness to identify unused exports. Add an eslint rule (no-unused-vars) to prevent future accumulation.',
    },
    {
      zone: 'Ownership Risk — Single Point of Failure',
      severity: 'critical',
      description:
        'The authentication and payment modules each have a single primary contributor who wrote over 90% of the code. The original developer who built the platform is unreachable, and no other team member has reviewed or committed to these modules. Any modification to auth or payment logic carries extremely high risk of introducing regressions.',
      affectedFiles: [
        'src/lib/auth.ts',
        'src/middleware.ts',
        'src/api/auth/login/route.ts',
        'src/lib/payment/stripe.ts',
        'src/api/payment/webhook/route.ts',
      ],
      recommendation:
        'Before modifying any critical module, create a comprehensive test suite that captures current behavior. Use characterization tests (golden-master pattern) to lock down existing behavior before making any changes. Pair with a senior developer for all critical path modifications.',
    },
    {
      zone: 'Architecture Drift from AI Generation',
      severity: 'high',
      description:
        'Code analysis reveals multiple inconsistent architectural patterns that suggest different AI generations with different contexts. Some API routes use inline Prisma queries, others use the service layer. Some components use Zustand, others use local state. Some error handling follows a centralized pattern, others have ad-hoc try/catch blocks. This inconsistency makes the codebase unpredictable and hard to reason about.',
      affectedFiles: [
        'src/api/',
        'src/components/',
        'src/services/',
        'src/app/',
      ],
      recommendation:
        'Document the intended architectural patterns in an ADR (Architecture Decision Record). Standardize on one approach per concern: service layer for all data access, Zustand for client state, centralized error handler in middleware. Gradually migrate outliers during feature work rather than a big-bang refactor.',
    },
    {
      zone: 'Dependency Risk — Outdated Packages',
      severity: 'high',
      description:
        'Three production dependencies have known vulnerabilities: lodash@4.17.19 (prototype pollution), axios@0.21.0 (server-side request forgery), and jsonwebtoken@8.5.1 (token verification bypass). The jsonwebtoken vulnerability is particularly concerning as it directly affects the authentication system. No Dependabot or automated dependency scanning is configured.',
      affectedFiles: [
        'package.json',
        'package-lock.json',
        'src/lib/auth.ts',
      ],
      recommendation:
        'Immediately upgrade jsonwebtoken to v9.x and apply the latest patches for lodash and axios. Enable Dependabot alerts in the GitLab repository settings. Add a CI step that runs npm audit with --production flag and fails the build on high/critical vulnerabilities.',
    },
  ],
  onboardingPlan: [
    {
      day: 1,
      title: 'Environment Setup & High-Level Architecture',
      tasks: [
        'Clone repository and verify development environment matches required Node.js 20.x and PostgreSQL 15 versions',
        'Run database migrations and seed script to populate local development data',
        'Configure .env.local with Stripe test keys and Resend API credentials from the shared password manager',
        'Start the development server and verify all 5 critical user flows work end-to-end (browse, login, cart, checkout, order tracking)',
        'Read through the CodebaseOS knowledge transfer brief and review all risk assessment findings',
        'Set up VS Code workspace with recommended extensions (Prisma, Tailwind, ESLint) and verify TypeScript compilation',
      ],
      milestones: [
        'Development environment fully operational',
        'All critical user flows verified on local instance',
        'CodebaseOS risk dashboard reviewed and understood',
      ],
    },
    {
      day: 2,
      title: 'Authentication & Authorization Deep Dive',
      tasks: [
        'Read src/lib/auth.ts end-to-end and document the JWT callback chain and token payload structure',
        'Trace the complete login flow from the login form component through the API route to the session callback',
        'Review middleware.ts and understand the token refresh rotation logic and route protection rules',
        'Map the RBAC permission matrix — which roles can access which routes and API endpoints',
        'Create a test plan documenting expected auth behavior for each of the 3 login providers',
        'Identify and document any hardcoded secrets or insecure patterns found in the auth module',
      ],
      milestones: [
        'Authentication flow fully understood and documented',
        'RBAC permission matrix created',
        'Security concerns identified and reported',
      ],
    },
    {
      day: 3,
      title: 'Payment & Order Processing',
      tasks: [
        'Read src/lib/payment/stripe.ts and document the checkout session creation flow with all metadata fields',
        'Trace the webhook route and map each Stripe event type to its handler function',
        'Review order-service.ts and document the order state machine with all valid transitions and guards',
        'Understand the inventory reservation pattern — how items are reserved, released, and reconciled',
        'Test the payment flow using Stripe test mode cards (4242424242424242 for success, 4000000000000002 for decline)',
        'Document the refund processing logic including partial captures and multi-item splits',
      ],
      milestones: [
        'Payment and order lifecycle fully understood',
        'Stripe test flows validated end-to-end',
        'Inventory reservation logic documented',
      ],
    },
    {
      day: 4,
      title: 'Database Schema & Data Architecture',
      tasks: [
        'Read prisma/schema.prisma and map all 18 tables with their relationships and constraints',
        'Understand the soft-delete pattern and how it affects queries across the codebase',
        'Review the Prisma middleware for logging and optimistic concurrency implementation',
        'Trace the data flow for product creation — from admin API through database write to storefront display',
        'Document the Redis caching strategy — which data is cached, TTL values, and cache invalidation triggers',
        'Create an ERD (Entity Relationship Diagram) documenting the key relationships',
      ],
      milestones: [
        'Database schema fully mapped and understood',
        'Caching strategy documented',
        'ERD created for team reference',
      ],
    },
    {
      day: 5,
      title: 'Feature Planning & Risk Mitigation',
      tasks: [
        'Review the 2 feature requests (product reviews and multi-currency) and identify affected files and modules',
        'Create technical design documents for both features with data model changes, API changes, and UI mockups',
        'Write characterization tests for the auth and payment modules to lock down current behavior before modifications',
        'Schedule a knowledge transfer session with the client to fill any remaining gaps in business logic understanding',
        'Finalize the sprint plan with effort estimates and dependency ordering for both features',
        'Set up monitoring alerts for the critical paths that will be modified during feature development',
      ],
      milestones: [
        'Technical designs for both features completed and approved',
        'Safety net tests written for critical modules',
        'Sprint plan finalized and ready for development',
      ],
    },
  ],
  knowledgeTransfer: [
    {
      category: 'Documentation',
      items: [
        {
          task: 'Generate comprehensive README with setup instructions, architecture overview, and development workflow',
          status: 'completed',
          assignee: 'CodebaseOS Agent',
        },
        {
          task: 'Document authentication flow including JWT lifecycle, OAuth providers, and RBAC matrix',
          status: 'completed',
          assignee: 'CodebaseOS Agent',
        },
        {
          task: 'Create API reference documentation for all 12 API routes with request/response examples',
          status: 'in-progress',
          assignee: 'CodebaseOS Agent',
        },
        {
          task: 'Write database schema documentation with ERD and migration history',
          status: 'pending',
        },
      ],
    },
    {
      category: 'Ownership',
      items: [
        {
          task: 'Identify all single-owner modules and assign secondary owners for each',
          status: 'in-progress',
          assignee: 'Project Lead',
        },
        {
          task: 'Set up mandatory code review requirements for auth and payment modules',
          status: 'pending',
        },
        {
          task: 'Create a rotation schedule for critical module on-call responsibilities',
          status: 'pending',
        },
      ],
    },
    {
      category: 'Learning',
      items: [
        {
          task: 'Complete "Understand Authentication Flow" learning mission',
          status: 'in-progress',
          assignee: 'New Developer',
        },
        {
          task: 'Complete "Payment System Deep Dive" learning mission',
          status: 'pending',
          assignee: 'New Developer',
        },
        {
          task: 'Complete "Data Pipeline Architecture" learning mission',
          status: 'pending',
        },
      ],
    },
    {
      category: 'GitLab',
      items: [
        {
          task: 'Create GitLab issue templates for bug reports, feature requests, and documentation gaps',
          status: 'completed',
          assignee: 'CodebaseOS Agent',
        },
        {
          task: 'Set up CI/CD pipeline with automated testing, linting, and security scanning',
          status: 'pending',
        },
        {
          task: 'Configure branch protection rules and merge request approvals',
          status: 'pending',
        },
      ],
    },
    {
      category: 'Testing',
      items: [
        {
          task: 'Write characterization tests for authentication module (6 files)',
          status: 'pending',
        },
        {
          task: 'Write integration tests for payment processing with Stripe test mode',
          status: 'pending',
        },
        {
          task: 'Add unit tests for business logic utilities (pricing, tax, inventory)',
          status: 'pending',
        },
      ],
    },
  ],
};
