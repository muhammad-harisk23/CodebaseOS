interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  actionView: string;
  affectedModules: string[];
  estimatedEffort: string;
  impact: string;
}

interface RecommendationsData {
  high: Recommendation[];
  medium: Recommendation[];
  low: Recommendation[];
}

export const recommendationsData: RecommendationsData = {
  high: [
    {
      id: 'rec-1',
      title: 'Patch Critical Dependency Vulnerabilities',
      description:
        'Three production dependencies have known CVEs: jsonwebtoken@8.5.1 (token verification bypass), lodash@4.17.19 (prototype pollution), and axios@0.21.0 (SSRF). The jsonwebtoken vulnerability directly affects the authentication system and could allow forged tokens to bypass authorization checks. These should be patched immediately before any feature work begins.',
      priority: 'high',
      action: 'View affected files and patch plan',
      actionView: 'risk-center',
      affectedModules: ['Authentication', 'API Gateway', 'Infrastructure'],
      estimatedEffort: '2-3 hours',
      impact: 'Eliminates 3 known security vulnerabilities, including a critical auth bypass vector.',
    },
    {
      id: 'rec-2',
      title: 'Generate Authentication System Documentation',
      description:
        'The authentication module is the highest-risk subsystem with a bus factor of 1, zero documentation, and custom JWT refresh logic. Without documentation, any modification carries a 85% probability of introducing a security regression. Generating comprehensive documentation is the highest-impact action to reduce knowledge debt in the codebase.',
      priority: 'high',
      action: 'Generate auth documentation',
      actionView: 'documentation',
      affectedModules: ['Authentication', 'API Gateway', 'Middleware'],
      estimatedEffort: '3-4 hours',
      impact: 'Reduces auth module knowledge debt from 100% to under 20%. Enables safe modifications by secondary owners.',
    },
    {
      id: 'rec-3',
      title: 'Break Circular Dependency in Service Layer',
      description:
        'The order-service → payment-service → inventory-service → notification-service → user-service → order-service circular dependency makes isolated testing impossible and causes deployment fragility. This architectural issue has caused two production incidents in the past quarter and will continue to cause problems as the codebase grows.',
      priority: 'high',
      action: 'View architecture analysis',
      actionView: 'architecture',
      affectedModules: ['Order Management', 'Payment Processing', 'Inventory', 'Notifications'],
      estimatedEffort: '1-2 days',
      impact: 'Enables isolated unit testing of all 5 services. Eliminates deployment ordering fragility.',
    },
    {
      id: 'rec-4',
      title: 'Assign Secondary Owners to Critical Modules',
      description:
        'Both the authentication and payment modules have a bus factor of 1 with over 90% ownership concentration. If the primary owner becomes unavailable, the team cannot safely modify or respond to incidents in these revenue-critical modules. Cross-training must begin immediately to mitigate this existential risk.',
      priority: 'high',
      action: 'View ownership map',
      actionView: 'ownership',
      affectedModules: ['Authentication', 'Payment Processing', 'Deployment Pipeline'],
      estimatedEffort: '2-3 weeks (ongoing)',
      impact: 'Raises bus factor from 1 to 2 for all critical modules. Reduces single-point-of-failure risk by 60%.',
    },
  ],
  medium: [
    {
      id: 'rec-5',
      title: 'Write Characterization Tests Before Feature Development',
      description:
        'Before implementing the client\'s requested features (product reviews and multi-currency), establish a safety net of characterization tests that capture the current behavior of all affected modules. These tests serve as a regression detector and enable confident refactoring of the inconsistent patterns identified during analysis.',
      priority: 'medium',
      action: 'View testing recommendations',
      actionView: 'survivability',
      affectedModules: ['Authentication', 'Payment Processing', 'Product Catalog', 'Business Logic'],
      estimatedEffort: '2-3 days',
      impact: 'Prevents regressions during feature development. Catches unintended side effects before production deployment.',
    },
    {
      id: 'rec-6',
      title: 'Standardize Architecture Patterns and Document in ADRs',
      description:
        'The codebase exhibits multiple inconsistent patterns from different AI generation contexts. Standardize on service layer for data access, Zustand for client state, centralized error handling, and document these decisions in Architecture Decision Records. This prevents future pattern divergence.',
      priority: 'medium',
      action: 'View architecture analysis',
      actionView: 'architecture',
      affectedModules: ['Frontend Components', 'API Gateway', 'Services'],
      estimatedEffort: '1 day',
      impact: 'Reduces architectural inconsistency by 70%. Makes the codebase predictable for all contributors.',
    },
    {
      id: 'rec-7',
      title: 'Remove Dead Code from Previous Architectural Iterations',
      description:
        'Approximately 18% of the codebase is dead code from previous iterations, including a legacy gRPC client, deprecated utilities, old type definitions, and unused component variants. This dead code increases cognitive load, misleads new developers, and inflates bundle size.',
      priority: 'medium',
      action: 'View dead code inventory',
      actionView: 'risk-center',
      affectedModules: ['Infrastructure', 'Utilities', 'Components', 'Types'],
      estimatedEffort: '4-6 hours',
      impact: 'Reduces codebase size by 18%. Eliminates confusion from outdated patterns. Improves build performance.',
    },
    {
      id: 'rec-8',
      title: 'Set Up Automated Dependency Scanning in CI/CD',
      description:
        'No automated vulnerability detection is currently configured. Adding Dependabot or Snyk to the CI pipeline would catch new vulnerabilities before they reach production and provide automated patch suggestions for known CVEs across all direct and transitive dependencies.',
      priority: 'medium',
      action: 'View GitLab integration',
      actionView: 'gitlab-actions',
      affectedModules: ['Infrastructure', 'CI/CD'],
      estimatedEffort: '2-3 hours',
      impact: 'Prevents future vulnerability accumulation. Automates security patching workflow.',
    },
  ],
  low: [
    {
      id: 'rec-9',
      title: 'Standardize Soft-Delete Pattern Across Database Tables',
      description:
        'The soft-delete pattern using a deletedAt column is inconsistently applied across the 18 database tables. Some tables use hard deletes, others use soft deletes with no Prisma middleware. Standardizing this pattern reduces the risk of accidental data loss during development.',
      priority: 'low',
      action: 'View database schema',
      actionView: 'architecture',
      affectedModules: ['Database'],
      estimatedEffort: '1-2 hours',
      impact: 'Prevents accidental data loss. Creates consistent query patterns across the codebase.',
    },
    {
      id: 'rec-10',
      title: 'Add Storybook for Component Documentation',
      description:
        'The design system components lack visual documentation and there is no component library reference. Adding Storybook would provide a living documentation for all shared components and enable visual regression testing to catch unintended UI changes during feature development.',
      priority: 'low',
      action: 'View component inventory',
      actionView: 'architecture',
      affectedModules: ['Frontend Components'],
      estimatedEffort: '1-2 days',
      impact: 'Provides visual component reference. Enables non-developers to review UI designs. Catches visual regressions.',
    },
    {
      id: 'rec-11',
      title: 'Document Cloudinary Image Transformation Parameters',
      description:
        'Product images use Cloudinary with dynamic URL transformation parameters that are not documented anywhere in the codebase. Adding documentation for the transformation parameter format (width, height, crop, quality, format) makes it easier for developers to generate correct image URLs.',
      priority: 'low',
      action: 'View product catalog analysis',
      actionView: 'knowledge-graph',
      affectedModules: ['Product Catalog'],
      estimatedEffort: '30 min',
      impact: 'Reduces trial-and-error when generating image URLs. Prevents broken image displays in new feature development.',
    },
  ],
};
