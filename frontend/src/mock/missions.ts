import type { Mission } from '@/types';

export const missions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Understand Authentication Flow',
    description:
      'Trace the complete authentication lifecycle from user login through JWT token generation, session establishment, middleware validation, and token refresh. Map all 12 involved files and document the decision points for OAuth providers vs. email/password authentication. This mission is critical because the auth system is the highest-risk module with a bus factor of 1.',
    difficulty: 'advanced',
    estimatedTime: '4-6 hours',
    modules: ['Authentication', 'API Gateway'],
    status: 'in-progress',
    progress: 35,
    prerequisites: ['Basic understanding of JWT tokens', 'Familiarity with Next.js middleware'],
  },
  {
    id: 'mission-2',
    title: 'Payment System Deep Dive',
    description:
      'Explore the end-to-end payment processing flow including Stripe integration, webhook signature verification, idempotency key management, refund handling, and partial capture logic. Understand how payment state transitions are managed and how failure recovery works. This module handles revenue-critical paths with minimal test coverage.',
    difficulty: 'expert',
    estimatedTime: '8-10 hours',
    modules: ['Payment Processing', 'API Gateway'],
    status: 'not-started',
    progress: 0,
    prerequisites: [
      'Understand Authentication Flow',
      'Familiarity with Stripe API',
      'Understanding of idempotency patterns',
    ],
  },
  {
    id: 'mission-3',
    title: 'Data Pipeline Architecture',
    description:
      'Learn how raw event data flows through the ETL pipeline — from Kafka topic consumption, through transformation layers with Pandas and dbt, into the analytics data warehouse. Understand the Airflow DAG scheduling, data quality checks, alerting thresholds, and backfill procedures. Document the schema evolution strategy and data lineage.',
    difficulty: 'intermediate',
    estimatedTime: '5-7 hours',
    modules: ['Data Pipeline'],
    status: 'in-progress',
    progress: 62,
    prerequisites: ['Basic SQL knowledge', 'Familiarity with Python data tools'],
  },
  {
    id: 'mission-4',
    title: 'Frontend Component Tree',
    description:
      'Map the complete React component hierarchy from the root layout down to leaf-level UI components. Understand the data flow patterns (props drilling vs. context vs. TanStack Query), shared component patterns, the custom design system, and the role-based rendering logic embedded in page components. Identify opportunities to extract reusable patterns.',
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    modules: ['Frontend Components'],
    status: 'completed',
    progress: 100,
    prerequisites: ['React fundamentals', 'Familiarity with TypeScript'],
  },
];
