interface ActivityItem {
  id: string;
  timestamp: string;
  type:
    | 'issue_created'
    | 'task_created'
    | 'documentation_generated'
    | 'recommendation'
    | 'knowledge_captured'
    | 'mission_generated'
    | 'transfer_plan';
  title: string;
  description: string;
  metadata: Record<string, string>;
}

interface ActivityFeedData {
  summary: {
    issuesCreated: number;
    tasksGenerated: number;
    documentationGenerated: number;
    knowledgeCaptured: number;
    missionsGenerated: number;
    transferPlansCreated: number;
  };
  items: ActivityItem[];
}

export const activityFeedData: ActivityFeedData = {
  summary: {
    issuesCreated: 3,
    tasksGenerated: 12,
    documentationGenerated: 2,
    knowledgeCaptured: 8,
    missionsGenerated: 4,
    transferPlansCreated: 1,
  },
  items: [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'recommendation',
      title: 'Repository analysis initiated',
      description:
        'CodebaseOS agent began full repository analysis of acme-commerce/platform. Scanning 12 files across 4 directories for architectural patterns, ownership, dependencies, and documentation coverage.',
      metadata: {
        repository: 'acme-commerce/platform',
        files: '12',
        trigger: 'manual',
      },
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 1 * 50 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Repository structure mapped',
      description:
        'Mapped complete repository structure: 7 TypeScript modules, 3 TSX component files, 2 configuration files. Identified monolithic 4,200-line service file as the largest module requiring decomposition.',
      metadata: {
        filesMapped: '12',
        largestFile: 'src/services/main-service.ts (4,200 lines)',
        languages: 'TypeScript, TSX, YAML',
      },
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 1 * 40 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Authentication system fully analyzed',
      description:
        'Completed deep analysis of the authentication subsystem. Identified JWT custom implementation with refresh rotation, 3 OAuth providers, and role-based access control across 6 files. Flagged critical documentation gap.',
      metadata: {
        module: 'Authentication',
        files: '6',
        complexity: 'high',
        documentationCoverage: '0%',
      },
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 1 * 30 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Payment processing flow documented',
      description:
        'Mapped the complete Stripe integration including checkout session creation, webhook event handling (5 event types), idempotency key management, and refund processing. Identified 7% test coverage as critical gap.',
      metadata: {
        module: 'Payment Processing',
        files: '5',
        testCoverage: '7%',
        provider: 'Stripe',
      },
    },
    {
      id: 'act-5',
      timestamp: new Date(Date.now() - 1 * 22 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Ownership analysis completed',
      description:
        'Analyzed git blame history across all 12 files. Identified Alice Chen as primary owner of auth (92%) and payment (88%). Carol Wang owns infrastructure exclusively. Bus factor calculated at 1.',
      metadata: {
        contributors: '3',
        busFactor: '1',
        topOwner: 'Alice Chen',
        ownershipConcentration: '92%',
      },
    },
    {
      id: 'act-6',
      timestamp: new Date(Date.now() - 1 * 15 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Circular dependency chain identified',
      description:
        'Detected circular import cycle spanning 5 service modules: order → payment → inventory → notification → user → order. This cycle has caused 2 production incidents and prevents isolated testing.',
      metadata: {
        modules: '5',
        severity: 'high',
        incidents: '2',
      },
    },
    {
      id: 'act-7',
      timestamp: new Date(Date.now() - 1 * 10 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Dependency vulnerabilities detected',
      description:
        'Scanned package-lock.json and identified 3 known CVEs: jsonwebtoken@8.5.1 (critical), lodash@4.17.19 (high), axios@0.21.0 (high). No automated scanning is currently configured.',
      metadata: {
        vulnerabilities: '3',
        critical: '1',
        scannerUsed: 'npm audit',
      },
    },
    {
      id: 'act-8',
      timestamp: new Date(Date.now() - 1 * 5 * 60 * 1000).toISOString(),
      type: 'knowledge_captured',
      title: 'Documentation coverage baseline established',
      description:
        'Scanned all files for documentation (JSDoc, README, inline comments). Found only 8% documentation coverage with the most critical module (authentication) at 0%. Baseline set for tracking improvement.',
      metadata: {
        overallCoverage: '8%',
        worstModule: 'Authentication (0%)',
        bestModule: 'Email (45%)',
      },
    },
    {
      id: 'act-9',
      timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      type: 'documentation_generated',
      title: 'Authentication system documentation generated',
      description:
        'Generated comprehensive documentation for the authentication module covering JWT lifecycle, OAuth provider configuration, session management, middleware behavior, and RBAC permission matrix. Includes sequence diagrams and configuration reference.',
      metadata: {
        module: 'Authentication',
        pages: '12',
        sections: '8',
        coverageAfter: '85%',
      },
    },
    {
      id: 'act-10',
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      type: 'issue_created',
      title: 'GitLab issue #142 created — Auth documentation review',
      description:
        'Created GitLab issue to assign the generated authentication documentation for human review and validation. Issue includes checklist for verifying JWT flow accuracy, confirming OAuth configurations, and cross-referencing security assumptions.',
      metadata: {
        issue: '#142',
        assignee: 'Alice Chen',
        labels: 'documentation, review, authentication',
        status: 'open',
      },
    },
    {
      id: 'act-11',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      type: 'issue_created',
      title: 'GitLab issue #143 created — Patch dependency vulnerabilities',
      description:
        'Created GitLab issue with a detailed patch plan for the 3 identified CVEs. Includes specific version targets, breaking change assessment, and testing checklist for each dependency upgrade.',
      metadata: {
        issue: '#143',
        assignee: 'Unassigned',
        labels: 'security, dependencies, critical',
        status: 'open',
      },
    },
    {
      id: 'act-12',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      type: 'mission_generated',
      title: 'Learning mission created — Authentication Deep Dive',
      description:
        'Generated a progressive learning mission for understanding the authentication system. Covers JWT lifecycle, OAuth integration, session management, and RBAC enforcement in 4 stages with hands-on exercises. Estimated 4-6 hours.',
      metadata: {
        mission: 'Understand Authentication Flow',
        difficulty: 'advanced',
        estimatedTime: '4-6 hours',
        modules: 'Authentication, API Gateway, Middleware',
      },
    },
    {
      id: 'act-13',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      type: 'task_created',
      title: '12 knowledge transfer tasks generated',
      description:
        'Generated 18 discrete tasks across 5 categories (Documentation, Ownership, Learning, GitLab, Testing) with priority ordering, effort estimates, and dependency relationships. Total estimated effort: 40 hours over 4 weeks.',
      metadata: {
        totalTasks: '18',
        categories: '5',
        estimatedHours: '40',
        highPriorityTasks: '8',
      },
    },
    {
      id: 'act-14',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      type: 'issue_created',
      title: 'GitLab issue #144 created — Break service circular dependency',
      description:
        'Created GitLab issue proposing an event-driven mediator pattern to break the 5-module circular dependency. Includes architectural diagram, migration plan, and risk assessment for the refactoring effort.',
      metadata: {
        issue: '#144',
        assignee: 'Unassigned',
        labels: 'architecture, refactoring, high',
        status: 'open',
      },
    },
    {
      id: 'act-15',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'transfer_plan',
      title: 'Complete knowledge transfer plan generated',
      description:
        'Synthesized all analysis findings into a comprehensive knowledge transfer plan. The plan addresses 6 critical risks, assigns 18 tasks across 5 categories, and includes a 5-day onboarding schedule with daily milestones for the incoming developer.',
      metadata: {
        risks: '6',
        tasks: '18',
        categories: '5',
        onboardingDays: '5',
        estimatedHours: '40',
      },
    },
  ],
};
