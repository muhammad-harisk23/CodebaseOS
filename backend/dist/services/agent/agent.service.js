"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = exports.AgentService = void 0;
const logger_1 = require("../../utils/logger");
const error_middleware_1 = require("../../middleware/error.middleware");
const Repository_1 = require("../../models/Repository");
const RepositoryScore_1 = require("../../models/RepositoryScore");
const RepositoryRisk_1 = require("../../models/RepositoryRisk");
const AgentAction_1 = require("../../models/AgentAction");
const scoring_service_1 = require("../scoring/scoring.service");
const gitlab_service_1 = require("../gitlab/gitlab.service");
const gemini_service_1 = require("../gemini/gemini.service");
class AgentService {
    /**
     * Execute full agent workflow for a repository:
     * Analysis → Risk Detection → Reasoning → Recommendation → GitLab Action
     */
    async runAgent(repositoryId) {
        logger_1.logger.info(`Agent running for repository ${repositoryId}`);
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        if (repo.status !== 'analyzed') {
            throw new error_middleware_1.AppError('Repository must be analyzed first', 400, 'NOT_ANALYZED');
        }
        // Step 1: Detect Risks via scoring
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        if (!scores) {
            // Calculate scores if not already done
            await scoring_service_1.scoringService.calculateAllScores(repositoryId);
        }
        // Step 2: Get risks
        const risks = await RepositoryRisk_1.RepositoryRisk.find({ repositoryId, status: 'open' });
        // Step 3: Generate reasoning
        const reasoning = await this.generateReasoning(repositoryId, risks, scores);
        // Step 4: Generate recommendations
        const recommendations = await this.generateRecommendations(repositoryId, risks, scores);
        // Step 5: Execute GitLab actions based on risk triggers
        const actions = await this.executeActions(repositoryId, risks, scores);
        return {
            repositoryId,
            status: 'completed',
            reasoning,
            recommendations,
            actions,
            timeline: [
                { step: 'Repository Analysis', status: 'completed', timestamp: new Date() },
                { step: 'Risk Detection', status: 'completed', timestamp: new Date() },
                { step: 'Reasoning', status: 'completed', timestamp: new Date() },
                { step: 'Recommendation', status: 'completed', timestamp: new Date() },
                { step: 'GitLab Action', status: 'completed', timestamp: new Date() },
            ],
        };
    }
    /**
     * Get agent status
     */
    async getAgentStatus(repositoryId) {
        const actions = await AgentAction_1.AgentAction.find({ repositoryId }).sort({ createdAt: -1 });
        const lastAction = actions[0];
        return {
            repositoryId,
            status: lastAction?.status || 'pending',
            lastAction: lastAction?.actionType || 'none',
            totalActions: actions.length,
            lastRun: lastAction?.createdAt || null,
        };
    }
    /**
     * Get agent timeline
     */
    async getAgentTimeline(repositoryId) {
        return AgentAction_1.AgentAction.find({ repositoryId })
            .sort({ createdAt: -1 })
            .limit(50);
    }
    /**
     * Get agent recommendations
     */
    async getAgentRecommendations(repositoryId) {
        const risks = await RepositoryRisk_1.RepositoryRisk.find({ repositoryId, status: 'open' }).limit(10);
        const scores = await RepositoryScore_1.RepositoryScore.findOne({ repositoryId });
        let aiRecommendations = '';
        try {
            const repo = await Repository_1.Repository.findById(repositoryId);
            aiRecommendations = await gemini_service_1.geminiService.generateAgentRecommendations(scores?.toJSON() || {}, risks.map(r => r.toJSON()));
        }
        catch (e) {
            aiRecommendations = 'AI recommendations unavailable. Configure GEMINI_API_KEY.';
        }
        return {
            risks,
            scores,
            aiRecommendations,
            manualRecommendations: this.getDefaultRecommendations(scores),
        };
    }
    /**
     * Generate reasoning based on detected risks
     */
    async generateReasoning(repositoryId, risks, scores) {
        const reasoning = [];
        if (scores) {
            if (scores.knowledgeDebt > 80) {
                reasoning.push(`Knowledge debt is critically high at ${scores.knowledgeDebt}/100. The repository lacks sufficient documentation and understanding.`);
            }
            if (scores.survivability < 40) {
                reasoning.push(`Survivability is critically low at ${scores.survivability}/100. The repository cannot survive without its original creator.`);
            }
            if (scores.recoverability < 40) {
                reasoning.push(`Recoverability is critically low at ${scores.recoverability}/100. Significant refactoring or rebuild is recommended.`);
            }
        }
        if (risks.length === 0) {
            reasoning.push('No critical risks detected. Repository appears healthy.');
        }
        else {
            reasoning.push(`${risks.length} risk(s) detected requiring attention.`);
        }
        reasoning.push('Agent recommendations have been generated and GitLab actions are being created.');
        return reasoning.join('\n');
    }
    /**
     * Generate recommendations
     */
    async generateRecommendations(repositoryId, risks, scores) {
        const recommendations = [];
        if (scores?.knowledgeDebt > 80) {
            recommendations.push('Generate comprehensive documentation for all modules');
            recommendations.push('Create architecture guide and onboarding documentation');
        }
        if (scores?.survivability < 40) {
            recommendations.push('Create knowledge transfer plan for critical components');
            recommendations.push('Assign backup owners for all modules');
        }
        if (scores?.recoverability < 40) {
            recommendations.push('Consider rebuilding critical systems with proper documentation');
            recommendations.push('Create refactoring tasks for high-risk areas');
        }
        if (scores?.busFactor <= 1) {
            recommendations.push('Distribute knowledge through learning missions');
            recommendations.push('Set up pair programming sessions');
        }
        if (recommendations.length === 0) {
            recommendations.push('Continue monitoring repository health');
            recommendations.push('Maintain documentation as code evolves');
        }
        return recommendations;
    }
    /**
     * Execute GitLab actions based on risk triggers
     */
    async executeActions(repositoryId, risks, scores) {
        const actions = [];
        // --- Knowledge Debt Trigger ---
        if (scores?.knowledgeDebt > 80) {
            const action = await this.createAction(repositoryId, 'create_documentation', `Knowledge debt score is ${scores.knowledgeDebt}. Documentation generation required.`, 0.92);
            actions.push(action);
            const docIssue = await gitlab_service_1.gitlabService.createDocumentationIssue(repositoryId, 'Repository');
            actions.push({ type: 'gitlab_issue', result: docIssue });
        }
        // --- Survivability Trigger ---
        if (scores?.survivability < 40) {
            const action = await this.createAction(repositoryId, 'transfer_knowledge', `Survivability score is ${scores.survivability}. Knowledge transfer required.`, 0.88);
            actions.push(action);
            const ownershipIssue = await gitlab_service_1.gitlabService.createOwnershipRiskIssue(repositoryId, 'Critical Modules', 90);
            actions.push({ type: 'ownership_issue', result: ownershipIssue });
        }
        // --- Recoverability Trigger ---
        if (scores?.recoverability < 40) {
            const action = await this.createAction(repositoryId, 'generate_report', `Recoverability score is ${scores.recoverability}. Recovery plan required.`, 0.85);
            actions.push(action);
        }
        // --- Bus Factor Trigger ---
        if (scores?.busFactor <= 1) {
            const action = await this.createAction(repositoryId, 'create_learning_mission', `Bus factor is ${scores.busFactor}. Learning missions required to distribute knowledge.`, 0.94);
            actions.push(action);
            const missionIssue = await gitlab_service_1.gitlabService.createLearningMissionIssue(repositoryId, 'Knowledge Distribution', 'Distribute critical knowledge across team members');
            actions.push({ type: 'learning_mission_issue', result: missionIssue });
        }
        // Always create at least one action
        if (actions.length === 0) {
            const action = await this.createAction(repositoryId, 'generate_report', 'Routine repository health check completed.', 0.70);
            actions.push(action);
        }
        return actions;
    }
    /**
     * Create an agent action record
     */
    async createAction(repositoryId, actionType, reasoning, confidence) {
        const action = await AgentAction_1.AgentAction.create({
            repositoryId,
            actionType,
            reasoning,
            confidence,
            status: 'completed',
            result: 'Action executed successfully',
        });
        logger_1.logger.info(`Agent action created: ${actionType} for ${repositoryId}`);
        return action;
    }
    /**
     * Get default recommendations when scores are unavailable
     */
    getDefaultRecommendations(scores) {
        if (!scores) {
            return [
                'Analyze repository to get started',
                'Generate repository documentation',
                'Check for knowledge concentration risks',
            ];
        }
        return [
            scores.knowledgeDebt > 60 ? 'Reduce knowledge debt through documentation' : 'Maintain current documentation levels',
            scores.survivability < 50 ? 'Improve repository survivability' : 'Repository survivability is acceptable',
            scores.recoverability < 50 ? 'Create recovery plan' : 'Repository is recoverable',
        ];
    }
}
exports.AgentService = AgentService;
exports.agentService = new AgentService();
//# sourceMappingURL=agent.service.js.map