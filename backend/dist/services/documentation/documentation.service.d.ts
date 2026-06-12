import { IRepositoryDocumentDoc } from '../../models/RepositoryDocument';
export declare class DocumentationService {
    /**
     * Generate documentation for a repository
     */
    generateDocumentation(repositoryId: string, type: string): Promise<IRepositoryDocumentDoc>;
    /**
     * Get all documentation for a repository
     */
    getDocumentation(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, IRepositoryDocumentDoc, {}, import("mongoose").DefaultSchemaOptions> & IRepositoryDocumentDoc & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Export all documentation for a repository
     */
    exportDocumentation(repositoryId: string): Promise<{
        repositoryName: string;
        documentation: Record<string, string>;
    }>;
    /**
     * Generate learning missions
     */
    generateLearningMissions(repositoryId: string): Promise<any[]>;
    /**
     * Get learning missions
     */
    getLearningMissions(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/LearningMission").ILearningMissionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/LearningMission").ILearningMissionDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Complete a learning mission
     */
    completeMission(missionId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/LearningMission").ILearningMissionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/LearningMission").ILearningMissionDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Start knowledge interview
     */
    startInterview(repositoryId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Submit answer for interview question
     */
    submitAnswer(interviewId: string, questionIndex: number, answer: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Get interview results
     */
    getInterviewResults(interviewId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/KnowledgeInterview").IKnowledgeInterviewDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Generate freelancer rescue report
     */
    generateRescueReport(repositoryId: string): Promise<{
        recoverability: number;
        recommendation: string;
        criticalFiles: string[];
        dangerZones: string[];
        projectSummary: string;
        architectureOverview: string;
        topFilesToRead: string[];
        suggestedStartingPoint: string;
    }>;
    private averageScore;
    private generateReadme;
    private generateArchitectureDoc;
    private generateApiDoc;
    private generateOnboardingGuide;
    private generateMaintenanceGuide;
    private generateKnowledgeTransferPlan;
    private fallbackReadme;
    private fallbackArchitectureDoc;
}
export declare const documentationService: DocumentationService;
//# sourceMappingURL=documentation.service.d.ts.map