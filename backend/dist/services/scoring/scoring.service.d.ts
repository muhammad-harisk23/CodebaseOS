export declare class ScoringService {
    /**
     * Calculate all scores for a repository
     */
    calculateAllScores(repositoryId: string): Promise<void>;
    /**
     * Get knowledge debt score
     */
    getKnowledgeDebt(repositoryId: string): Promise<{
        score: any;
        status: string;
    }>;
    /**
     * Get survivability score
     */
    getSurvivability(repositoryId: string): Promise<{
        score: any;
        status: string;
    }>;
    /**
     * Get recoverability score
     */
    getRecoverability(repositoryId: string): Promise<{
        score: any;
        recommendation: string;
    }>;
    /**
     * Get bus factor
     */
    getBusFactor(repositoryId: string): Promise<{
        busFactor: any;
        risk: string;
    }>;
    /**
     * Get risk center dashboard
     */
    getRiskDashboard(repositoryId: string): Promise<{
        knowledgeDebt: any;
        survivability: any;
        recoverability: any;
        overallRisk: string;
        busFactor: any;
        healthScore: any;
    }>;
    /**
     * Get repository risks
     */
    getRepositoryRisks(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/RepositoryRisk").IRepositoryRiskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryRisk").IRepositoryRiskDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Get critical risks
     */
    getCriticalRisks(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/RepositoryRisk").IRepositoryRiskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryRisk").IRepositoryRiskDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    private calculateDocumentationScore;
    private calculateComplexityScore;
    private calculateKnowledgeConcentration;
    private calculateDependencyHealth;
    private calculateOnboardingDifficulty;
    private calculateMemoryCoverage;
    private calculateBusFactor;
    private calculateDeadCodeRisk;
    private calculateDuplicateLogicRisk;
    private generateRisks;
    private getKnowledgeDebtStatus;
    private getSurvivabilityStatus;
    private getRecoverabilityRecommendation;
    private getBusFactorRisk;
    private getOverallRiskLevel;
}
export declare const scoringService: ScoringService;
//# sourceMappingURL=scoring.service.d.ts.map