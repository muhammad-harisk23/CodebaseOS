export interface IRepository {
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
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IRepositoryChunk {
    _id?: string;
    repositoryId: string;
    filePath: string;
    module?: string;
    summary?: string;
    chunkContent: string;
    relationships?: string[];
    createdAt?: Date;
}
export interface IRepositoryEmbedding {
    _id?: string;
    repositoryId: string;
    chunkId: string;
    embeddingProvider: 'gemini';
    embeddingVector: number[];
    createdAt?: Date;
}
export interface IKnowledgeGraph {
    _id?: string;
    repositoryId: string;
    nodes: IGraphNode[];
    edges: IGraphEdge[];
    createdAt?: Date;
}
export interface IArchitectureGraph {
    _id?: string;
    repositoryId: string;
    nodes: IGraphNode[];
    edges: IGraphEdge[];
    complexityScore?: number;
    createdAt?: Date;
}
export interface IGraphNode {
    id: string;
    type: string;
    label: string;
    data?: Record<string, unknown>;
}
export interface IGraphEdge {
    source: string;
    target: string;
    type: string;
    label?: string;
}
export interface IRepositoryScore {
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
    createdAt?: Date;
}
export interface IRepositoryRisk {
    _id?: string;
    repositoryId: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedFiles: string[];
    recommendation: string;
    status: 'open' | 'in_progress' | 'resolved';
    createdAt?: Date;
}
export interface IRepositoryDocument {
    _id?: string;
    repositoryId: string;
    type: 'README' | 'architecture' | 'api' | 'onboarding' | 'maintenance' | 'knowledge_transfer';
    content: string;
    generatedBy: 'agent' | 'user';
    createdAt?: Date;
}
export interface IAgentAction {
    _id?: string;
    repositoryId: string;
    actionType: 'create_documentation' | 'create_gitlab_issue' | 'create_learning_mission' | 'generate_report' | 'transfer_knowledge';
    reasoning: string;
    confidence: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: string;
    createdAt?: Date;
}
export interface IGitlabIssue {
    _id?: string;
    repositoryId: string;
    gitlabIssueId?: number;
    title: string;
    description?: string;
    status: 'open' | 'closed';
    url?: string;
    labels?: string[];
    createdAt?: Date;
}
export interface ILearningMission {
    _id?: string;
    repositoryId: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    objective: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt?: Date;
}
export interface IKnowledgeInterview {
    _id?: string;
    repositoryId: string;
    questions: IInterviewQuestion[];
    authenticationScore: number;
    databaseScore: number;
    architectureScore: number;
    securityScore: number;
    overallScore: number;
    status: 'in_progress' | 'completed';
    createdAt?: Date;
}
export interface IInterviewQuestion {
    question: string;
    answer?: string;
    correctAnswer?: string;
    score?: number;
    category: 'authentication' | 'database' | 'architecture' | 'security';
}
export interface IUser {
    _id?: string;
    email: string;
    name?: string;
    provider: 'google' | 'github' | 'gitlab';
    createdAt?: Date;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        code: string;
        message: string;
    };
}
export interface AnalysisRequest {
    repositoryUrl: string;
    source: 'github' | 'gitlab';
}
export interface UploadRequest {
    file: any;
}
export interface DocumentationRequest {
    type: 'README' | 'architecture' | 'api' | 'onboarding' | 'maintenance' | 'knowledge_transfer';
}
export interface GitlabIssueRequest {
    repositoryId: string;
    title: string;
    description?: string;
    labels?: string[];
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
export interface MemoryReport {
    filesIndexed: number;
    chunks: number;
    apis: number;
    services: number;
    coverage: number;
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
export interface RiskDashboard {
    knowledgeDebt: number;
    survivability: number;
    recoverability: number;
    overallRisk: string;
    busFactor: number;
    healthScore: number;
}
export interface RescueReport {
    recoverability: number;
    recommendation: string;
    criticalFiles: string[];
    dangerZones: string[];
}
//# sourceMappingURL=index.d.ts.map