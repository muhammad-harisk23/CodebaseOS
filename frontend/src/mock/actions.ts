import type { AgentAction } from '@/types';

export const agentActions: AgentAction[] = [
  {
    id: 'action-1',
    type: 'documentation',
    title: 'Generate Authentication Module Documentation',
    description:
      'Automatically analyzed the 12 authentication-related files and generated comprehensive documentation covering JWT token lifecycle, OAuth callback flows, session management, and RBAC permission matrix. The output includes an architecture overview, sequence diagrams, and inline code comments.',
    status: 'completed',
    createdAt: '2025-01-14T08:00:00Z',
    completedAt: '2025-01-14T09:45:00Z',
    result:
      'Generated 3 documentation files: auth-architecture.md (overview), auth-token-flow.md (sequence diagram), and auth-rbac-matrix.md (permissions). Inline JSDoc comments added to 8 of 12 files. Remaining 4 files require manual review due to complex conditional logic.',
  },
  {
    id: 'action-2',
    type: 'issue-creation',
    title: 'Create GitLab Issues for Top 5 Risks',
    description:
      'Based on the risk analysis of the repository, automatically created prioritized GitLab issues with detailed descriptions, acceptance criteria, and labels. Each issue maps to a specific detected risk and includes actionable remediation steps.',
    status: 'completed',
    createdAt: '2025-01-13T10:00:00Z',
    completedAt: '2025-01-13T10:30:00Z',
    result:
      'Created 5 GitLab issues: #142 (Document Authentication Module, critical), #139 (Add Payment Tests, high), #145 (Reduce Circular Dependencies, high), #148 (Update Dependencies, medium), #151 (Create ADRs, medium). All issues include acceptance criteria and are assigned to appropriate team members.',
  },
  {
    id: 'action-3',
    type: 'refactor-suggestion',
    title: 'Analyze Circular Dependencies in Service Layer',
    description:
      'Detected and analyzed 8 circular dependency chains in the service layer using static analysis. Generated a refactoring plan to break cycles by introducing an event-driven architecture with an internal event bus and extracting shared domain types.',
    status: 'running',
    createdAt: '2025-01-12T14:00:00Z',
    result: undefined,
  },
  {
    id: 'action-4',
    type: 'knowledge-capture',
    title: 'Capture Payment Processing Knowledge',
    description:
      'Interviewed code patterns in the payment processing module to extract and structure institutional knowledge about Stripe integration, webhook handling, idempotency management, and refund processing. Created structured memory entries linked to source files and related concepts.',
    status: 'completed',
    createdAt: '2025-01-11T09:00:00Z',
    completedAt: '2025-01-11T11:20:00Z',
    result:
      'Captured 4 memory entries: Stripe Webhook Handler (confidence: 88%), Payment Intent Flow (confidence: 91%), Idempotency Key Strategy (confidence: 85%), Refund Processing Logic (confidence: 82%). All entries cross-referenced with source files and linked to related concepts.',
  },
  {
    id: 'action-5',
    type: 'documentation',
    title: 'Generate Risk Analysis Report',
    description:
      'Compiled a comprehensive risk analysis report aggregating findings from static analysis, dependency scanning, git history mining, and code complexity metrics. The report categorizes risks by severity and provides prioritized remediation recommendations.',
    status: 'failed',
    createdAt: '2025-01-10T16:00:00Z',
    result:
      'Failed to generate PDF report due to missing Mermaid diagram renderer. Markdown report was successfully generated at /docs/risk-analysis-2025-01.md. PDF generation requires installing the mermaid-cli package. Recommend running: bun add -d @mermaid-js/mermaid-cli.',
  },
  {
    id: 'action-6',
    type: 'refactor-suggestion',
    title: 'Audit Dependency Security and Version Health',
    description:
      'Scanned all 312 project dependencies against CVE databases and deprecation registries. Identified outdated packages, known vulnerabilities, and packages with no updates in over 2 years. Generated prioritized update recommendations grouped by risk level.',
    status: 'completed',
    createdAt: '2025-01-09T08:00:00Z',
    completedAt: '2025-01-09T09:10:00Z',
    result:
      'Found 23 outdated dependencies: 3 with known CVEs (lodash, axios, jsonwebtoken — recommend immediate patching), 8 with no updates in 2+ years (compatibility risk), 12 with available minor updates. Created GitLab issue #148 for tracking. Recommended enabling Dependabot for automated PRs.',
  },
];
