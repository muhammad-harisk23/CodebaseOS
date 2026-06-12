export declare class GeminiService {
    private genAI;
    private model;
    constructor();
    /**
     * Generate content using Gemini
     */
    private generateContent;
    /**
     * Generate repository summary
     */
    generateRepositorySummary(repositoryName: string, metadata: any): Promise<string>;
    /**
     * Generate architecture documentation
     */
    generateArchitectureSummary(repositoryName: string, metadata: any): Promise<string>;
    /**
     * Generate README
     */
    generateReadme(repositoryName: string, metadata: any, summary: string): Promise<string>;
    /**
     * Generate documentation
     */
    generateDocumentation(type: string, repositoryName: string, metadata: any): Promise<string>;
    /**
     * Generate learning missions
     */
    generateLearningMissions(repositoryName: string, metadata: any): Promise<string>;
    /**
     * Generate knowledge interview questions
     */
    generateInterviewQuestions(repositoryName: string, metadata: any): Promise<string>;
    /**
     * Generate agent recommendations based on scores
     */
    generateAgentRecommendations(scores: any, risks: any[]): Promise<string>;
    /**
     * Fallback response when Gemini API is not available
     */
    private getFallbackResponse;
    private generateFallbackSummary;
    private generateFallbackReadme;
    private generateFallbackMissions;
    private generateFallbackQuestions;
    private generateFallbackRecommendations;
    private generateFallbackDocumentation;
}
export declare const geminiService: GeminiService;
//# sourceMappingURL=gemini.service.d.ts.map