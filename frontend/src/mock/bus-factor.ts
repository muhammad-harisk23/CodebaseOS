interface BusFactorData {
  score: number;
  totalContributors: number;
  question: string;
  moduleOwnership: {
    module: string;
    primaryOwner: string;
    primaryPercent: number;
    backupOwner: string;
    backupPercent: number;
    files: number;
    risk: 'critical' | 'high' | 'medium' | 'low';
  }[];
  impactAnalysis: {
    contributor: string;
    modules: string[];
    risks: {
      module: string;
      risk: string;
      severity: 'critical' | 'high' | 'medium';
    }[];
  }[];
  contributorNetwork: {
    id: string;
    name: string;
    role: string;
    modules: number;
    lastActive: string;
    commits: number;
  }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
  }[];
  trend: { date: string; value: number }[];
}

export const busFactorData: BusFactorData = {
  score: 1,
  totalContributors: 3,
  question:
    'How many contributors can leave before the repository becomes dangerous to maintain?',
  moduleOwnership: [
    {
      module: 'Authentication',
      primaryOwner: 'Alice Chen',
      primaryPercent: 92,
      backupOwner: 'Charlie Kim',
      backupPercent: 8,
      files: 12,
      risk: 'critical',
    },
    {
      module: 'Payments',
      primaryOwner: 'Charlie Kim',
      primaryPercent: 88,
      backupOwner: 'Alice Chen',
      backupPercent: 12,
      files: 8,
      risk: 'critical',
    },
    {
      module: 'Database',
      primaryOwner: 'Bob Martinez',
      primaryPercent: 75,
      backupOwner: 'Alice Chen',
      backupPercent: 25,
      files: 19,
      risk: 'high',
    },
    {
      module: 'Infrastructure',
      primaryOwner: 'Alice Chen',
      primaryPercent: 94,
      backupOwner: 'Bob Martinez',
      backupPercent: 6,
      files: 15,
      risk: 'critical',
    },
    {
      module: 'API Gateway',
      primaryOwner: 'Alice Chen',
      primaryPercent: 67,
      backupOwner: 'Bob Martinez',
      backupPercent: 33,
      files: 22,
      risk: 'high',
    },
  ],
  impactAnalysis: [
    {
      contributor: 'Alice Chen',
      modules: ['Authentication', 'Infrastructure', 'API Gateway'],
      risks: [
        {
          module: 'Authentication',
          risk: 'Complete loss of JWT/OAuth knowledge. No one understands the token lifecycle or session management flow. Would require 3+ weeks to rebuild from scratch.',
          severity: 'critical',
        },
        {
          module: 'Infrastructure',
          risk: 'Deployment pipeline, Docker configuration, and nginx setup are undocumented. Production deployments would halt immediately.',
          severity: 'critical',
        },
        {
          module: 'API Gateway',
          risk: 'Loss of routing logic, rate limiting configuration, and middleware composition. Bob has partial knowledge but has never deployed independently.',
          severity: 'high',
        },
      ],
    },
    {
      contributor: 'Bob Martinez',
      modules: ['Database', 'API Gateway'],
      risks: [
        {
          module: 'Database',
          risk: 'Loss of Prisma schema expertise, migration strategy, and read replica configuration. Database changes would require external consulting.',
          severity: 'critical',
        },
        {
          module: 'API Gateway',
          risk: 'Loss of database-level understanding for API endpoints. Alice has surface-level SQL knowledge but not the optimization patterns Bob implemented.',
          severity: 'high',
        },
      ],
    },
    {
      contributor: 'Charlie Kim',
      modules: ['Payments'],
      risks: [
        {
          module: 'Payments',
          risk: 'Complete loss of Stripe integration knowledge including webhook handling, idempotency keys, and refund processing. Payment processing would break on any change.',
          severity: 'critical',
        },
      ],
    },
  ],
  contributorNetwork: [
    {
      id: 'contrib-alice',
      name: 'Alice Chen',
      role: 'Lead Engineer',
      modules: 8,
      lastActive: '2025-01-14',
      commits: 342,
    },
    {
      id: 'contrib-bob',
      name: 'Bob Martinez',
      role: 'Backend Dev',
      modules: 3,
      lastActive: '2025-01-13',
      commits: 89,
    },
    {
      id: 'contrib-charlie',
      name: 'Charlie Kim',
      role: 'Full Stack',
      modules: 2,
      lastActive: '2025-01-10',
      commits: 56,
    },
  ],
  recommendations: [
    {
      title: 'Generate Documentation',
      description:
        'Auto-generate comprehensive documentation for the three highest-risk modules: Authentication, Payments, and Infrastructure. Include architecture diagrams, API contracts, and decision records.',
      action: 'generate-documentation',
    },
    {
      title: 'Create Learning Mission',
      description:
        'Build a structured learning mission for Bob to gain proficiency in Infrastructure and for Charlie to understand Authentication. Missions should include hands-on tasks with review checkpoints.',
      action: 'create-learning-mission',
    },
    {
      title: 'Transfer Ownership',
      description:
        'Assign backup owners to all critical modules with a requirement of at least 2 commits per month to the assigned module. Start with Infrastructure → Bob and Payments → Alice.',
      action: 'transfer-ownership',
    },
    {
      title: 'Generate Knowledge Transfer Plan',
      description:
        'Create a 6-week knowledge transfer plan with weekly objectives, pair programming sessions, and knowledge verification checkpoints for each critical module.',
      action: 'generate-knowledge-transfer-plan',
    },
    {
      title: 'Create GitLab Issue',
      description:
        'File a critical-priority GitLab issue tracking bus factor remediation with sub-tasks for each module, assignees for knowledge transfer, and a 6-week deadline.',
      action: 'create-gitlab-issue',
    },
  ],
  trend: [
    { date: '2024-11-18', value: 1 },
    { date: '2024-11-25', value: 1 },
    { date: '2024-12-02', value: 1 },
    { date: '2024-12-09', value: 1 },
    { date: '2024-12-16', value: 1 },
    { date: '2024-12-23', value: 1 },
    { date: '2024-12-30', value: 1 },
    { date: '2025-01-06', value: 1 },
  ],
};