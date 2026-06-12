interface KnowledgeGapPrediction {
  module: string;
  currentRisk: string;
  factors: string[];
  prediction: string;
  predictionSeverity: 'critical' | 'high' | 'medium' | 'low';
  timeToImpact: string;
  recommendedAction: string;
}

interface KnowledgeGapData {
  predictions: KnowledgeGapPrediction[];
}

export const knowledgeGapData: KnowledgeGapData = {
  predictions: [
    {
      module: 'Authentication',
      currentRisk: 'Critical — 92% single-owner, zero documentation',
      factors: [
        'Single contributor owns 92% of auth code',
        'Zero documentation across all 6 auth files',
        'JWT implementation has custom refresh logic not found in standard libraries',
        'No tests exist to serve as behavioral documentation',
      ],
      prediction:
        'High Onboarding Failure Risk — A new developer assigned to the authentication module has a 85% probability of introducing a security vulnerability within their first 2 weeks due to the lack of documentation and the complexity of the custom JWT refresh logic.',
      predictionSeverity: 'critical',
      timeToImpact: '2 weeks',
      recommendedAction:
        'Immediately generate comprehensive auth documentation and create a learning mission. Write characterization tests before any modifications are allowed.',
    },
    {
      module: 'Payment Processing',
      currentRisk: 'Critical — Revenue-critical with 7% test coverage',
      factors: [
        'Revenue-critical module with 7% test coverage',
        'Stripe webhook handling has no integration tests',
        'Idempotency key logic is undocumented and non-obvious',
        'Refund processing uses partial capture with no rollback strategy',
      ],
      prediction:
        'Production Incident Risk — There is a 70% probability of a payment processing failure within 3 months if any modifications are made without first establishing a comprehensive test suite. The lack of webhook integration tests means deployment regressions will only be caught in production.',
      predictionSeverity: 'critical',
      timeToImpact: '3 months',
      recommendedAction:
        'Create Stripe test mode integration tests before any feature work. Add monitoring alerts for webhook processing failures and payment success rate anomalies.',
    },
    {
      module: 'Order Management',
      currentRisk: 'High — Complex state machine with circular dependencies',
      factors: [
        'Order state machine has 7 states with undocumented transition guards',
        'Participates in circular dependency cycle with payment and inventory services',
        '4,200-line monolithic service file with no module boundaries',
        'Business logic for tiered pricing is embedded in multiple places inconsistently',
      ],
      prediction:
        'Regression Risk — Any modification to the order state machine has a 60% probability of introducing a regression in an unstated transition path. The circular dependency with payment and inventory means changes to either module can silently break order processing.',
      predictionSeverity: 'high',
      timeToImpact: '1 month',
      recommendedAction:
        'Extract the order state machine into a dedicated finite state machine library with explicit state transition definitions. Break the circular dependency by introducing an event-driven mediator pattern.',
    },
    {
      module: 'Deployment Pipeline',
      currentRisk: 'High — Infrastructure knowledge held by one person',
      factors: [
        'Only Carol Wang understands the Docker and Nginx configuration',
        'No infrastructure-as-code — all deployment config is manual',
        'No rollback strategy documented or automated',
        'Environment variables are managed through a spreadsheet shared via email',
      ],
      prediction:
        'Deployment Failure Risk — If the sole infrastructure owner becomes unavailable, the team has a 75% probability of being unable to deploy within 48 hours. The manual deployment configuration means any infrastructure issue will require hours of investigation.',
      predictionSeverity: 'high',
      timeToImpact: 'Immediate',
      recommendedAction:
        'Immediately document the complete deployment pipeline and create a runbook for common deployment scenarios. Migrate infrastructure configuration to Terraform or Pulumi for version-controlled, reproducible deployments.',
    },
    {
      module: 'Database Schema',
      currentRisk: 'Medium — Schema understood but migration strategy is not',
      factors: [
        'Prisma schema is well-defined with 18 tables and clear relationships',
        'Soft-delete pattern is inconsistent across tables',
        'Migration history lacks descriptive comments',
        'No documented rollback strategy for schema changes',
      ],
      prediction:
        'Migration Risk — There is a 45% probability of a failed migration within 6 months due to the lack of documented rollback strategies and inconsistent soft-delete patterns. Adding new columns or tables to the schema carries moderate risk of data loss.',
      predictionSeverity: 'medium',
      timeToImpact: '6 months',
      recommendedAction:
        'Document the migration strategy with rollback procedures for each table. Standardize the soft-delete pattern across all tables using a Prisma middleware extension.',
    },
    {
      module: 'Product Catalog',
      currentRisk: 'Medium — Architecture is sound but variant logic is complex',
      factors: [
        'Product catalog uses a well-structured server component pattern',
        'Variant pricing logic has 3 layers of discounts that are hard to reason about',
        'Cloudinary image URLs are generated dynamically with undocumented transformation parameters',
        'Search and filtering logic uses raw SQL with no test coverage',
      ],
      prediction:
        "Feature Delivery Risk — The product review feature (the client's primary request) will likely take 40% longer than estimated due to the undocumented variant system and the need to integrate reviews into the existing product data model without breaking the pricing discount chain.",
      predictionSeverity: 'medium',
      timeToImpact: '2 weeks',
      recommendedAction:
        'Document the complete variant pricing calculation with examples for each discount layer. Create a Prisma schema extension plan for the review system that accounts for the existing product-variant relationship.',
    },
    {
      module: 'Email & Notifications',
      currentRisk: 'Low — Simple module with clear boundaries',
      factors: [
        'Well-encapsulated email service with typed methods for each template',
        'Uses React Email for template rendering with clear separation of concerns',
        'Queue-based delivery prevents request blocking',
        'Only integration is Resend API which has excellent documentation',
      ],
      prediction:
        'Low Risk — The email module has clear boundaries, typed interfaces, and a simple integration with Resend. Modifications to add new email types or update existing templates carry minimal risk of regression or side effects.',
      predictionSeverity: 'low',
      timeToImpact: 'N/A',
      recommendedAction:
        'Continue following the established pattern for new email types. Consider adding template preview endpoints for non-developers to review email designs before deployment.',
    },
    {
      module: 'Frontend Components',
      currentRisk: 'Low — Standard React patterns with some inconsistency',
      factors: [
        'Uses a mix of server and client components following Next.js conventions',
        'Some state management inconsistency between Zustand and local state',
        'Design system components are well-structured but not formally documented',
        'No component storybook or visual regression testing',
      ],
      prediction:
        'Low Risk — The frontend component layer follows standard Next.js patterns and the inconsistencies are cosmetic rather than architectural. New features can be built using existing component patterns with minimal risk of breaking existing functionality.',
      predictionSeverity: 'low',
      timeToImpact: 'N/A',
      recommendedAction:
        'Standardize on Zustand for all shared client state and local state for isolated component state. Add Storybook for component documentation and visual regression testing during the engagement.',
    },
  ],
};
