interface SurvivabilityInput {
  label: string;
  score: number;
  max: number;
  weight: string;
}

interface SurvivabilityData {
  score: number;
  max: number;
  status: string;
  question: string;
  inputs: SurvivabilityInput[];
  breakdown: { category: string; score: number; max: number }[];
  trend: { date: string; value: number }[];
  highRiskFactors: {
    title: string;
    description: string;
    severity: 'critical' | 'high';
  }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
    view: string;
  }[];
}

export const survivabilityData: SurvivabilityData = {
  score: 34,
  max: 100,
  status: 'High Risk',
  question:
    'If the primary developer disappears tomorrow, can this repository continue evolving safely?',
  inputs: [
    {
      label: 'Documentation Coverage',
      score: 12,
      max: 100,
      weight: 'High',
    },
    {
      label: 'Knowledge Distribution',
      score: 22,
      max: 100,
      weight: 'Critical',
    },
    {
      label: 'Architecture Complexity',
      score: 41,
      max: 100,
      weight: 'High',
    },
    {
      label: 'Dependency Health',
      score: 84,
      max: 100,
      weight: 'Low',
    },
    {
      label: 'Bus Factor',
      score: 15,
      max: 100,
      weight: 'Critical',
    },
    {
      label: 'Onboarding Difficulty',
      score: 18,
      max: 100,
      weight: 'Critical',
    },
    {
      label: 'Ownership Distribution',
      score: 20,
      max: 100,
      weight: 'Critical',
    },
    {
      label: 'Code Coupling',
      score: 38,
      max: 100,
      weight: 'High',
    },
  ],
  breakdown: [
    { category: 'Documentation', score: 12, max: 100 },
    { category: 'Knowledge Distribution', score: 22, max: 100 },
    { category: 'Dependency Health', score: 84, max: 100 },
    { category: 'Architecture', score: 41, max: 100 },
    { category: 'Bus Factor', score: 15, max: 100 },
    { category: 'Ownership', score: 20, max: 100 },
  ],
  trend: [
    { date: '2024-10-21', value: 42 },
    { date: '2024-10-28', value: 41 },
    { date: '2024-11-04', value: 40 },
    { date: '2024-11-11', value: 39 },
    { date: '2024-11-18', value: 38 },
    { date: '2024-11-25', value: 37 },
    { date: '2024-12-02', value: 37 },
    { date: '2024-12-09', value: 36 },
    { date: '2024-12-16', value: 36 },
    { date: '2024-12-23', value: 35 },
    { date: '2024-12-30', value: 34 },
    { date: '2025-01-06', value: 34 },
  ],
  highRiskFactors: [
    {
      title: 'Authentication Knowledge Locked in One Contributor',
      description:
        'The entire authentication flow — JWT generation, OAuth callbacks, session management, and role-based access control — is understood by only one developer. No other contributor has committed to auth-related files in the past 14 months.',
      severity: 'critical',
    },
    {
      title: 'No Onboarding Documentation',
      description:
        'The repository has no README, no CONTRIBUTING guide, no architecture overview, and no developer setup instructions. New contributors must rely on verbal knowledge transfer to become productive.',
      severity: 'critical',
    },
    {
      title: 'Large Monolithic Modules',
      description:
        'Three modules exceed 2,000 lines each with no internal modularity. The main service file alone is 4,200 lines, containing business logic for orders, payments, inventory, and notifications in a single file.',
      severity: 'high',
    },
    {
      title: 'Limited Ownership Distribution',
      description:
        '82% of all commits come from a single developer. The remaining two contributors have only touched non-critical files (UI components and minor bug fixes). No cross-module code reviews are enforced.',
      severity: 'critical',
    },
    {
      title: 'High Coupling Between Services',
      description:
        'Static analysis detected 8 circular dependency chains in the service layer. Modules import directly from each other rather than through shared interfaces, making it impossible to extract or replace individual services.',
      severity: 'high',
    },
  ],
  recommendations: [
    {
      title: 'Generate Documentation',
      description:
        'Automatically generate comprehensive documentation for the authentication system, API endpoints, and core business logic modules to reduce single-contributor dependency.',
      action: 'generate-documentation',
      view: 'documentation',
    },
    {
      title: 'Create Knowledge Transfer Plan',
      description:
        'Build a structured plan to distribute critical knowledge across team members through pair programming, code walkthroughs, and guided module ownership handoffs.',
      action: 'create-knowledge-transfer-plan',
      view: 'knowledge-debt',
    },
    {
      title: 'Generate Learning Missions',
      description:
        'Create progressive learning missions that guide new contributors through the most critical modules, starting with low-risk areas and building up to complex systems.',
      action: 'generate-learning-missions',
      view: 'learning-missions',
    },
    {
      title: 'Create GitLab Issue',
      description:
        'File a high-priority GitLab issue documenting the survivability risks and creating actionable tasks for knowledge distribution, documentation, and ownership rebalancing.',
      action: 'create-gitlab-issue',
      view: 'gitlab-actions',
    },
    {
      title: 'Assign Ownership',
      description:
        'Redistribute module ownership across all contributors, starting with the highest-risk modules (Authentication, Payments, Infrastructure) that are currently owned by a single person.',
      action: 'assign-ownership',
      view: 'ownership',
    },
  ],
};