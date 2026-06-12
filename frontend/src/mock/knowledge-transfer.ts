interface KnowledgeTransferTask {
  id: string;
  category: string;
  task: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  relatedModule?: string;
  effort?: string;
}

interface KnowledgeTransferData {
  summary: {
    totalTasks: number;
    completed: number;
    inProgress: number;
    pending: number;
    estimatedHours: number;
  };
  categories: {
    category: string;
    tasks: KnowledgeTransferTask[];
    progress: number;
  }[];
}

export const knowledgeTransferData: KnowledgeTransferData = {
  summary: {
    totalTasks: 18,
    completed: 5,
    inProgress: 4,
    pending: 9,
    estimatedHours: 40,
  },
  categories: [
    {
      category: 'Documentation',
      progress: 60,
      tasks: [
        {
          id: 'kt-doc-1',
          category: 'Documentation',
          task: 'Generate comprehensive README with setup and architecture overview',
          description:
            'Create a production-quality README.md covering local development setup (Node.js 20.x, PostgreSQL 15, Redis), environment variable reference, architecture diagram, and contribution guidelines. Must be accurate enough for a new developer to onboard within 4 hours.',
          status: 'completed',
          priority: 'high',
          assignee: 'CodebaseOS Agent',
          effort: '2 hours',
        },
        {
          id: 'kt-doc-2',
          category: 'Documentation',
          task: 'Document authentication flow and RBAC permission matrix',
          description:
            'Write detailed documentation for the JWT lifecycle (generation → validation → refresh → revocation), all three OAuth provider configurations (Google, GitHub, magic link), session middleware behavior, and the complete RBAC permission matrix mapping roles to routes and API endpoints.',
          status: 'completed',
          priority: 'high',
          assignee: 'CodebaseOS Agent',
          relatedModule: 'Authentication',
          effort: '3 hours',
        },
        {
          id: 'kt-doc-3',
          category: 'Documentation',
          task: 'Create API reference for all 12 API routes',
          description:
            'Generate OpenAPI-compatible documentation for every API route including request/response schemas, authentication requirements, rate limits, error codes, and example payloads. Cover all auth routes (login, register, callback, refresh), payment routes (checkout, webhook, refund), and order routes.',
          status: 'in-progress',
          priority: 'high',
          assignee: 'CodebaseOS Agent',
          relatedModule: 'API Gateway',
          effort: '4 hours',
        },
        {
          id: 'kt-doc-4',
          category: 'Documentation',
          task: 'Write database schema documentation with ERD',
          description:
            'Document all 18 Prisma schema tables with column descriptions, relationship explanations, index rationale, and constraint purposes. Include an Entity Relationship Diagram showing the key relationships between users, products, orders, payments, and inventory.',
          status: 'pending',
          priority: 'medium',
          relatedModule: 'Database',
          effort: '2 hours',
        },
      ],
    },
    {
      category: 'Ownership',
      progress: 25,
      tasks: [
        {
          id: 'kt-own-1',
          category: 'Ownership',
          task: 'Assign secondary owners to all single-owner critical modules',
          description:
            'Identify modules with bus factor of 1 (authentication, payment processing, deployment pipeline) and assign a secondary owner to each. Secondary owners must complete the relevant learning missions and submit at least 2 reviewed PRs to the module before the end of the transfer period.',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Project Lead',
          relatedModule: 'Ownership',
          effort: '1 hour',
        },
        {
          id: 'kt-own-2',
          category: 'Ownership',
          task: 'Enforce mandatory peer review for auth and payment modules',
          description:
            'Configure GitLab branch protection rules requiring at least 2 approvals for any merge request touching files in src/lib/auth.ts, src/lib/payment/, or src/middleware.ts. Add CODEOWNERS file specifying primary and secondary reviewers for each critical directory.',
          status: 'pending',
          priority: 'high',
          assignee: 'Project Lead',
          effort: '1 hour',
        },
        {
          id: 'kt-own-3',
          category: 'Ownership',
          task: 'Create on-call rotation schedule for critical modules',
          description:
            'Establish a weekly rotation schedule where each critical module owner handles incoming issues, reviews PRs, and serves as the escalation point for their module. Schedule must ensure no single person is on-call for more than one critical module simultaneously.',
          status: 'pending',
          priority: 'medium',
          effort: '1 hour',
        },
      ],
    },
    {
      category: 'Learning',
      progress: 33,
      tasks: [
        {
          id: 'kt-learn-1',
          category: 'Learning',
          task: 'Complete "Understand Authentication Flow" learning mission',
          description:
            'Work through the structured learning mission covering JWT token lifecycle, OAuth integration, session management, and RBAC enforcement. Includes guided code reading exercises, hands-on token debugging, and a comprehension quiz. Estimated 4-6 hours to complete.',
          status: 'completed',
          priority: 'high',
          assignee: 'New Developer',
          relatedModule: 'Authentication',
          effort: '5 hours',
        },
        {
          id: 'kt-learn-2',
          category: 'Learning',
          task: 'Complete "Payment System Deep Dive" learning mission',
          description:
            'Work through the expert-level learning mission covering Stripe Checkout integration, webhook signature verification, idempotency key management, refund processing, and partial capture logic. Includes Stripe test mode exercises and error scenario walkthroughs. Estimated 8-10 hours.',
          status: 'in-progress',
          priority: 'high',
          assignee: 'New Developer',
          relatedModule: 'Payment Processing',
          effort: '9 hours',
        },
        {
          id: 'kt-learn-3',
          category: 'Learning',
          task: 'Complete "Database Schema & Data Architecture" learning mission',
          description:
            'Learn the complete Prisma schema with all 18 tables, soft-delete patterns, optimistic concurrency, Redis caching strategy, and data migration procedures. Includes hands-on exercises creating new migrations and optimizing queries. Estimated 5-7 hours.',
          status: 'pending',
          priority: 'medium',
          relatedModule: 'Database',
          effort: '6 hours',
        },
        {
          id: 'kt-learn-4',
          category: 'Learning',
          task: 'Complete "Frontend Component Architecture" learning mission',
          description:
            'Map the complete React component hierarchy, understand server vs. client component boundaries, TanStack Query data fetching patterns, Zustand state management, and the custom design system. Includes hands-on exercises creating new page patterns. Estimated 2-3 hours.',
          status: 'completed',
          priority: 'low',
          assignee: 'New Developer',
          relatedModule: 'Frontend Components',
          effort: '3 hours',
        },
      ],
    },
    {
      category: 'GitLab',
      progress: 33,
      tasks: [
        {
          id: 'kt-git-1',
          category: 'GitLab',
          task: 'Create standardized GitLab issue and merge request templates',
          description:
            'Set up GitLab issue templates for bug reports (with reproduction steps template), feature requests (with acceptance criteria), documentation gaps (with module reference), and knowledge transfer tasks. Configure merge request template with checklist for testing, documentation updates, and code review notes.',
          status: 'completed',
          priority: 'medium',
          assignee: 'CodebaseOS Agent',
          effort: '1 hour',
        },
        {
          id: 'kt-git-2',
          category: 'GitLab',
          task: 'Configure CI/CD pipeline with automated quality gates',
          description:
            'Set up GitLab CI pipeline with stages for linting (ESLint + Prettier), type checking (tsc --noEmit), unit testing (Vitest), integration testing (Stripe test mode), security scanning (npm audit), and deployment preview. Pipeline must block merges on failing quality gates.',
          status: 'in-progress',
          priority: 'high',
          assignee: 'DevOps Engineer',
          effort: '3 hours',
        },
        {
          id: 'kt-git-3',
          category: 'GitLab',
          task: 'Implement automated knowledge capture on merge events',
          description:
            'Configure a GitLab webhook that triggers CodebaseOS analysis whenever a merge request is merged. The system should automatically update ownership metrics, recalculate documentation coverage, and flag any new knowledge concentration risks introduced by the changes.',
          status: 'pending',
          priority: 'medium',
          effort: '2 hours',
        },
      ],
    },
    {
      category: 'Testing',
      progress: 17,
      tasks: [
        {
          id: 'kt-test-1',
          category: 'Testing',
          task: 'Write characterization tests for authentication module',
          description:
            'Create golden-master characterization tests for all 6 authentication files to lock down current behavior before any modifications. Tests should capture JWT token format, session cookie behavior, OAuth callback handling, middleware redirect logic, and RBAC enforcement for all role combinations.',
          status: 'pending',
          priority: 'high',
          relatedModule: 'Authentication',
          effort: '4 hours',
        },
        {
          id: 'kt-test-2',
          category: 'Testing',
          task: 'Write integration tests for payment processing flow',
          description:
            'Create Stripe test mode integration tests covering checkout session creation, successful payment webhook, declined payment webhook, refund processing, and partial capture scenarios. Tests must verify idempotency key behavior and webhook signature validation.',
          status: 'pending',
          priority: 'high',
          relatedModule: 'Payment Processing',
          effort: '4 hours',
        },
        {
          id: 'kt-test-3',
          category: 'Testing',
          task: 'Add unit tests for business logic utility functions',
          description:
            'Write unit tests for pricing calculation (tiered loyalty pricing), tax computation (address-based rates), inventory reservation logic (TTL and release), and order state transition validation (valid transition guards). Target 90% branch coverage for each utility module.',
          status: 'pending',
          priority: 'medium',
          relatedModule: 'Business Logic',
          effort: '3 hours',
        },
        {
          id: 'kt-test-4',
          category: 'Testing',
          task: 'Set up E2E smoke tests for critical user flows',
          description:
            'Configure Playwright end-to-end tests covering the 5 critical user flows: product browsing, user registration/login, cart management, Stripe checkout, and order tracking. Tests should run against a staging environment and serve as a deployment gate.',
          status: 'completed',
          priority: 'low',
          effort: '3 hours',
        },
      ],
    },
  ],
};
