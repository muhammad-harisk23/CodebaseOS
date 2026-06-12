export declare class GitlabService {
    private baseUrl;
    private token;
    private projectId;
    constructor();
    private get headers();
    private isConfigured;
    /**
     * Create a GitLab issue
     */
    createIssue(repositoryId: string, title: string, description: string, labels?: string[]): Promise<any>;
    /**
     * Create documentation issue
     */
    createDocumentationIssue(repositoryId: string, moduleName: string): Promise<any>;
    /**
     * Create learning mission issue
     */
    createLearningMissionIssue(repositoryId: string, missionTitle: string, objective: string): Promise<any>;
    /**
     * Create ownership risk issue
     */
    createOwnershipRiskIssue(repositoryId: string, moduleName: string, ownerPercent: number): Promise<any>;
    /**
     * Get GitLab activity for a repository
     */
    getGitlabActivity(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/GitlabIssue").IGitlabIssueDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/GitlabIssue").IGitlabIssueDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Store issue locally when GitLab is not configured
     */
    private storeLocalIssue;
}
export declare const gitlabService: GitlabService;
//# sourceMappingURL=gitlab.service.d.ts.map