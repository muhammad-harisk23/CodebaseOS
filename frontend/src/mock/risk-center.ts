interface RiskCenterData {
  topMetrics: {
    label: string;
    value: number;
    max: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }[];
  overallStatus: { risk: string; primaryConcern: string };
  riskCategories: {
    category: string;
    score: number;
    max: number;
    riskCount: number;
  }[];
  topRisks: {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium';
    affectedFiles: string[];
    recommendation: string;
    category: string;
  }[];
  trend: {
    date: string;
    knowledgeDebt: number;
    survivability: number;
    recoverability: number;
  }[];
}

export const riskCenterData: RiskCenterData = {
  topMetrics: [
    { label: 'Knowledge Debt', value: 82, max: 100, severity: 'critical' },
    { label: 'Survivability', value: 34, max: 100, severity: 'critical' },
    { label: 'Recoverability', value: 38, max: 100, severity: 'critical' },
    { label: 'Dependency Risk', value: 61, max: 100, severity: 'high' },
    { label: 'Architecture Risk', value: 73, max: 100, severity: 'high' },
    { label: 'Bus Factor', value: 1, max: 10, severity: 'critical' },
  ],
  overallStatus: {
    risk: 'HIGH',
    primaryConcern: 'Knowledge Concentration',
  },
  riskCategories: [
    { category: 'Architecture', score: 73, max: 100, riskCount: 3 },
    { category: 'Dependencies', score: 61, max: 100, riskCount: 2 },
    { category: 'Ownership', score: 85, max: 100, riskCount: 2 },
    { category: 'Documentation', score: 92, max: 100, riskCount: 2 },
    { category: 'Maintainability', score: 58, max: 100, riskCount: 1 },
    { category: 'Knowledge Debt', score: 81, max: 100, riskCount: 3 },
    { category: 'Recoverability', score: 38, max: 100, riskCount: 1 },
  ],
  topRisks: [
    {
      id: 'rc-risk-1',
      title: 'Undocumented Authentication System',
      severity: 'critical',
      affectedFiles: [
        'src/lib/auth.ts',
        'src/middleware/auth.ts',
        'src/api/auth/login/route.ts',
        'src/api/auth/register/route.ts',
        'src/api/auth/callback/route.ts',
        'src/api/auth/refresh/route.ts',
        'src/components/auth/SessionProvider.tsx',
        'src/components/auth/AuthGuard.tsx',
        'src/hooks/useAuth.ts',
        'src/utils/token.ts',
        'src/utils/permissions.ts',
        'src/server/session.ts',
      ],
      recommendation:
        'Create comprehensive auth documentation covering JWT lifecycle, OAuth flows, session management, and RBAC matrix. Target full coverage of all 12 auth files within 2 weeks.',
      category: 'Documentation',
    },
    {
      id: 'rc-risk-2',
      title: 'Single Contributor Owns 82% of Critical Code',
      severity: 'critical',
      affectedFiles: [
        'src/lib/payment/stripe.ts',
        'src/api/payment/webhook/route.ts',
        'src/api/payment/checkout/route.ts',
        'deploy/docker-compose.yml',
        'deploy/nginx.conf',
        '.github/workflows/deploy.yml',
      ],
      recommendation:
        'Immediately begin pair programming rotations for all critical modules. Assign a backup owner to each module and enforce cross-module PR reviews.',
      category: 'Ownership',
    },
    {
      id: 'rc-risk-3',
      title: 'Circular Dependencies in Service Layer',
      severity: 'high',
      affectedFiles: [
        'src/services/order-service.ts',
        'src/services/payment-service.ts',
        'src/services/inventory-service.ts',
        'src/services/notification-service.ts',
        'src/services/user-service.ts',
      ],
      recommendation:
        'Introduce an event-driven architecture to decouple services. Extract shared types into a dedicated domain types module and use dependency injection for cross-cutting concerns.',
      category: 'Architecture',
    },
    {
      id: 'rc-risk-4',
      title: '3 Known CVEs in Dependencies',
      severity: 'critical',
      affectedFiles: [
        'package.json',
        'package-lock.json',
      ],
      recommendation:
        'Immediately patch lodash@4.17.19, axios@0.21.0, and jsonwebtoken@8.5.1. Implement Dependabot for automated vulnerability detection and patching.',
      category: 'Dependencies',
    },
    {
      id: 'rc-risk-5',
      title: 'Payment Processing Has 7% Test Coverage',
      severity: 'high',
      affectedFiles: [
        'src/lib/payment/stripe.ts',
        'src/api/payment/webhook/route.ts',
        'src/api/payment/checkout/route.ts',
        'src/api/payment/refund/route.ts',
        'src/utils/payment-helpers.ts',
      ],
      recommendation:
        'Add integration tests with Stripe test mode for webhook handling, checkout flow, and refund logic. Target minimum 80% coverage for the payment module.',
      category: 'Maintainability',
    },
    {
      id: 'rc-risk-6',
      title: 'No Onboarding Documentation Exists',
      severity: 'critical',
      affectedFiles: [
        'README.md',
        'CONTRIBUTING.md',
      ],
      recommendation:
        'Generate a complete onboarding guide covering local setup, architecture overview, development workflow, and module ownership. Include video walkthroughs for complex modules.',
      category: 'Documentation',
    },
    {
      id: 'rc-risk-7',
      title: 'Hardcoded Secrets in Git History',
      severity: 'high',
      affectedFiles: [
        'src/lib/legacy-api-client.ts',
        'src/utils/email-provider.ts',
        '.env.example',
        'src/config/database.ts',
      ],
      recommendation:
        'Rotate all compromised credentials, implement truffleHog in CI pipeline, and add pre-commit hooks for secret scanning. Use proper secrets management (Vault or cloud-native).',
      category: 'Dependencies',
    },
    {
      id: 'rc-risk-8',
      title: 'Monolithic 4,200-Line Service File',
      severity: 'high',
      affectedFiles: [
        'src/services/main-service.ts',
      ],
      recommendation:
        'Decompose the monolithic service into domain-specific modules: OrderService, PaymentService, InventoryService, and NotificationService. Each should have clear boundaries and independent testability.',
      category: 'Architecture',
    },
    {
      id: 'rc-risk-9',
      title: 'Bus Factor of 1 for Core Modules',
      severity: 'critical',
      affectedFiles: [
        'src/lib/auth.ts',
        'src/lib/payment/stripe.ts',
        'src/infrastructure/deployment.ts',
        'src/config/database.ts',
      ],
      recommendation:
        'Cross-train at least one additional developer for each core module. Create knowledge transfer sessions and assign backup owners with regular commit requirements.',
      category: 'Ownership',
    },
    {
      id: 'rc-risk-10',
      title: '18% of Codebase Is Dead Code',
      severity: 'medium',
      affectedFiles: [
        'src/services/legacy/',
        'src/utils/deprecated/',
        'src/types/old-schema.ts',
        'src/lib/abandoned-grpc/',
      ],
      recommendation:
        'Audit and remove all dead code from previous architectural iterations. Create a cleanup sprint to delete unused files, types, and service stubs. Add linting rules to prevent future accumulation.',
      category: 'Knowledge Debt',
    },
  ],
  trend: [
    { date: '2024-10-21', knowledgeDebt: 74, survivability: 42, recoverability: 45 },
    { date: '2024-10-28', knowledgeDebt: 75, survivability: 41, recoverability: 44 },
    { date: '2024-11-04', knowledgeDebt: 76, survivability: 40, recoverability: 43 },
    { date: '2024-11-11', knowledgeDebt: 77, survivability: 39, recoverability: 42 },
    { date: '2024-11-18', knowledgeDebt: 78, survivability: 38, recoverability: 41 },
    { date: '2024-11-25', knowledgeDebt: 79, survivability: 37, recoverability: 40 },
    { date: '2024-12-02', knowledgeDebt: 79, survivability: 37, recoverability: 39 },
    { date: '2024-12-09', knowledgeDebt: 80, survivability: 36, recoverability: 39 },
    { date: '2024-12-16', knowledgeDebt: 80, survivability: 36, recoverability: 38 },
    { date: '2024-12-23', knowledgeDebt: 81, survivability: 35, recoverability: 38 },
    { date: '2024-12-30', knowledgeDebt: 82, survivability: 34, recoverability: 38 },
    { date: '2025-01-06', knowledgeDebt: 82, survivability: 34, recoverability: 38 },
  ],
};