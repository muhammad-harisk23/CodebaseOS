"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoringService = exports.ScoringService = void 0;
const logger_1 = require("../../utils/logger");
const error_middleware_1 = require("../../middleware/error.middleware");
const RepositoryScore_1 = require("../../models/RepositoryScore");
const RepositoryRisk_1 = require("../../models/RepositoryRisk");
const Repository_1 = require("../../models/Repository");
const RepositoryChunk_1 = require("../../models/RepositoryChunk");
class ScoringService {
    /**
     * Calculate all scores for a repository
     */
    async calculateAllScores(repositoryId) {
        logger_1.logger.info(`Calculating scores for repository ${repositoryId}`);
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        // Collect input metrics
        const docs = await this.calculateDocumentationScore(repositoryId);
        const complexity = await this.calculateComplexityScore(repositoryId);
        const ownership = await this.calculateKnowledgeConcentration(repositoryId);
        const dependencies = await this.calculateDependencyHealth(repositoryId);
        const onboarding = await this.calculateOnboardingDifficulty(repositoryId);
        const memory = await this.calculateMemoryCoverage(repositoryId);
        // --- Knowledge Debt Score ---
        // Formula from scoring-engine.md:
        // Knowledge Debt = (Docs × 0.25) + (Complexity × 0.20) + (Knowledge Concentration × 0.20)
        //                 + (Dependency Risk × 0.15) + (Onboarding Difficulty × 0.10) + (Memory Coverage Risk × 0.10)
        const knowledgeDebt = Math.round((docs * 0.25) +
            (complexity * 0.20) +
            (ownership * 0.20) +
            (dependencies * 0.15) +
            (onboarding * 0.10) +
            (memory * 0.10));
        // --- Survivability Score ---
        // Formula: Survivability Risk = (Docs Risk × 0.20) + (Bus Factor Risk × 0.25) + (Ownership Risk × 0.25)
        //                              + (Architecture Risk × 0.10) + (Dependency Risk × 0.10) + (Onboarding Risk × 0.10)
        // Final: 100 - Survivability Risk
        const busFactor = await this.calculateBusFactor(repositoryId);
        const survivabilityRisk = Math.round((docs * 0.20) +
            (busFactor * 0.25) +
            (ownership * 0.25) +
            (complexity * 0.10) +
            (dependencies * 0.10) +
            (onboarding * 0.10));
        const survivability = Math.max(0, Math.min(100, 100 - survivabilityRisk));
        // --- Recoverability Score ---
        // Formula: Recoverability = 100 - (Knowledge Debt × 0.30 + Survivability Risk × 0.25 + Architecture Risk × 0.15
        //                              + Dependency Risk × 0.10 + Dead Code Risk × 0.10 + Duplicate Logic Risk × 0.05 + Documentation Risk × 0.05)
        const deadCodeRisk = await this.calculateDeadCodeRisk(repositoryId);
        const duplicateLogicRisk = await this.calculateDuplicateLogicRisk(repositoryId);
        const recoverability = Math.max(0, Math.min(100, Math.round(100 - (knowledgeDebt * 0.30 +
            survivabilityRisk * 0.25 +
            complexity * 0.15 +
            dependencies * 0.10 +
            deadCodeRisk * 0.10 +
            duplicateLogicRisk * 0.05 +
            docs * 0.05))));
        // --- Health Score ---
        const healthScore = Math.round((survivability + (100 - knowledgeDebt) + recoverability) / 3);
        // --- Save Scores ---
        await RepositoryScore_1.RepositoryScore.findOneAndUpdate({ repositoryId }, {
            repositoryId,
            knowledgeDebt,
            survivability,
            recoverability,
            busFactor: Math.round(busFactor / 20), // Convert percentage to 1-5 scale
            healthScore,
            dependencyHealth: Math.max(0, 100 - dependencies),
            architectureRisk: complexity,
            ownershipHealth: Math.max(0, 100 - ownership),
            createdAt: new Date(),
        }, { upsert: true, new: true });
        // --- Generate Risks ---
        await this.generateRisks(repositoryId, knowledgeDebt, survivability, recoverability, busFactor);
        logger_1.logger.info(`Scores calculated for ${repositoryId}: KD=${knowledgeDebt}, SV=${survivability}, RC=${recoverability}, BF=${busFactor}`);
    }
    /**
     * Get knowledge debt score
     */
    async getKnowledgeDebt(repositoryId) {
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores)
            throw new error_middleware_1.AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
        return {
            score: scores.knowledgeDebt,
            status: this.getKnowledgeDebtStatus(scores.knowledgeDebt),
        };
    }
    /**
     * Get survivability score
     */
    async getSurvivability(repositoryId) {
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores)
            throw new error_middleware_1.AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
        return {
            score: scores.survivability,
            status: this.getSurvivabilityStatus(scores.survivability),
        };
    }
    /**
     * Get recoverability score
     */
    async getRecoverability(repositoryId) {
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores)
            throw new error_middleware_1.AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
        return {
            score: scores.recoverability,
            recommendation: this.getRecoverabilityRecommendation(scores.recoverability),
        };
    }
    /**
     * Get bus factor
     */
    async getBusFactor(repositoryId) {
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores)
            throw new error_middleware_1.AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
        return {
            busFactor: scores.busFactor,
            risk: this.getBusFactorRisk(scores.busFactor),
        };
    }
    /**
     * Get risk center dashboard
     */
    async getRiskDashboard(repositoryId) {
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores)
            throw new error_middleware_1.AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
        const overallRisk = Math.round((scores.knowledgeDebt + (100 - scores.survivability) + (100 - scores.recoverability)) / 3);
        return {
            knowledgeDebt: scores.knowledgeDebt,
            survivability: scores.survivability,
            recoverability: scores.recoverability,
            overallRisk: this.getOverallRiskLevel(overallRisk),
            busFactor: scores.busFactor,
            healthScore: scores.healthScore,
        };
    }
    /**
     * Get repository risks
     */
    async getRepositoryRisks(repositoryId) {
        return RepositoryRisk_1.RepositoryRisk.find({ repositoryId }).sort({ severity: 1, createdAt: -1 });
    }
    /**
     * Get critical risks
     */
    async getCriticalRisks(repositoryId) {
        return RepositoryRisk_1.RepositoryRisk.find({ repositoryId, severity: { $in: ['critical', 'high'] }, status: 'open' }).sort({ severity: 1 });
    }
    // ============ Private Metric Calculations ============
    async calculateDocumentationScore(repositoryId) {
        const docs = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId, module: { $in: ['Configuration', 'API', 'Routes'] } });
        const totalChunks = await RepositoryChunk_1.RepositoryChunk.countDocuments({ repositoryId });
        if (totalChunks === 0)
            return 85; // No docs = high risk
        const coverage = docs.length / totalChunks;
        return Math.round((1 - coverage) * 100);
    }
    async calculateComplexityScore(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            return 50;
        const services = repo.services || 0;
        const apis = repo.apis || 0;
        const modules = repo.modules || 0;
        const total = services + apis + modules;
        if (total === 0)
            return 30;
        return Math.min(100, Math.round(total * 5));
    }
    async calculateKnowledgeConcentration(repositoryId) {
        // Without git history, estimate based on module distribution
        const chunks = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId });
        if (chunks.length === 0)
            return 50;
        const modules = new Set(chunks.map(c => c.module).filter(Boolean));
        if (modules.size <= 1)
            return 90; // High concentration
        if (modules.size <= 3)
            return 60;
        if (modules.size <= 5)
            return 40;
        return 20;
    }
    async calculateDependencyHealth(repositoryId) {
        return 40; // Default - would need actual dependency analysis
    }
    async calculateOnboardingDifficulty(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            return 50;
        const complexity = await this.calculateComplexityScore(repositoryId);
        const docs = await this.calculateDocumentationScore(repositoryId);
        return Math.round((complexity + docs) / 2);
    }
    async calculateMemoryCoverage(repositoryId) {
        const chunks = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId });
        if (chunks.length === 0)
            return 100;
        if (chunks.length < 10)
            return 80;
        if (chunks.length < 50)
            return 50;
        if (chunks.length < 100)
            return 30;
        return 10;
    }
    async calculateBusFactor(repositoryId) {
        const concentration = await this.calculateKnowledgeConcentration(repositoryId);
        return concentration; // Higher concentration = lower bus factor = higher risk
    }
    async calculateDeadCodeRisk(repositoryId) {
        return 30; // Default
    }
    async calculateDuplicateLogicRisk(repositoryId) {
        return 20; // Default
    }
    async generateRisks(repositoryId, knowledgeDebt, survivability, recoverability, busFactorRisk) {
        // Remove old risks
        await RepositoryRisk_1.RepositoryRisk.deleteMany({ repositoryId });
        const risks = [];
        if (knowledgeDebt > 80) {
            risks.push({
                repositoryId,
                title: 'High Knowledge Debt',
                severity: 'critical',
                description: `Knowledge debt score is ${knowledgeDebt}. Repository is difficult to understand and maintain.`,
                affectedFiles: [],
                recommendation: 'Generate documentation, create architecture guide, and establish knowledge transfer plan.',
                status: 'open',
            });
        }
        if (survivability < 40) {
            risks.push({
                repositoryId,
                title: 'Low Repository Survivability',
                severity: 'critical',
                description: `Survivability score is ${survivability}. Repository may not survive without original creator.`,
                affectedFiles: [],
                recommendation: 'Document critical knowledge, assign backup owners, create knowledge transfer plan.',
                status: 'open',
            });
        }
        if (recoverability < 40) {
            risks.push({
                repositoryId,
                title: 'Low Recoverability',
                severity: 'high',
                description: `Recoverability score is ${recoverability}. Significant refactoring or rebuild may be needed.`,
                affectedFiles: [],
                recommendation: 'Consider rebuild for critical systems, prioritize refactoring efforts.',
                status: 'open',
            });
        }
        if (busFactorRisk < 30) {
            risks.push({
                repositoryId,
                title: 'Critical Bus Factor',
                severity: 'critical',
                description: 'Bus factor is critically low. Knowledge is concentrated in too few contributors.',
                affectedFiles: [],
                recommendation: 'Create backup ownership plan, distribute knowledge through documentation and learning missions.',
                status: 'open',
            });
        }
        if (knowledgeDebt > 60 && knowledgeDebt <= 80) {
            risks.push({
                repositoryId,
                title: 'Moderate Knowledge Debt',
                severity: 'high',
                description: `Knowledge debt score is ${knowledgeDebt}. Some areas need documentation improvement.`,
                affectedFiles: [],
                recommendation: 'Review and improve documentation for complex modules.',
                status: 'open',
            });
        }
        if (risks.length > 0) {
            await RepositoryRisk_1.RepositoryRisk.insertMany(risks);
        }
    }
    getKnowledgeDebtStatus(score) {
        if (score <= 30)
            return 'healthy';
        if (score <= 60)
            return 'moderate';
        if (score <= 80)
            return 'high-risk';
        return 'critical';
    }
    getSurvivabilityStatus(score) {
        if (score >= 81)
            return 'healthy';
        if (score >= 61)
            return 'moderate';
        if (score >= 31)
            return 'high-risk';
        return 'critical';
    }
    getRecoverabilityRecommendation(score) {
        if (score >= 81)
            return 'continue';
        if (score >= 61)
            return 'refactor-minor';
        if (score >= 41)
            return 'refactor-major';
        return 'rebuild';
    }
    getBusFactorRisk(bf) {
        if (bf >= 5)
            return 'healthy';
        if (bf >= 3)
            return 'moderate';
        if (bf >= 2)
            return 'high';
        return 'critical';
    }
    getOverallRiskLevel(score) {
        if (score <= 30)
            return 'healthy';
        if (score <= 60)
            return 'moderate';
        if (score <= 80)
            return 'high';
        return 'critical';
    }
}
exports.ScoringService = ScoringService;
exports.scoringService = new ScoringService();
//# sourceMappingURL=scoring.service.js.map