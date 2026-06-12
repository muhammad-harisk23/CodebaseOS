// Mock data for Knowledge Debt Breakdown page

interface DebtCategory {
  id: string;
  label: string;
  score: number;
  max: number;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  icon: string;
}

interface TrendPoint {
  date: string;
  value: number;
}

interface RadarPoint {
  category: string;
  value: number;
  fullMark: number;
}

interface DebtInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  action: string;
}

export const debtBreakdown: DebtCategory[] = [
  {
    id: 'debt-1',
    label: 'Documentation Debt',
    score: 92,
    max: 100,
    description:
      'Critical lack of inline documentation, missing README sections, and undocumented API contracts. Only 8% of public functions have JSDoc comments.',
    severity: 'critical',
    icon: 'FileX',
  },
  {
    id: 'debt-2',
    label: 'Architecture Debt',
    score: 74,
    max: 100,
    description:
      'Architecture decision records (ADRs) are missing for 6 of 12 modules. System-level diagrams exist but are outdated by 3 months.',
    severity: 'high',
    icon: 'LayoutGrid',
  },
  {
    id: 'debt-3',
    label: 'Dependency Debt',
    score: 68,
    max: 100,
    description:
      '3 dependencies have known vulnerabilities. 5 packages are more than 2 major versions behind. Migration paths are not documented.',
    severity: 'high',
    icon: 'Package',
  },
  {
    id: 'debt-4',
    label: 'Ownership Debt',
    score: 85,
    max: 100,
    description:
      '15% of the codebase has no active maintainer. Payment and authentication modules have single points of failure with only one knowledgeable developer each.',
    severity: 'critical',
    icon: 'Users',
  },
  {
    id: 'debt-5',
    label: 'Knowledge Distribution Debt',
    score: 78,
    max: 100,
    description:
      'Knowledge is heavily concentrated in 3 senior developers who hold 72% of critical system understanding. No structured onboarding documentation exists.',
    severity: 'high',
    icon: 'Share2',
  },
  {
    id: 'debt-6',
    label: 'Code Complexity Debt',
    score: 71,
    max: 100,
    description:
      'Average cyclomatic complexity is 14.2 (threshold: 10). The order processing pipeline and webhook handler contain deeply nested conditional logic.',
    severity: 'high',
    icon: 'GitBranch',
  },
];

export const debtTrend: TrendPoint[] = [
  { date: '2024-09-09', value: 62 },
  { date: '2024-09-16', value: 65 },
  { date: '2024-09-23', value: 68 },
  { date: '2024-09-30', value: 71 },
  { date: '2024-10-07', value: 69 },
  { date: '2024-10-14', value: 73 },
  { date: '2024-10-21', value: 76 },
  { date: '2024-10-28', value: 74 },
  { date: '2024-11-04', value: 78 },
  { date: '2024-11-11', value: 77 },
  { date: '2024-11-18', value: 80 },
  { date: '2024-11-25', value: 81 },
];

export const debtRadarData: RadarPoint[] = [
  { category: 'Documentation', value: 8, fullMark: 100 },
  { category: 'Complexity', value: 35, fullMark: 100 },
  { category: 'Ownership', value: 22, fullMark: 100 },
  { category: 'Architecture', value: 28, fullMark: 100 },
  { category: 'Dependencies', value: 42, fullMark: 100 },
  { category: 'Knowledge Distribution', value: 18, fullMark: 100 },
];

export const debtInsights: DebtInsight[] = [
  {
    id: 'insight-1',
    title: 'Documentation coverage is critically low',
    description:
      'Only 8% of public-facing functions have JSDoc comments. The API reference is auto-generated but incomplete — 31 of 47 endpoints lack response schema documentation.',
    severity: 'critical',
    action:
      'Prioritize documenting all 47 API endpoints with request/response schemas, then add JSDoc to all exported functions across the 12 modules.',
  },
  {
    id: 'insight-2',
    title: 'Knowledge is dangerously concentrated',
    description:
      'Three senior developers (sarah.chen, alex.rivera, mike.okonkwo) hold 72% of the critical system knowledge. If any of them leave, 5+ modules become high-risk.',
    severity: 'critical',
    action:
      'Implement pair-programming rotations and require documentation of architectural decisions by all team members. Create video walkthroughs for top 5 critical modules.',
  },
  {
    id: 'insight-3',
    title: 'Payment module is a single point of failure',
    description:
      'Only sarah.chen has deep understanding of the Stripe integration including webhook handling, refund flows, and subscription lifecycle management.',
    severity: 'high',
    action:
      'Assign a second developer to shadow sarah.chen on all payment-related tasks. Document the complete Stripe flow with sequence diagrams and decision trees.',
  },
  {
    id: 'insight-4',
    title: 'Vulnerable dependencies need immediate patching',
    description:
      'jsonwebtoken (8.5.1) and lodash (4.17.20) have known CVEs with severity scores above 7.0. These are used in authentication and data processing paths.',
    severity: 'high',
    action:
      'Upgrade jsonwebtoken to 9.0.2 and lodash to 4.17.21 immediately. Run the full test suite after upgrades and verify no breaking changes in auth flows.',
  },
  {
    id: 'insight-5',
    title: 'Order processing pipeline exceeds complexity threshold',
    description:
      'The order processing module has a cyclomatic complexity of 14.2 with 7 levels of nested conditionals handling edge cases for discounts, taxes, inventory, and shipping.',
    severity: 'medium',
    action:
      'Refactor the order processing pipeline using the strategy pattern to separate discount, tax, and shipping calculation into distinct, testable handler classes.',
  },
  {
    id: 'insight-6',
    title: 'No onboarding path for new developers',
    description:
      'There is no structured onboarding documentation. New developers take an estimated 3-4 weeks to become productive. Critical context exists only in team members\' heads.',
    severity: 'high',
    action:
      'Create a developer onboarding guide with environment setup, architecture overview, key module walkthroughs, and a curated list of "must-read" files for each module.',
  },
];