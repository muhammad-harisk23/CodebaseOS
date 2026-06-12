export declare class AgentService {
    /**
     * Execute full agent workflow for a repository:
     * Analysis → Risk Detection → Reasoning → Recommendation → GitLab Action
     */
    runAgent(repositoryId: string): Promise<any>;
    /**
     * Get agent status
     */
    getAgentStatus(repositoryId: string): Promise<{
        repositoryId: string;
        status: "pending" | "failed" | "in_progress" | "completed";
        lastAction: "create_documentation" | "create_gitlab_issue" | "create_learning_mission" | "generate_report" | "transfer_knowledge";
        totalActions: number;
        lastRun: Date;
    }>;
    /**
     * Get agent timeline
     */
    getAgentTimeline(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/AgentAction").IAgentActionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/AgentAction").IAgentActionDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Get agent recommendations
     */
    getAgentRecommendations(repositoryId: string): Promise<{
        risks: (import("mongoose").Document<unknown, {}, import("../../models/RepositoryRisk").IRepositoryRiskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryRisk").IRepositoryRiskDocument & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        scores: (import("mongoose").Document<unknown, {}, import("../../models/RepositoryScore").IRepositoryScoreDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryScore").IRepositoryScoreDocument & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        aiRecommendations: string;
        manualRecommendations: string[];
    }>;
    /**
     * Generate reasoning based on detected risks
     */
    private generateReasoning;
    /**
     * Generate recommendations
     */
    private generateRecommendations;
    /**
     * Execute GitLab actions based on risk triggers
     */
    private executeActions;
    /**
     * Create an agent action record
     */
    private createAction;
    /**
     * Get default recommendations when scores are unavailable
     */
    private getDefaultRecommendations;
}
export declare const agentService: AgentService;
//# sourceMappingURL=agent.service.d.ts.map