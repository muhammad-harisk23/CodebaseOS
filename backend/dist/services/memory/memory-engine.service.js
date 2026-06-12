"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryEngineService = exports.MemoryEngineService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../utils/logger");
const error_middleware_1 = require("../../middleware/error.middleware");
const RepositoryChunk_1 = require("../../models/RepositoryChunk");
const Repository_1 = require("../../models/Repository");
const KnowledgeGraph_1 = require("../../models/KnowledgeGraph");
class MemoryEngineService {
    /**
     * Process repository files and create memory chunks
     */
    async processRepositoryMemory(repoPath, repositoryId) {
        logger_1.logger.info(`Processing memory for repository ${repositoryId}`);
        try {
            const files = this.getAllFiles(repoPath);
            let filesIndexed = 0;
            // Delete existing chunks for this repository
            await RepositoryChunk_1.RepositoryChunk.deleteMany({ repositoryId });
            for (const filePath of files) {
                const relativePath = path_1.default.relative(repoPath, filePath);
                const content = fs_1.default.readFileSync(filePath, 'utf-8');
                const chunks = this.chunkContent(content, relativePath);
                for (let i = 0; i < chunks.length; i++) {
                    await RepositoryChunk_1.RepositoryChunk.create({
                        repositoryId,
                        filePath: relativePath,
                        module: this.detectModule(relativePath),
                        summary: '',
                        chunkContent: chunks[i],
                        relationships: [],
                    });
                }
                filesIndexed++;
            }
            // Build knowledge graph
            await this.buildKnowledgeGraph(repositoryId, repoPath);
            // Update repository metadata
            await Repository_1.Repository.findByIdAndUpdate(repositoryId, {
                services: files.filter(f => f.toLowerCase().includes('service')).length,
                apis: files.filter(f => f.toLowerCase().includes('route') || f.toLowerCase().includes('controller')).length,
                modules: files.filter(f => f.toLowerCase().includes('module')).length,
            });
            logger_1.logger.info(`Memory processed for ${repositoryId}: ${filesIndexed} files indexed`);
        }
        catch (error) {
            logger_1.logger.error(`Memory processing failed for ${repositoryId}: ${error.message}`);
            throw new error_middleware_1.AppError(`Memory processing failed: ${error.message}`, 500, 'MEMORY_PROCESSING_FAILED');
        }
    }
    /**
     * Get memory stats for a repository
     */
    async getMemoryReport(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        const chunks = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId });
        const filesIndexed = await RepositoryChunk_1.RepositoryChunk.distinct('filePath', { repositoryId });
        return {
            filesIndexed: filesIndexed.length,
            chunks: chunks.length,
            apis: repo.apis || 0,
            services: repo.services || 0,
            coverage: chunks.length > 0 ? Math.min(100, Math.round((filesIndexed.length / Math.max(filesIndexed.length, 1)) * 100)) : 0,
        };
    }
    /**
     * Get all chunks for a repository
     */
    async getRepositoryChunks(repositoryId) {
        const chunks = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId }).limit(100);
        return chunks;
    }
    /**
     * Get a single chunk by ID
     */
    async getChunkDetails(chunkId) {
        const chunk = await RepositoryChunk_1.RepositoryChunk.findById(chunkId);
        if (!chunk)
            throw new error_middleware_1.AppError('Chunk not found', 404, 'CHUNK_NOT_FOUND');
        return chunk;
    }
    /**
     * Get knowledge graph
     */
    async getKnowledgeGraph(repositoryId) {
        const graph = await KnowledgeGraph_1.KnowledgeGraph.findOne({ repositoryId });
        if (!graph)
            throw new error_middleware_1.AppError('Knowledge graph not found', 404, 'GRAPH_NOT_FOUND');
        return graph;
    }
    /**
     * Search knowledge graph
     */
    async searchKnowledgeGraph(repositoryId, query) {
        const graph = await KnowledgeGraph_1.KnowledgeGraph.findOne({ repositoryId });
        if (!graph)
            throw new error_middleware_1.AppError('Knowledge graph not found', 404, 'GRAPH_NOT_FOUND');
        const filteredNodes = graph.nodes.filter(n => n.label.toLowerCase().includes(query.toLowerCase()) ||
            n.type.toLowerCase().includes(query.toLowerCase()));
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredEdges = graph.edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
        return { nodes: filteredNodes, edges: filteredEdges };
    }
    /**
     * Get all files recursively
     */
    getAllFiles(dirPath) {
        const files = [];
        try {
            const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path_1.default.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== '.next') {
                        files.push(...this.getAllFiles(fullPath));
                    }
                }
                else {
                    const ext = path_1.default.extname(entry.name).toLowerCase();
                    // Only process text-based source files
                    if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.java', '.rb', '.php', '.json', '.yaml', '.yml', '.md', '.css', '.scss', '.html', '.vue', '.svelte'].includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        }
        catch (e) {
            // Skip directories we can't access
        }
        return files;
    }
    /**
     * Chunk content into manageable pieces
     */
    chunkContent(content, filePath) {
        const maxChunkSize = 4000;
        const lines = content.split('\n');
        const chunks = [];
        let currentChunk = '';
        let currentSize = 0;
        for (const line of lines) {
            if (currentSize + line.length > maxChunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk);
                currentChunk = '';
                currentSize = 0;
            }
            currentChunk += line + '\n';
            currentSize += line.length + 1;
        }
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }
        return chunks.length > 0 ? chunks : [content];
    }
    /**
     * Detect module from file path
     */
    detectModule(filePath) {
        const parts = filePath.replace(/\\/g, '/').split('/');
        // Common module indicators
        if (filePath.includes('auth'))
            return 'Authentication';
        if (filePath.includes('user'))
            return 'Users';
        if (filePath.includes('payment'))
            return 'Payments';
        if (filePath.includes('order'))
            return 'Orders';
        if (filePath.includes('product'))
            return 'Products';
        if (filePath.includes('cart'))
            return 'Cart';
        if (filePath.includes('email'))
            return 'Notifications';
        if (filePath.includes('notification'))
            return 'Notifications';
        if (filePath.includes('api'))
            return 'API';
        if (filePath.includes('middleware'))
            return 'Middleware';
        if (filePath.includes('config'))
            return 'Configuration';
        if (filePath.includes('database') || filePath.includes('model'))
            return 'Database';
        if (filePath.includes('util') || filePath.includes('helper'))
            return 'Utilities';
        if (filePath.includes('service'))
            return 'Services';
        if (filePath.includes('controller'))
            return 'Controllers';
        if (filePath.includes('route'))
            return 'Routes';
        return parts[0] || 'Unknown';
    }
    /**
     * Build knowledge graph from repository structure
     */
    async buildKnowledgeGraph(repositoryId, repoPath) {
        const chunks = await RepositoryChunk_1.RepositoryChunk.find({ repositoryId });
        // Extract unique modules as nodes
        const moduleSet = new Set(chunks.map(c => c.module).filter(Boolean));
        const modules = Array.from(moduleSet);
        const nodes = modules.map((m, i) => ({
            id: `module_${i}`,
            type: 'module',
            label: m || 'Unknown',
        }));
        // Create edges between related modules
        const edges = [];
        for (let i = 0; i < modules.length - 1; i++) {
            edges.push({
                source: `module_${i}`,
                target: `module_${i + 1}`,
                type: 'relationship',
            });
        }
        await KnowledgeGraph_1.KnowledgeGraph.findOneAndUpdate({ repositoryId }, { repositoryId, nodes, edges, createdAt: new Date() }, { upsert: true, new: true });
        logger_1.logger.info(`Knowledge graph built for ${repositoryId} with ${nodes.length} nodes`);
    }
    /**
     * Get architecture graph
     */
    async getArchitectureGraph(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        // Build architecture nodes
        const nodes = [
            { id: 'frontend', type: 'layer', label: 'Frontend' },
            { id: 'api', type: 'layer', label: 'API Layer' },
            { id: 'auth', type: 'layer', label: 'Authentication' },
            { id: 'services', type: 'layer', label: 'Services' },
            { id: 'database', type: 'layer', label: repo.database || 'Database' },
            { id: 'external', type: 'layer', label: 'External Systems' },
        ];
        const edges = [
            { source: 'frontend', target: 'api', type: 'calls' },
            { source: 'api', target: 'auth', type: 'uses' },
            { source: 'api', target: 'services', type: 'routes_to' },
            { source: 'auth', target: 'services', type: 'authenticates' },
            { source: 'services', target: 'database', type: 'persists' },
            { source: 'services', target: 'external', type: 'integrates' },
        ];
        return { nodes, edges, complexityScore: repo.services ? Math.min(100, repo.services * 8) : 50 };
    }
    /**
     * Get architecture complexity
     */
    async getArchitectureComplexity(repositoryId) {
        const graph = await this.getArchitectureGraph(repositoryId);
        return { complexityScore: graph.complexityScore };
    }
}
exports.MemoryEngineService = MemoryEngineService;
exports.memoryEngineService = new MemoryEngineService();
//# sourceMappingURL=memory-engine.service.js.map