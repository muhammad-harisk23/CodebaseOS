interface RecoverabilityData {
  score: number;
  max: number;
  status: string;
  decision: 'Healthy' | 'Recoverable' | 'High Refactoring Cost' | 'Rebuild Recommended';
  inputs: { label: string; score: number; max: number }[];
  assessment: {
    label: string;
    value: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }[];
  criticalIssues: {
    title: string;
    description: string;
    severity: 'critical' | 'high';
  }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
  }[];
  trend: { date: string; value: number }[];
}

export const recoverabilityData: RecoverabilityData = {
  score: 38,
  max: 100,
  status: 'Rebuild Recommended',
  decision: 'Rebuild Recommended',
  inputs: [
    { label: 'Knowledge Debt', score: 81, max: 100 },
    { label: 'Survivability', score: 34, max: 100 },
    { label: 'Architecture Complexity', score: 72, max: 100 },
    { label: 'Dependency Health', score: 61, max: 100 },
    { label: 'Duplicate Logic', score: 25, max: 100 },
    { label: 'Dead Code', score: 35, max: 100 },
    { label: 'Coupling', score: 78, max: 100 },
    { label: 'Ownership Risk', score: 85, max: 100 },
    { label: 'Documentation', score: 8, max: 100 },
    { label: 'Bus Factor', score: 10, max: 100 },
  ],
  assessment: [
    {
      label: 'Estimated Understanding Time',
      value: '3 Weeks',
      severity: 'high',
    },
    {
      label: 'Estimated Refactor Cost',
      value: 'High',
      severity: 'critical',
    },
    {
      label: 'Estimated Rebuild Cost',
      value: 'Medium',
      severity: 'medium',
    },
    {
      label: 'Recommended Path',
      value: 'Rebuild',
      severity: 'critical',
    },
  ],
  criticalIssues: [
    {
      title: 'Authentication Logic Duplicated 4 Times',
      description:
        'Authentication validation, token generation, and session handling are implemented independently in four separate locations: the main auth module, the API gateway middleware, a legacy REST endpoint, and a WebSocket handler. Each implementation has subtle behavioral differences that cause intermittent session invalidation bugs.',
      severity: 'critical',
    },
    {
      title: 'Three Separate Payment Implementations',
      description:
        'Payment processing exists in three incompatible implementations: a Stripe integration using API v1 (deprecated), a Stripe integration using API v2023-10-16, and a PayPal integration that was half-migrated and abandoned. All three share no common interface or abstraction layer.',
      severity: 'critical',
    },
    {
      title: 'Large Dependency Conflicts',
      description:
        'The project has 23 outdated dependencies with 3 known CVEs. A major version conflict between React 18 and a legacy UI component library forces a custom webpack alias workaround. Upgrading any single major dependency triggers cascading breakage in at least two other packages.',
      severity: 'critical',
    },
    {
      title: 'Multiple Legacy Service Implementations',
      description:
        'The codebase contains remnants of three architectural iterations: an original monolithic Express server (partially removed), a microservices attempt with gRPC (abandoned at 30% completion), and the current Next.js API routes. Dead service stubs and unused type definitions from previous iterations account for 18% of the codebase.',
      severity: 'high',
    },
    {
      title: 'Near-Zero Documentation Coverage',
      description:
        'Only 8% of files contain any form of documentation (comments, JSDoc, or markdown). There are no architectural decision records, no API documentation, no data model documentation, and no deployment runbooks. The single README file is the default Next.js template with no modifications.',
      severity: 'critical',
    },
  ],
  recommendations: [
    {
      title: 'Rebuild Auth Layer',
      description:
        'Design and implement a unified authentication layer from scratch, consolidating the four separate implementations into a single, well-documented auth service with proper abstraction and comprehensive test coverage.',
      action: 'rebuild-auth-layer',
    },
    {
      title: 'Generate Migration Plan',
      description:
        'Create a phased migration plan that identifies which components can be preserved, which need refactoring, and which should be rebuilt from scratch. Include risk assessment, dependency ordering, and rollback strategies for each phase.',
      action: 'generate-migration-plan',
    },
    {
      title: 'Create Refactoring Tasks',
      description:
        'Break down the rebuild effort into granular, actionable tasks with clear acceptance criteria, dependency chains, and estimated effort. Prioritize by risk reduction and business impact.',
      action: 'create-refactoring-tasks',
    },
    {
      title: 'Create GitLab Issues',
      description:
        'Generate a set of prioritized GitLab issues from the refactoring tasks, complete with labels, assignees, milestones, and detailed descriptions that allow any developer to pick up and execute the work.',
      action: 'create-gitlab-issues',
    },
  ],
  trend: [
    { date: '2024-10-21', value: 45 },
    { date: '2024-10-28', value: 44 },
    { date: '2024-11-04', value: 43 },
    { date: '2024-11-11', value: 42 },
    { date: '2024-11-18', value: 41 },
    { date: '2024-11-25', value: 40 },
    { date: '2024-12-02', value: 39 },
    { date: '2024-12-09', value: 39 },
    { date: '2024-12-16', value: 38 },
    { date: '2024-12-23', value: 38 },
    { date: '2024-12-30', value: 38 },
    { date: '2025-01-06', value: 38 },
  ],
};