interface AgentFeedItem {
  id: string;
  timestamp: string;
  type: 'detection' | 'reasoning' | 'action' | 'risk' | 'insight';
  module: string;
  title: string;
  reasoning: string;
  confidence: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'info';
  action?: string;
  actionView?: string;
}

export const agentFeedItems: AgentFeedItem[] = [
  {
    id: 'af-1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'detection',
    module: 'Repository',
    title: 'Repository Connected Successfully',
    reasoning:
      'Established read-only connection to the GitLab repository via SSH key authentication. Repository metadata confirms 47 total commits across 3 contributors, with the last push occurring 14 hours ago. The repository size is 12.4 MB with a clean working tree.',
    confidence: 1.0,
    riskLevel: 'info',
  },
  {
    id: 'af-2',
    timestamp: new Date(Date.now() - 1 * 55 * 60 * 1000).toISOString(),
    type: 'detection',
    module: 'Repository',
    title: 'Repository Parsing Started — 12 Files, 1,847 Lines',
    reasoning:
      'Initial scan identified 12 source files across 4 directories totaling 1,847 lines of TypeScript and JavaScript code. File type breakdown: 7 TypeScript files, 3 TSX component files, and 2 configuration files. The largest file is src/services/main-service.ts at 4,200 lines, which exceeds the recommended threshold of 500 lines per module.',
    confidence: 0.98,
    riskLevel: 'info',
  },
  {
    id: 'af-3',
    timestamp: new Date(Date.now() - 1 * 48 * 60 * 1000).toISOString(),
    type: 'detection',
    module: 'AST Analysis',
    title: 'Authentication Patterns Detected in 6 Files',
    reasoning:
      'Abstract Syntax Tree analysis identified JWT token verification, session management, and OAuth callback handling spread across 6 files. The patterns suggest a multi-provider authentication system with email/password, Google OAuth, and GitHub SSO support. Cross-referencing with import trees reveals these files form a tightly coupled cluster with no clear interface boundaries.',
    confidence: 0.94,
    riskLevel: 'medium',
  },
  {
    id: 'af-4',
    timestamp: new Date(Date.now() - 1 * 40 * 60 * 1000).toISOString(),
    type: 'risk',
    module: 'Authentication',
    title: 'JWT Authentication System Detected — Critical Complexity',
    reasoning:
      'The authentication subsystem implements custom JWT generation, refresh token rotation, and multi-provider OAuth with no abstraction layer. Token expiry handling uses hardcoded values scattered across 4 files rather than centralized configuration. The refresh token flow contains a race condition pattern where concurrent requests can trigger duplicate token issuance, which is a known security vulnerability in production environments.',
    confidence: 0.91,
    riskLevel: 'critical',
  },
  {
    id: 'af-5',
    timestamp: new Date(Date.now() - 1 * 30 * 60 * 1000).toISOString(),
    type: 'reasoning',
    module: 'Ownership',
    title: 'Ownership Analysis: Auth Module 92% Owned by Alice Chen',
    reasoning:
      'Git blame analysis reveals Alice Chen authored 92% of authentication-related commits, with Bob Martinez contributing only 8% through minor configuration changes. The last commit by anyone other than Alice was 67 days ago. This extreme ownership concentration means any unplanned absence of Alice would leave the team unable to safely modify authentication logic, upgrade dependencies, or respond to security incidents.',
    confidence: 0.96,
    riskLevel: 'critical',
  },
  {
    id: 'af-6',
    timestamp: new Date(Date.now() - 1 * 22 * 60 * 1000).toISOString(),
    type: 'risk',
    module: 'Ownership',
    title: 'Knowledge Concentration Risk Detected',
    reasoning:
      'Cross-referencing ownership data with commit frequency and code review history reveals that knowledge is dangerously concentrated in 2 of 3 contributors. Alice Chen holds domain expertise in auth and payments, while Carol Wang exclusively understands the deployment pipeline and database schema. Only Bob Martinez has cross-module knowledge, but his commit frequency has dropped 80% over the past quarter.',
    confidence: 0.89,
    riskLevel: 'high',
  },
  {
    id: 'af-7',
    timestamp: new Date(Date.now() - 1 * 15 * 60 * 1000).toISOString(),
    type: 'insight',
    module: 'Documentation',
    title: 'Documentation Coverage Calculated: 8%',
    reasoning:
      'Scanned all 12 source files for JSDoc comments, README sections, inline documentation, and external documentation references. Only 1 of 12 files contains any form of documentation, and it is limited to a single function-level comment. The authentication module, which handles the most security-sensitive code paths, has zero documentation. This level of documentation coverage makes onboarding new developers extremely slow and error-prone.',
    confidence: 0.95,
    riskLevel: 'high',
  },
  {
    id: 'af-8',
    timestamp: new Date(Date.now() - 1 * 8 * 60 * 1000).toISOString(),
    type: 'risk',
    module: 'Bus Factor',
    title: 'Bus Factor Risk: 1 Out of 3 Contributors',
    reasoning:
      'Calculated bus factor by determining the minimum number of contributors whose departure would critically impair development velocity. With Alice Chen owning authentication and payment modules, and Carol Wang exclusively managing infrastructure, losing either one would halt progress on their respective domains. The effective bus factor is 1 despite having 3 contributors, because only Bob has any cross-module familiarity.',
    confidence: 0.93,
    riskLevel: 'critical',
  },
  {
    id: 'af-9',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: 'risk',
    module: 'Architecture',
    title: 'Circular Dependency Detected in Service Layer',
    reasoning:
      'Dependency graph analysis uncovered a circular import chain: order-service.ts imports payment-service.ts, which imports inventory-service.ts, which imports notification-service.ts, which imports user-service.ts, which imports order-service.ts. This cycle creates initialization order fragility, makes testing individual services in isolation nearly impossible, and has caused two production incidents in the past quarter where service startup order changes broke deployments.',
    confidence: 0.97,
    riskLevel: 'high',
  },
  {
    id: 'af-10',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'insight',
    module: 'Risk Analysis',
    title: 'Risk Analysis Completed — 6 Risks Identified',
    reasoning:
      'Consolidated findings from AST analysis, ownership mapping, documentation scanning, and dependency graph traversal into a unified risk assessment. Of the 6 identified risks, 3 are rated critical (undocumented auth, knowledge concentration, bus factor), 2 are high (circular dependencies, low test coverage in payments), and 1 is medium (dead code accumulation). The combined risk score places this repository in the 95th percentile of risk compared to similar-sized projects in our benchmark dataset.',
    confidence: 0.88,
    riskLevel: 'high',
  },
  {
    id: 'af-11',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    type: 'reasoning',
    module: 'Documentation',
    title: 'Documentation Gap: Authentication Has Zero Documentation',
    reasoning:
      'The authentication module contains 6 interconnected files with complex JWT lifecycle management, multi-provider OAuth flows, session persistence, and role-based access control logic. Despite being the most security-critical subsystem, it has no README, no architectural decision records, no inline comments explaining token rotation logic, and no test files that could serve as implicit documentation. This represents the single highest-priority documentation gap in the entire codebase.',
    confidence: 0.99,
    riskLevel: 'critical',
  },
  {
    id: 'af-12',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: 'action',
    module: 'Documentation',
    title: 'Generated Authentication Documentation',
    reasoning:
      'Based on the critical documentation gap identified in the authentication module, generated comprehensive documentation covering JWT token lifecycle (generation, validation, refresh, revocation), OAuth provider integration patterns, session management behavior, middleware chain execution order, and RBAC permission matrix. The documentation includes sequence diagrams, data flow descriptions, and configuration reference tables to serve as both onboarding material and a living reference for the team.',
    confidence: 0.87,
    riskLevel: 'medium',
    action: 'View generated documentation',
    actionView: 'documentation',
  },
  {
    id: 'af-13',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: 'action',
    module: 'GitLab',
    title: 'Created GitLab Issue #142 for Auth Documentation Review',
    reasoning:
      'Automatically created a GitLab issue to assign the generated authentication documentation for human review and validation. The issue includes a checklist for verifying accuracy of JWT flow descriptions, confirming OAuth provider configurations, and cross-referencing security assumptions with the team. Assigned to Alice Chen as the primary reviewer with Carol Wang as a secondary reviewer to build cross-module knowledge.',
    confidence: 0.91,
    riskLevel: 'low',
    action: 'View GitLab issue #142',
    actionView: 'gitlab-actions',
  },
  {
    id: 'af-14',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    type: 'action',
    module: 'Learning',
    title: 'Generated Learning Mission for Authentication System',
    reasoning:
      'Created a structured learning mission targeting the authentication subsystem to address the bus factor risk. The mission guides a new team member through understanding JWT flows, OAuth integration, session management, and the role-based access control matrix in a progressive difficulty sequence. Estimated completion time is 4-6 hours, with prerequisite missions on TypeScript fundamentals and Next.js middleware already available in the learning catalog.',
    confidence: 0.85,
    riskLevel: 'medium',
    action: 'View learning mission',
    actionView: 'learning-missions',
  },
  {
    id: 'af-15',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'action',
    module: 'Knowledge Transfer',
    title: 'Knowledge Transfer Plan Generated',
    reasoning:
      'Synthesized all analysis findings into a comprehensive knowledge transfer plan with 18 discrete tasks across 5 categories: documentation generation, ownership rebalancing, structured learning missions, GitLab workflow integration, and test coverage improvement. The plan prioritizes critical-risk modules first, with an estimated total effort of 40 hours distributed over 4 weeks. Each task includes assignee recommendations, effort estimates, and dependency ordering to maximize knowledge spread with minimal disruption to ongoing development.',
    confidence: 0.82,
    riskLevel: 'medium',
    action: 'View transfer plan',
    actionView: 'freelancer-rescue',
  },
];
