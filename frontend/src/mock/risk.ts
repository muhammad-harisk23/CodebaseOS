import type { RiskItem } from '@/types';

export const risks: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Undocumented Authentication System',
    severity: 'critical',
    category: 'Documentation',
    description:
      'The authentication system spans 12 files across 4 directories with zero documentation. JWT token generation, session management, OAuth callbacks, role-based access control, and password reset flows are all implemented with no inline comments, no ADRs, and no architectural overview. Only one developer understands the complete flow end-to-end.',
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
      'Create a comprehensive authentication architecture document covering token lifecycle, session management strategy, OAuth integration details, and role-based access control matrix. Add inline documentation to all auth files and create an ADR for the chosen authentication approach.',
    status: 'open',
    detectedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'risk-2',
    title: 'Single Contributor Dependency on Lead Developer',
    severity: 'critical',
    category: 'Personnel',
    description:
      'One developer (sarah.chen) owns 78% of commits across the most critical modules: authentication, payment processing, and deployment pipeline. Their departure would create an immediate knowledge vacuum with no documented fallback procedures. Historical commit analysis shows no other contributor has touched the payment integration code in the past 14 months.',
    affectedFiles: [
      'src/lib/payment/stripe.ts',
      'src/api/payment/webhook/route.ts',
      'src/api/payment/checkout/route.ts',
      'deploy/docker-compose.yml',
      'deploy/nginx.conf',
      '.github/workflows/deploy.yml',
    ],
    recommendation:
      'Implement pair programming rotations for critical modules. Create video walkthroughs of complex flows. Establish a weekly knowledge-sharing session. Ensure at least 2 developers review every PR in critical modules.',
    status: 'acknowledged',
    detectedAt: '2025-01-08T14:30:00Z',
  },
  {
    id: 'risk-3',
    title: 'Missing Test Coverage in Payment Module',
    severity: 'high',
    category: 'Testing',
    description:
      'The payment processing module has 7% test coverage with only 3 unit tests, all testing trivial utility functions. Critical paths — Stripe webhook verification, idempotency key handling, refund processing, and partial capture logic — have zero test coverage. A regression in payment processing could directly impact revenue.',
    affectedFiles: [
      'src/lib/payment/stripe.ts',
      'src/api/payment/webhook/route.ts',
      'src/api/payment/checkout/route.ts',
      'src/api/payment/refund/route.ts',
      'src/utils/payment-helpers.ts',
    ],
    recommendation:
      'Prioritize integration tests with Stripe test mode for webhook handling, checkout flow, and refund logic. Add unit tests for idempotency and partial capture. Target minimum 80% coverage for the payment module within the next sprint.',
    status: 'open',
    detectedAt: '2025-01-09T10:15:00Z',
  },
  {
    id: 'risk-4',
    title: 'Circular Dependencies in Service Layer',
    severity: 'high',
    category: 'Architecture',
    description:
      'Static analysis detected 8 circular dependency chains in the service layer. The most problematic cycle involves OrderService → PaymentService → InventoryService → OrderService, creating tight coupling that makes individual modules difficult to test, reason about, or replace. These cycles also cause intermittent module resolution issues during development builds.',
    affectedFiles: [
      'src/services/order-service.ts',
      'src/services/payment-service.ts',
      'src/services/inventory-service.ts',
      'src/services/notification-service.ts',
      'src/services/user-service.ts',
    ],
    recommendation:
      'Introduce an event-driven architecture using an internal event bus to decouple order, payment, and inventory services. Break circular imports by extracting shared types into a dedicated @/types/domain module. Use dependency injection for cross-cutting concerns.',
    status: 'open',
    detectedAt: '2025-01-11T16:00:00Z',
  },
  {
    id: 'risk-5',
    title: 'Hardcoded Secrets in Source Code',
    severity: 'medium',
    category: 'Security',
    description:
      'Found 4 instances of hardcoded API keys and secrets in the repository history. While 2 have been replaced with environment variables, the secret values remain in git history. Additionally, the .env.example file contains what appears to be actual production database credentials rather than placeholder values.',
    affectedFiles: [
      'src/lib/legacy-api-client.ts',
      'src/utils/email-provider.ts',
      '.env.example',
      'src/config/database.ts',
    ],
    recommendation:
      'Rotate all compromised credentials immediately. Implement git-secrets or truffleHog in CI pipeline to prevent future commits. Use a proper secrets management solution (HashiCorp Vault or cloud-native equivalent). Add pre-commit hooks for secret scanning.',
    status: 'acknowledged',
    detectedAt: '2025-01-07T12:00:00Z',
  },
  {
    id: 'risk-6',
    title: 'Outdated Dependencies with Known Vulnerabilities',
    severity: 'medium',
    category: 'Security',
    description:
      'The project has 23 outdated dependencies, 3 of which have published CVEs: lodash@4.17.19 (prototype pollution), axios@0.21.0 (SSRF vulnerability), and jsonwebtoken@8.5.1 (weak key generation). Additionally, 8 minor dependencies have not been updated in over 2 years, increasing compatibility risk for future upgrades.',
    affectedFiles: [
      'package.json',
      'package-lock.json',
      'yarn.lock',
    ],
    recommendation:
      'Immediately patch the 3 CVE-affected dependencies. Create a quarterly dependency audit cadence. Implement Dependabot or Renovate for automated PR generation. Test updates in a staging environment before merging to catch breaking changes.',
    status: 'open',
    detectedAt: '2025-01-12T09:45:00Z',
  },
];
