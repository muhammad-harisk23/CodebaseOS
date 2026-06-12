// ============================================================
// CodebaseOS API Types (aligned with backend)
// ============================================================

// Standard API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================================
// Repository
// ============================================================
export interface Repository {
  _id?: string;
  name: string;
  description?: string;
  source: 'github' | 'gitlab' | 'zip';
  repositoryUrl?: string;
  branch?: string;
  framework?: string;
  language?: string;
  database?: string;
  authentication?: string;
  services?: number;
  apis?: number;
  modules?: number;
  status: 'pending' | 'analyzing' | 'analyzed' | 'failed';
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntelligenceReport {
  repositoryName: string;
  framework: string;
  database: string;
  authentication: string;
  services: number;
  apis: number;
  modules: number;
}

// ============================================================
// Memory / Chunks
// ============================================================
export interface MemoryReport {
  filesIndexed: number;
  chunks: number;
  apis: number;
  services: number;
  coverage: number;
}

// ============================================================
// Scores
// ============================================================
export interface RepositoryScore {
  _id?: string;
  repositoryId: string;
  knowledgeDebt: number;
  survivability: number;
  recoverability: number;
  busFactor: number;
  healthScore: number;
  dependencyHealth: number;
  architectureRisk: number;
  ownershipHealth: number;
  createdAt?: string;
}

export interface ScoreResponse {
  score: number;
  status: string;
  recommendation?: string;
}

export interface BusFactorResponse {
  busFactor: number;
  risk: string;
}

// ============================================================
// Risks
// ============================================================
export interface RepositoryRisk {
  _id?: string;
  repositoryId: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFiles: string[];
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt?: string;
}

export interface RiskDashboard {
  knowledgeDebt: number;
  survivability: number;
  recoverability: number;
  overallRisk: string;
  busFactor: number;
  healthScore: number;
}

// ============================================================
// Graphs
// ============================================================
export interface GraphNode {
  id: string;
  type: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  label?: string;
}

export interface KnowledgeGraph {
  _id?: string;
  repositoryId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  createdAt?: string;
}

export interface ArchitectureGraph {
  _id?: string;
  repositoryId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  complexityScore?: number;
  createdAt?: string;
}

// ============================================================
// Agent Actions
// ============================================================
export interface AgentAction {
  _id?: string;
  repositoryId: string;
  actionType: 'create_documentation' | 'create_gitlab_issue' | 'create_learning_mission' | 'generate_report' | 'transfer_knowledge';
  reasoning: string;
  confidence: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  createdAt?: string;
}

// ============================================================
// GitLab Issues
// ============================================================
export interface GitlabIssue {
  _id?: string;
  repositoryId: string;
  gitlabIssueId?: number;
  title: string;
  description?: string;
  status: 'open' | 'closed';
  url?: string;
  labels?: string[];
  createdAt?: string;
}

// ============================================================
// Documentation
// ============================================================
export interface RepositoryDocument {
  _id?: string;
  repositoryId: string;
  type: 'README' | 'architecture' | 'api' | 'onboarding' | 'maintenance' | 'knowledge_transfer';
  content: string;
  generatedBy: 'agent' | 'user';
  createdAt?: string;
}

// ============================================================
// Learning Missions
// ============================================================
export interface LearningMission {
  _id?: string;
  repositoryId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  objective: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt?: string;
}

// ============================================================
// Knowledge Interviews
// ============================================================
export interface InterviewQuestion {
  question: string;
  answer?: string;
  correctAnswer?: string;
  score?: number;
  category: 'authentication' | 'database' | 'architecture' | 'security';
}

export interface KnowledgeInterview {
  _id?: string;
  repositoryId: string;
  questions: InterviewQuestion[];
  authenticationScore: number;
  databaseScore: number;
  architectureScore: number;
  securityScore: number;
  overallScore: number;
  status: 'in_progress' | 'completed';
  createdAt?: string;
}

// ============================================================
// Freelancer Rescue
// ============================================================
export interface RescueReport {
  recoverability: number;
  recommendation: string;
  criticalFiles: string[];
  dangerZones: string[];
}

// ============================================================
// Ownership
// ============================================================
export interface OwnershipEntry {
  _id?: string;
  repositoryId: string;
  module: string;
  files: number;
  lastContributor: string;
  lastActiveDate: string;
  busFactorRisk: 'critical' | 'high' | 'medium' | 'low';
  knowledgeHolders: string[];
  documentationCoverage: number;
}