export declare class MemoryEngineService {
    /**
     * Process repository files and create memory chunks
     */
    processRepositoryMemory(repoPath: string, repositoryId: string): Promise<void>;
    /**
     * Get memory stats for a repository
     */
    getMemoryReport(repositoryId: string): Promise<{
        filesIndexed: number;
        chunks: number;
        apis: number;
        services: number;
        coverage: number;
    }>;
    /**
     * Get all chunks for a repository
     */
    getRepositoryChunks(repositoryId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/RepositoryChunk").IRepositoryChunkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryChunk").IRepositoryChunkDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    /**
     * Get a single chunk by ID
     */
    getChunkDetails(chunkId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/RepositoryChunk").IRepositoryChunkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/RepositoryChunk").IRepositoryChunkDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Get knowledge graph
     */
    getKnowledgeGraph(repositoryId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/KnowledgeGraph").IKnowledgeGraphDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/KnowledgeGraph").IKnowledgeGraphDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Search knowledge graph
     */
    searchKnowledgeGraph(repositoryId: string, query: string): Promise<{
        nodes: {
            id: string;
            type: string;
            label: string;
            data?: Record<string, unknown>;
        }[];
        edges: {
            source: string;
            target: string;
            type: string;
            label?: string;
        }[];
    }>;
    /**
     * Get all files recursively
     */
    private getAllFiles;
    /**
     * Chunk content into manageable pieces
     */
    private chunkContent;
    /**
     * Detect module from file path
     */
    private detectModule;
    /**
     * Build knowledge graph from repository structure
     */
    private buildKnowledgeGraph;
    /**
     * Get architecture graph
     */
    getArchitectureGraph(repositoryId: string): Promise<{
        nodes: {
            id: string;
            type: string;
            label: string;
        }[];
        edges: {
            source: string;
            target: string;
            type: string;
        }[];
        complexityScore: number;
    }>;
    /**
     * Get architecture complexity
     */
    getArchitectureComplexity(repositoryId: string): Promise<{
        complexityScore: number;
    }>;
}
export declare const memoryEngineService: MemoryEngineService;
//# sourceMappingURL=memory-engine.service.d.ts.map