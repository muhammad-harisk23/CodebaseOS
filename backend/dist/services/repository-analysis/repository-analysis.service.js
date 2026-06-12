"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryAnalysisService = exports.RepositoryAnalysisService = void 0;
const simple_git_1 = __importDefault(require("simple-git"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const uuid_1 = require("uuid");
const env_1 = require("../../config/env");
const logger_1 = require("../../utils/logger");
const error_middleware_1 = require("../../middleware/error.middleware");
const Repository_1 = require("../../models/Repository");
class RepositoryAnalysisService {
    /**
     * Clone a git repository to local filesystem (TEMP_REPO_DIR only)
     */
    async cloneRepository(url) {
        const repoDirName = `repo_${(0, uuid_1.v4)().slice(0, 8)}`;
        const clonePath = path_1.default.join(env_1.env.tempRepoDir, repoDirName);
        if (!fs_1.default.existsSync(env_1.env.tempRepoDir)) {
            fs_1.default.mkdirSync(env_1.env.tempRepoDir, { recursive: true });
        }
        logger_1.logger.info(`Cloning repository from ${url} to ${clonePath}`);
        try {
            // Shallow clone for MVP speed
            await (0, simple_git_1.default)().clone(url, clonePath, ['--depth=1']);
            logger_1.logger.info(`Repository cloned successfully to ${clonePath}`);
            return clonePath;
        }
        catch (error) {
            logger_1.logger.error(`Failed to clone repository: ${error.message}`);
            throw new error_middleware_1.AppError(`Failed to clone repository: ${error.message}`, 400, 'CLONE_FAILED');
        }
    }
    /**
     * Extract a ZIP file to local filesystem
     */
    async extractZip(zipPath) {
        const extractDirName = `repo_${(0, uuid_1.v4)().slice(0, 8)}`;
        const extractPath = path_1.default.join(env_1.env.uploadDir, extractDirName);
        if (!fs_1.default.existsSync(env_1.env.uploadDir)) {
            fs_1.default.mkdirSync(env_1.env.uploadDir, { recursive: true });
        }
        logger_1.logger.info(`Extracting ZIP from ${zipPath} to ${extractPath}`);
        try {
            const zip = new adm_zip_1.default(zipPath);
            zip.extractAllTo(extractPath, true);
            logger_1.logger.info(`ZIP extracted successfully to ${extractPath}`);
            return extractPath;
        }
        catch (error) {
            logger_1.logger.error(`Failed to extract ZIP: ${error.message}`);
            throw new error_middleware_1.AppError('Failed to extract ZIP file', 400, 'EXTRACT_FAILED');
        }
    }
    /**
     * Analyze repository files and detect metadata (no embeddings/memory yet)
     */
    async analyzeRepository(repoPath, repositoryId) {
        await Repository_1.Repository.findByIdAndUpdate(repositoryId, { status: 'analyzing' });
        try {
            const analysis = await this.detectMetadata(repoPath);
            // Persist repository metadata
            await Repository_1.Repository.findByIdAndUpdate(repositoryId, {
                ...analysis,
                status: 'analyzed',
            });
            logger_1.logger.info(`Repository ${repositoryId} analyzed successfully`);
            return analysis;
        }
        catch (error) {
            logger_1.logger.error(`Analysis failed for ${repositoryId}: ${error.message}`);
            await Repository_1.Repository.findByIdAndUpdate(repositoryId, {
                status: 'failed',
                errorMessage: error.message,
            });
            throw error;
        }
    }
    isIgnorableDir(dirName) {
        return (dirName === 'node_modules' ||
            dirName === '.git' ||
            dirName === 'dist' ||
            dirName === '.next' ||
            dirName === 'build' ||
            dirName === 'coverage');
    }
    /**
     * Get all files recursively from a directory (+ counts)
     */
    walkRepository(repoPath) {
        const files = [];
        let totalFolders = 0;
        const walk = (dirPath) => {
            const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path_1.default.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    if (this.isIgnorableDir(entry.name))
                        continue;
                    totalFolders += 1;
                    walk(fullPath);
                }
                else {
                    files.push(fullPath);
                }
            }
        };
        walk(repoPath);
        return { files, totalFolders };
    }
    detectPackageManager(repoPath) {
        const has = (p) => fs_1.default.existsSync(path_1.default.join(repoPath, p));
        if (has('pnpm-lock.yaml'))
            return 'pnpm';
        if (has('yarn.lock'))
            return 'yarn';
        if (has('package-lock.json'))
            return 'npm';
        return 'unknown';
    }
    detectLanguages(files) {
        const hasExt = (exts) => files.some(f => exts.some(e => f.endsWith(e)));
        const langs = [];
        if (hasExt(['.ts', '.tsx']))
            langs.push('TypeScript');
        if (hasExt(['.js', '.jsx']))
            langs.push('JavaScript');
        if (hasExt(['.py']))
            langs.push('Python');
        if (hasExt(['.go']))
            langs.push('Go');
        if (hasExt(['.java']))
            langs.push('Java');
        if (hasExt(['.rb']))
            langs.push('Ruby');
        if (langs.length === 0)
            langs.push('Unknown');
        return Array.from(new Set(langs));
    }
    detectFrameworkFromDeps(depNames) {
        const s = depNames.toLowerCase();
        if (s.includes('next'))
            return 'Next.js';
        if (s.includes('react'))
            return 'React';
        if (s.includes('vue'))
            return 'Vue';
        if (s.includes('angular'))
            return 'Angular';
        if (s.includes('express'))
            return 'Express';
        if (s.includes('nestjs'))
            return 'NestJS';
        return 'Unknown';
    }
    detectDatabaseFromDeps(depNames, prismaSchema) {
        const s = depNames.toLowerCase();
        if (s.includes('mongoose') || s.includes('mongodb'))
            return 'MongoDB';
        if (s.includes('pg') || s.includes('postgres') || s.includes('sequelize'))
            return 'PostgreSQL';
        if (s.includes('mysql') || s.includes('mysql2'))
            return 'MySQL';
        if (s.includes('sqlite'))
            return 'SQLite';
        if (s.includes('prisma') && prismaSchema) {
            const schema = prismaSchema.toLowerCase();
            if (schema.includes('mongodb'))
                return 'MongoDB';
            if (schema.includes('postgresql'))
                return 'PostgreSQL';
            if (schema.includes('mysql'))
                return 'MySQL';
            if (schema.includes('sqlite'))
                return 'SQLite';
        }
        return 'Unknown';
    }
    detectAuthFromDeps(depNames) {
        const s = depNames.toLowerCase();
        if (s.includes('next-auth') || s.includes('nextauth'))
            return 'NextAuth';
        if (s.includes('passport'))
            return 'Passport';
        if (s.includes('jsonwebtoken') || s.includes('jwt'))
            return 'JWT';
        if (s.includes('oauth'))
            return 'OAuth';
        if (s.includes('passport') === false && s.includes('bcrypt'))
            return 'Session Auth';
        if (s.includes('passport'))
            return 'Passport';
        if (s.includes('session'))
            return 'Session Auth';
        return 'Unknown';
    }
    countHeuristics(files) {
        const services = files.filter(f => /service/i.test(path_1.default.basename(f)) || /services/i.test(f)).length;
        const apis = files.filter(f => /routes/i.test(f) || /route/i.test(f) || /controller/i.test(f) || /endpoint/i.test(f)).length;
        const modules = files.filter(f => /module/i.test(f)).length;
        return { services, apis, modules };
    }
    async detectMetadata(repoPath) {
        const { files, totalFolders } = this.walkRepository(repoPath);
        const totalFiles = files.length;
        if (!files.length) {
            throw new error_middleware_1.AppError('Empty repository', 400, 'EMPTY_REPOSITORY');
        }
        const rootPackageJson = files.find(f => f.endsWith('package.json') && f.split(path_1.default.sep).includes('package.json') && !f.includes('node_modules'));
        let packageJsonContent = {};
        let name = path_1.default.basename(repoPath);
        if (rootPackageJson) {
            try {
                const content = fs_1.default.readFileSync(rootPackageJson, 'utf-8');
                packageJsonContent = JSON.parse(content);
                name = packageJsonContent.name || name;
            }
            catch {
                // ignore
            }
        }
        const dependenciesObj = {
            ...(packageJsonContent.dependencies || {}),
            ...(packageJsonContent.devDependencies || {}),
        };
        const dependencyKeys = Object.keys(dependenciesObj);
        const depNamesStr = dependencyKeys.join(' ');
        const framework = this.detectFrameworkFromDeps(depNamesStr);
        // prisma schema inference
        let prismaSchema = undefined;
        const prismaFile = files.find(f => f.endsWith('schema.prisma'));
        if (prismaFile) {
            try {
                prismaSchema = fs_1.default.readFileSync(prismaFile, 'utf-8');
            }
            catch {
                prismaSchema = undefined;
            }
        }
        const database = this.detectDatabaseFromDeps(depNamesStr, prismaSchema);
        const authentication = this.detectAuthFromDeps(depNamesStr);
        const languages = this.detectLanguages(files);
        const packageManager = this.detectPackageManager(repoPath);
        const { services, apis, modules } = this.countHeuristics(files);
        const readmePresent = ['README.md', 'README.MD', 'README'].some(r => fs_1.default.existsSync(path_1.default.join(repoPath, r)));
        return {
            name,
            framework,
            languages,
            packageManager,
            dependencies: dependencyKeys,
            database,
            authentication,
            totalFiles,
            totalFolders,
            readmePresent,
            services,
            apis,
            modules,
        };
    }
    /**
     * Get intelligence report for a repository
     */
    async getIntelligenceReport(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        return {
            repositoryName: repo.name,
            framework: repo.framework || 'Unknown',
            database: repo.database || 'Unknown',
            authentication: repo.authentication || 'Unknown',
            services: repo.services || 0,
            apis: repo.apis || 0,
            modules: repo.modules || 0,
        };
    }
    /**
     * Get frameworks detected
     */
    async getFrameworks(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        return { framework: repo.framework, languages: repo.languages || [] };
    }
    /**
     * Get dependencies
     */
    async getDependencies(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        return { dependencies: [] }; // Simplified - full dependency analysis in memory service
    }
    /**
     * Get services
     */
    async getServices(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        return { services: repo.services };
    }
    /**
     * Get APIs
     */
    async getApis(repositoryId) {
        const repo = await Repository_1.Repository.findById(repositoryId);
        if (!repo)
            throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
        return { apis: repo.apis };
    }
}
exports.RepositoryAnalysisService = RepositoryAnalysisService;
exports.repositoryAnalysisService = new RepositoryAnalysisService();
//# sourceMappingURL=repository-analysis.service.js.map