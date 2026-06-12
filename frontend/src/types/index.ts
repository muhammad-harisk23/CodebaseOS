// CodebaseOS Type Definitions

export type ViewId =
  | 'home'
  | 'dashboard'
  | 'repository-upload'
  | 'repository-analysis'
  | 'memory-engine'
  | 'architecture'
  | 'knowledge-graph'
  | 'knowledge-debt'
  | 'survivability'
  | 'recoverability'
  | 'risk-center'
  | 'bus-factor'
  | 'ownership'
  | 'agent-actions'
  | 'gitlab-actions'
  | 'learning-missions'
  | 'knowledge-interview'
  | 'documentation'
  | 'freelancer-rescue'
  | 'settings';

export interface SidebarItem {
  id: ViewId;
  label: string;
  icon?: string;
  children?: SidebarItem[];
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  lastAnalyzed: string;
  knowledgeDebt: number;
  survivability: number;
  recoverability: number;
  busFactor: number;
  criticalRisks: number;
  architectureComplexity: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedOnboardingTime: string;
  biggestRisk: string;
  status: 'analyzing' | 'complete' | 'error' | 'queued';
  files: number;
  dependencies: number;
  contributors: number;
}

export interface MetricData {
  label: string;
  value: number;
  max: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  description: string;
  severity: 'critical' | 'warning' | 'good' | 'info';
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  affectedFiles: string[];
  recommendation: string;
  status: 'open' | 'acknowledged' | 'resolved';
  detectedAt: string;
}

export interface OwnershipEntry {
  id: string;
  module: string;
  files: number;
  lastContributor: string;
  lastActiveDate: string;
  busFactorRisk: 'critical' | 'high' | 'medium' | 'low';
  knowledgeHolders: string[];
  documentationCoverage: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  modules: string[];
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  prerequisites: string[];
}

export interface GitLabIssue {
  id: string;
  title: string;
  description: string;
  type: 'documentation' | 'refactor' | 'risk-mitigation' | 'knowledge-transfer';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
  assignee?: string;
  labels: string[];
  createdAt: string;
  url: string;
}

export interface MemoryEntry {
  id: string;
  concept: string;
  category: string;
  description: string;
  relatedFiles: string[];
  relatedConcepts: string[];
  confidence: number;
  lastUpdated: string;
  source: 'auto-detected' | 'user-contributed' | 'agent-generated';
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'module' | 'service' | 'component' | 'data' | 'external';
  description: string;
  files: string[];
  complexity: number;
  connections: number;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type: 'imports' | 'api-call' | 'data-flow' | 'event' | 'dependency';
  strength: 'strong' | 'medium' | 'weak';
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: string;
  weight: number;
  description: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: string;
  weight: number;
}

export interface AgentAction {
  id: string;
  type: 'documentation' | 'issue-creation' | 'refactor-suggestion' | 'knowledge-capture';
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  result?: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  max: number;
  description: string;
}