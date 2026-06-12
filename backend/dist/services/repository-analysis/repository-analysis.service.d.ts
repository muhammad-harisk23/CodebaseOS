export declare class RepositoryAnalysisService {
    /**
     * Clone a git repository to local filesystem (TEMP_REPO_DIR only)
     */
    cloneRepository(url: string): Promise<string>;
    /**
     * Extract a ZIP file to local filesystem
     */
    extractZip(zipPath: string): Promise<string>;
    /**
     * Analyze repository files and detect metadata (no embeddings/memory yet)
     */
    analyzeRepository(repoPath: string, repositoryId: string): Promise<any>;
    private isIgnorableDir;
    /**
     * Get all files recursively from a directory (+ counts)
     */
    private walkRepository;
    private detectPackageManager;
    private detectLanguages;
    private detectFrameworkFromDeps;
    private detectDatabaseFromDeps;
    private detectAuthFromDeps;
    private countHeuristics;
    private detectMetadata;
    /**
     * Get intelligence report for a repository
     */
    getIntelligenceReport(repositoryId: string): Promise<{
        repositoryName: string;
        framework: string;
        database: string;
        authentication: string;
        services: number;
        apis: number;
        modules: number;
    }>;
    /**
     * Get frameworks detected
     */
    getFrameworks(repositoryId: string): Promise<{
        framework: string | undefined;
        languages: string[];
    }>;
    /**
     * Get dependencies
     */
    getDependencies(repositoryId: string): Promise<{
        dependencies: never[];
    }>;
    /**
     * Get services
     */
    getServices(repositoryId: string): Promise<{
        services: number | undefined;
    }>;
    /**
     * Get APIs
     */
    getApis(repositoryId: string): Promise<{
        apis: number | undefined;
    }>;
}
export declare const repositoryAnalysisService: RepositoryAnalysisService;
//# sourceMappingURL=repository-analysis.service.d.ts.map