import type { GitLabIssue } from '@/types';

export const gitlabIssues: GitLabIssue[] = [
  {
    id: 'issue-1',
    title: 'Document Authentication Module',
    description:
      '## Objective\nCreate comprehensive documentation for the authentication system that currently spans 12 files with zero documentation.\n\n## Scope\n- JWT token lifecycle (generation, validation, refresh, revocation)\n- OAuth callback flows for Google and GitHub providers\n- Session management strategy and cookie configuration\n- Role-based access control matrix and permission hierarchy\n- Password reset and MFA enrollment flows\n\n## Acceptance Criteria\n- [ ] Architecture overview document in /docs/auth/\n- [ ] Inline JSDoc comments on all exported functions\n- [ ] Sequence diagram for login and token refresh flows\n- [ ] ADR for authentication approach selection\n- [ ] Runbook for common auth-related incidents',
    type: 'documentation',
    priority: 'critical',
    status: 'open',
    assignee: 'sarah.chen',
    labels: ['documentation', 'auth', 'knowledge-debt', 'priority:critical'],
    createdAt: '2025-01-10T08:00:00Z',
    url: 'https://gitlab.com/acme-corp/nextjs-commerce-platform/-/issues/142',
  },
  {
    id: 'issue-2',
    title: 'Add Integration Tests for Payment Module',
    description:
      '## Objective\nIncrease payment module test coverage from 7% to 80% by adding integration tests for critical paths.\n\n## Scope\n- Stripe webhook signature verification (happy path and tampered signatures)\n- Checkout session creation with multiple currency and line item combinations\n- Refund processing including partial refunds and refund limits\n- Idempotency key collision handling\n- Payment intent status transition edge cases\n\n## Acceptance Criteria\n- [ ] Minimum 80% line coverage for payment module\n- [ ] All tests pass against Stripe test mode\n- [ ] CI pipeline updated to run payment tests on every PR\n- [ ] Test fixtures for common edge cases documented',
    type: 'risk-mitigation',
    priority: 'high',
    status: 'in-progress',
    assignee: 'jordan.lee',
    labels: ['testing', 'payment', 'risk-mitigation', 'priority:high'],
    createdAt: '2025-01-09T10:15:00Z',
    url: 'https://gitlab.com/acme-corp/nextjs-commerce-platform/-/issues/139',
  },
  {
    id: 'issue-3',
    title: 'Reduce Circular Dependencies in Service Layer',
    description:
      '## Objective\nEliminate the 8 circular dependency chains detected in the service layer, particularly the OrderService → PaymentService → InventoryService → OrderService cycle.\n\n## Approach\n1. Extract shared domain types into @/types/domain\n2. Introduce internal event bus for cross-service communication\n3. Apply dependency injection for shared utilities\n4. Update module structure to enforce one-directional dependencies\n\n## Acceptance Criteria\n- [ ] Zero circular dependency warnings from madge or dependency-cruiser\n- [ ] All existing tests continue to pass\n- [ ] Architecture diagram updated to reflect new structure\n- [ ] ADR documenting the event-driven approach',
    type: 'refactor',
    priority: 'high',
    status: 'open',
    assignee: 'alex.rivera',
    labels: ['refactor', 'architecture', 'tech-debt', 'priority:high'],
    createdAt: '2025-01-11T16:00:00Z',
    url: 'https://gitlab.com/acme-corp/nextjs-commerce-platform/-/issues/145',
  },
  {
    id: 'issue-4',
    title: 'Update Outdated Dependencies',
    description:
      '## Objective\nAddress 23 outdated dependencies, prioritizing 3 with known CVEs: lodash (prototype pollution), axios (SSRF), and jsonwebtoken (weak key generation).\n\n## Scope\n- Patch CVE-affected dependencies immediately\n- Update non-breaking minor/patch versions in batch\n- Test major version upgrades (Next.js 13→14 already done) individually\n- Update lockfiles and verify no integrity issues\n\n## Acceptance Criteria\n- [ ] Zero known CVEs in production dependencies\n- [ ] Dependabot/Renovate configured for ongoing updates\n- [ ] All tests pass with updated dependencies\n- [ ] Changelog reviewed for breaking changes',
    type: 'risk-mitigation',
    priority: 'medium',
    status: 'open',
    labels: ['security', 'dependencies', 'maintenance', 'priority:medium'],
    createdAt: '2025-01-12T09:45:00Z',
    url: 'https://gitlab.com/acme-corp/nextjs-commerce-platform/-/issues/148',
  },
  {
    id: 'issue-5',
    title: 'Create Architecture Decision Records',
    description:
      '## Objective\nEstablish an ADR (Architecture Decision Record) practice and document all major historical architectural decisions that currently exist only as tribal knowledge.\n\n## Required ADRs\n1. ADR-001: Why Next.js over Remix for the frontend framework\n2. ADR-002: Stripe integration architecture and webhook handling strategy\n3. ADR-003: Authentication approach — JWT vs. session-based tradeoffs\n4. ADR-004: Database selection — PostgreSQL with Prisma ORM\n5. ADR-005: Caching strategy — Redis for session and product data\n6. ADR-006: Deployment pipeline — Docker + GitHub Actions + AWS ECS\n\n## Acceptance Criteria\n- [ ] ADR template created in /docs/adr/\n- [ ] All 6 initial ADRs documented using the template\n- [ ] ADR index (README) created with status tracking\n- [ ] ADR creation added to Definition of Done for future decisions',
    type: 'knowledge-transfer',
    priority: 'medium',
    status: 'open',
    assignee: 'sarah.chen',
    labels: ['documentation', 'adr', 'knowledge-transfer', 'priority:medium'],
    createdAt: '2025-01-13T11:00:00Z',
    url: 'https://gitlab.com/acme-corp/nextjs-commerce-platform/-/issues/151',
  },
];
