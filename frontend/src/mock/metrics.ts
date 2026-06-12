import type { MetricData } from '@/types';

export const dashboardMetrics: MetricData[] = [
  {
    label: 'Knowledge Debt Score',
    value: 81,
    max: 100,
    unit: '/100',
    trend: 'up',
    trendValue: 12.4,
    description:
      'Knowledge debt measures how much critical institutional knowledge exists only in developers\' heads rather than in documentation, tests, or code structure. A score above 70 indicates severe risk of knowledge loss. This repo has accumulated significant undocumented complexity, especially in authentication and payment modules.',
    severity: 'critical',
  },
  {
    label: 'Survivability Score',
    value: 34,
    max: 100,
    unit: '/100',
    trend: 'down',
    trendValue: -8.2,
    description:
      'Survivability assesses how well the codebase would survive the sudden departure of its most critical contributor. With a bus factor of 1 and minimal documentation, the project is at high risk. Key areas of concern: authentication flows (12 files, 0 docs), payment integration (8 files, 0 docs), and deployment scripts (undocumented manual process).',
    severity: 'critical',
  },
  {
    label: 'Recoverability Score',
    value: 38,
    max: 100,
    unit: '/100',
    trend: 'stable',
    trendValue: 0.5,
    description:
      'Recoverability measures how quickly a new developer could reconstruct lost knowledge. Factors include test coverage (23%), inline documentation (8%), commit message quality (poor), and architectural decision records (none). The codebase would require an estimated 6-8 weeks of dedicated onboarding to reach basic productivity.',
    severity: 'critical',
  },
  {
    label: 'Bus Factor',
    value: 1,
    max: 10,
    unit: '/10',
    trend: 'down',
    trendValue: -1,
    description:
      'Bus factor counts the minimum number of developers who would need to leave before the project is in serious trouble. Currently, only one developer understands the authentication system, payment integration, and deployment pipeline. This single point of failure puts the entire platform at risk.',
    severity: 'critical',
  },
];
