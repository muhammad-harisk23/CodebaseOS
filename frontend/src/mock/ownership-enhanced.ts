interface OwnershipEnhancedData {
  modules: {
    id: string;
    module: string;
    primaryOwner: string;
    backupOwner: string | null;
    ownershipPercent: number;
    riskLevel: 'silo' | 'moderate' | 'healthy';
    files: number;
    dependencies: string[];
    documentationCoverage: number;
    lastActive: string;
  }[];
  contributors: {
    id: string;
    name: string;
    avatar: string;
    modules: string[];
    ownershipTotal: number;
    risk: 'critical' | 'high' | 'medium' | 'low';
  }[];
  insights: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
  }[];
  graphNodes: {
    id: string;
    label: string;
    nodeType: 'contributor' | 'module';
    ownership: number;
  }[];
  graphEdges: {
    id: string;
    source: string;
    target: string;
    weight: number;
    type: 'owns' | 'contributes' | 'backup';
  }[];
}

export const ownershipEnhancedData: OwnershipEnhancedData = {
  modules: [
    {
      id: 'mod-auth',
      module: 'Authentication',
      primaryOwner: 'Alice Chen',
      backupOwner: null,
      ownershipPercent: 92,
      riskLevel: 'silo',
      files: 12,
      dependencies: ['Database', 'API Gateway'],
      documentationCoverage: 2,
      lastActive: '2025-01-14',
    },
    {
      id: 'mod-payments',
      module: 'Payments',
      primaryOwner: 'Charlie Kim',
      backupOwner: null,
      ownershipPercent: 88,
      riskLevel: 'silo',
      files: 8,
      dependencies: ['Authentication', 'Database'],
      documentationCoverage: 5,
      lastActive: '2025-01-10',
    },
    {
      id: 'mod-database',
      module: 'Database',
      primaryOwner: 'Bob Martinez',
      backupOwner: 'Alice Chen',
      ownershipPercent: 75,
      riskLevel: 'moderate',
      files: 19,
      dependencies: ['Infrastructure'],
      documentationCoverage: 28,
      lastActive: '2025-01-13',
    },
    {
      id: 'mod-infra',
      module: 'Infrastructure',
      primaryOwner: 'Alice Chen',
      backupOwner: null,
      ownershipPercent: 94,
      riskLevel: 'silo',
      files: 15,
      dependencies: ['Database'],
      documentationCoverage: 8,
      lastActive: '2025-01-12',
    },
    {
      id: 'mod-api',
      module: 'API Gateway',
      primaryOwner: 'Alice Chen',
      backupOwner: 'Bob Martinez',
      ownershipPercent: 67,
      riskLevel: 'moderate',
      files: 22,
      dependencies: ['Authentication', 'Database', 'Payments'],
      documentationCoverage: 45,
      lastActive: '2025-01-14',
    },
  ],
  contributors: [
    {
      id: 'contrib-alice',
      name: 'Alice Chen',
      avatar: 'AC',
      modules: ['Authentication', 'Infrastructure', 'API Gateway', 'Database'],
      ownershipTotal: 347,
      risk: 'critical',
    },
    {
      id: 'contrib-bob',
      name: 'Bob Martinez',
      avatar: 'BM',
      modules: ['Database', 'API Gateway'],
      ownershipTotal: 108,
      risk: 'high',
    },
    {
      id: 'contrib-charlie',
      name: 'Charlie Kim',
      avatar: 'CK',
      modules: ['Payments'],
      ownershipTotal: 88,
      risk: 'high',
    },
  ],
  insights: [
    {
      id: 'insight-1',
      title: 'Knowledge Concentration Detected',
      description:
        'Alice Chen holds primary or significant ownership across 4 out of 5 modules, totaling 347% cumulative ownership. This level of concentration means any extended absence would paralyze the majority of the codebase.',
      severity: 'critical',
    },
    {
      id: 'insight-2',
      title: 'No Backup Owners for 3 Modules',
      description:
        'Authentication, Payments, and Infrastructure have no designated backup owner. If the primary owner becomes unavailable, there is no one with sufficient knowledge to maintain or evolve these modules safely.',
      severity: 'critical',
    },
    {
      id: 'insight-3',
      title: 'Documentation Missing for High-Risk Silos',
      description:
        'The three modules with silo-level risk (Authentication at 2%, Infrastructure at 8%, Payments at 5%) also have the lowest documentation coverage. This compounds the ownership risk by removing any written fallback for knowledge transfer.',
      severity: 'warning',
    },
    {
      id: 'insight-4',
      title: 'Cross-Module Dependency Risk',
      description:
        'The API Gateway depends on Authentication, Database, and Payments. Since these three modules are each owned by different contributors with no cross-knowledge, a change in any one module risks breaking the API Gateway integration.',
      severity: 'warning',
    },
    {
      id: 'insight-5',
      title: 'Single Point of Failure in Infrastructure',
      description:
        'Infrastructure (Docker, nginx, deployment pipeline) is 94% owned by Alice Chen with only 6% contribution from Bob. This module has no documentation and no backup owner, making it the most dangerous single point of failure in the repository.',
      severity: 'critical',
    },
  ],
  recommendations: [
    {
      title: 'Generate Documentation',
      description:
        'Auto-generate documentation for the three silo modules (Authentication, Payments, Infrastructure) to create a written knowledge base that can survive contributor turnover.',
      action: 'generate-documentation',
    },
    {
      title: 'Create Learning Mission',
      description:
        'Design learning missions for Bob (Infrastructure focus) and Charlie (Authentication focus) to build cross-module competency and reduce single-contributor dependencies.',
      action: 'create-learning-mission',
    },
    {
      title: 'Create GitLab Issue',
      description:
        'File a tracking issue for ownership rebalancing with sub-tasks for each module requiring a backup owner, documentation improvements, and knowledge transfer sessions.',
      action: 'create-gitlab-issue',
    },
    {
      title: 'Create Knowledge Transfer Plan',
      description:
        'Develop a 6-week structured plan with weekly pair programming sessions, module walkthroughs, and hands-on tasks to distribute knowledge from silo owners to backup contributors.',
      action: 'create-knowledge-transfer-plan',
    },
    {
      title: 'Assign Backup Owner',
      description:
        'Immediately assign Bob Martinez as backup owner for Infrastructure and Charlie Kim as backup owner for Authentication, with a requirement of at least 2 meaningful commits per month.',
      action: 'assign-backup-owner',
    },
  ],
  graphNodes: [
    { id: 'contrib-alice', label: 'Alice Chen', nodeType: 'contributor', ownership: 347 },
    { id: 'contrib-bob', label: 'Bob Martinez', nodeType: 'contributor', ownership: 108 },
    { id: 'contrib-charlie', label: 'Charlie Kim', nodeType: 'contributor', ownership: 88 },
    { id: 'mod-auth', label: 'Authentication', nodeType: 'module', ownership: 92 },
    { id: 'mod-payments', label: 'Payments', nodeType: 'module', ownership: 88 },
    { id: 'mod-database', label: 'Database', nodeType: 'module', ownership: 75 },
    { id: 'mod-infra', label: 'Infrastructure', nodeType: 'module', ownership: 94 },
    { id: 'mod-api', label: 'API Gateway', nodeType: 'module', ownership: 67 },
  ],
  graphEdges: [
    { id: 'edge-1', source: 'contrib-alice', target: 'mod-auth', weight: 92, type: 'owns' },
    { id: 'edge-2', source: 'contrib-alice', target: 'mod-infra', weight: 94, type: 'owns' },
    { id: 'edge-3', source: 'contrib-alice', target: 'mod-api', weight: 67, type: 'owns' },
    { id: 'edge-4', source: 'contrib-alice', target: 'mod-database', weight: 25, type: 'backup' },
    { id: 'edge-5', source: 'contrib-charlie', target: 'mod-auth', weight: 8, type: 'contributes' },
    { id: 'edge-6', source: 'contrib-charlie', target: 'mod-payments', weight: 88, type: 'owns' },
    { id: 'edge-7', source: 'contrib-bob', target: 'mod-database', weight: 75, type: 'owns' },
    { id: 'edge-8', source: 'contrib-bob', target: 'mod-api', weight: 33, type: 'backup' },
    { id: 'edge-9', source: 'contrib-bob', target: 'mod-infra', weight: 6, type: 'contributes' },
    { id: 'edge-10', source: 'contrib-alice', target: 'mod-payments', weight: 12, type: 'contributes' },
    { id: 'edge-11', source: 'contrib-charlie', target: 'mod-api', weight: 0, type: 'contributes' },
    { id: 'edge-12', source: 'contrib-bob', target: 'mod-auth', weight: 0, type: 'contributes' },
  ],
};