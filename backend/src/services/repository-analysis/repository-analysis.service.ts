import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';
import { Repository } from '../../models/Repository';
import { IRepository } from '../../types';

export class RepositoryAnalysisService {
  /**
   * Clone a git repository to local filesystem (TEMP_REPO_DIR only)
   */
  async cloneRepository(url: string): Promise<string> {
    const repoDirName = `repo_${uuidv4().slice(0, 8)}`;
    const clonePath = path.join(env.tempRepoDir, repoDirName);

    if (!fs.existsSync(env.tempRepoDir)) {
      fs.mkdirSync(env.tempRepoDir, { recursive: true });
    }

    logger.info(`Cloning repository from ${url} to ${clonePath}`);

    try {
      // Shallow clone for MVP speed
      await simpleGit().clone(url, clonePath, ['--depth=1']);
      logger.info(`Repository cloned successfully to ${clonePath}`);
      return clonePath;
    } catch (error: any) {
      logger.error(`Failed to clone repository: ${error.message}`);
      throw new AppError(`Failed to clone repository: ${error.message}`, 400, 'CLONE_FAILED');
    }
  }

  /**
   * Extract a ZIP file to local filesystem
   */
  async extractZip(zipPath: string): Promise<string> {
    const extractDirName = `repo_${uuidv4().slice(0, 8)}`;
    const extractPath = path.join(env.uploadDir, extractDirName);

    if (!fs.existsSync(env.uploadDir)) {
      fs.mkdirSync(env.uploadDir, { recursive: true });
    }

    logger.info(`Extracting ZIP from ${zipPath} to ${extractPath}`);
    
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);
      logger.info(`ZIP extracted successfully to ${extractPath}`);
      return extractPath;
    } catch (error: any) {
      logger.error(`Failed to extract ZIP: ${error.message}`);
      throw new AppError('Failed to extract ZIP file', 400, 'EXTRACT_FAILED');
    }
  }

  /**
   * Analyze repository files and detect metadata (no embeddings/memory yet)
   */
  async analyzeRepository(repoPath: string, repositoryId: string): Promise<any> {
    await Repository.findByIdAndUpdate(repositoryId, { status: 'analyzing' });

    try {
      const analysis = await this.detectMetadata(repoPath);

      // Persist repository metadata
      await Repository.findByIdAndUpdate(repositoryId, {
        ...analysis,
        status: 'analyzed',
      });

      logger.info(`Repository ${repositoryId} analyzed successfully`);
      return analysis;
    } catch (error: any) {
      logger.error(`Analysis failed for ${repositoryId}: ${error.message}`);
      await Repository.findByIdAndUpdate(repositoryId, {
        status: 'failed',
        errorMessage: error.message,
      });
      throw error;
    }
  }

  private isIgnorableDir(dirName: string): boolean {
    return (
      dirName === 'node_modules' ||
      dirName === '.git' ||
      dirName === 'dist' ||
      dirName === '.next' ||
      dirName === 'build' ||
      dirName === 'coverage'
    );
  }

  /**
   * Get all files recursively from a directory (+ counts)
   */
  private walkRepository(repoPath: string): { files: string[]; totalFolders: number } {
    const files: string[] = [];
    let totalFolders = 0;

    const walk = (dirPath: string) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          if (this.isIgnorableDir(entry.name)) continue;
          totalFolders += 1;
          walk(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    };

    walk(repoPath);
    return { files, totalFolders };
  }

  private detectPackageManager(repoPath: string): 'npm' | 'yarn' | 'pnpm' | 'unknown' {
    const has = (p: string) => fs.existsSync(path.join(repoPath, p));
    if (has('pnpm-lock.yaml')) return 'pnpm';
    if (has('yarn.lock')) return 'yarn';
    if (has('package-lock.json')) return 'npm';
    return 'unknown';
  }

  private detectLanguages(files: string[]): string[] {
    const hasExt = (exts: string[]) => files.some(f => exts.some(e => f.endsWith(e)));
    const langs: string[] = [];
    if (hasExt(['.ts', '.tsx'])) langs.push('TypeScript');
    if (hasExt(['.js', '.jsx'])) langs.push('JavaScript');
    if (hasExt(['.py'])) langs.push('Python');
    if (hasExt(['.go'])) langs.push('Go');
    if (hasExt(['.java'])) langs.push('Java');
    if (hasExt(['.rb'])) langs.push('Ruby');
    if (langs.length === 0) langs.push('Unknown');
    return Array.from(new Set(langs));
  }

  private detectFrameworkFromDeps(depNames: string): string {
    const s = depNames.toLowerCase();
    if (s.includes('next')) return 'Next.js';
    if (s.includes('react')) return 'React';
    if (s.includes('vue')) return 'Vue';
    if (s.includes('angular')) return 'Angular';
    if (s.includes('express')) return 'Express';
    if (s.includes('nestjs')) return 'NestJS';
    return 'Unknown';
  }

  private detectDatabaseFromDeps(depNames: string, prismaSchema?: string): string {
    const s = depNames.toLowerCase();
    if (s.includes('mongoose') || s.includes('mongodb')) return 'MongoDB';
    if (s.includes('pg') || s.includes('postgres') || s.includes('sequelize')) return 'PostgreSQL';
    if (s.includes('mysql') || s.includes('mysql2')) return 'MySQL';
    if (s.includes('sqlite')) return 'SQLite';

    if (s.includes('prisma') && prismaSchema) {
      const schema = prismaSchema.toLowerCase();
      if (schema.includes('mongodb')) return 'MongoDB';
      if (schema.includes('postgresql')) return 'PostgreSQL';
      if (schema.includes('mysql')) return 'MySQL';
      if (schema.includes('sqlite')) return 'SQLite';
    }
    return 'Unknown';
  }

  private detectAuthFromDeps(depNames: string): string {
    const s = depNames.toLowerCase();
    if (s.includes('next-auth') || s.includes('nextauth')) return 'NextAuth';
    if (s.includes('passport')) return 'Passport';
    if (s.includes('jsonwebtoken') || s.includes('jwt')) return 'JWT';
    if (s.includes('oauth')) return 'OAuth';
    if (s.includes('passport') === false && s.includes('bcrypt')) return 'Session Auth';
    if (s.includes('passport')) return 'Passport';
    if (s.includes('session')) return 'Session Auth';
    return 'Unknown';
  }

  private countHeuristics(files: string[]) {
    const services = files.filter(f => /service/i.test(path.basename(f)) || /services/i.test(f)).length;
    const apis = files.filter(f => /routes/i.test(f) || /route/i.test(f) || /controller/i.test(f) || /endpoint/i.test(f)).length;
    const modules = files.filter(f => /module/i.test(f)).length;
    return { services, apis, modules };
  }

  private async detectMetadata(repoPath: string): Promise<{
    repositoryUrl?: string;
    framework: string;
    languages: string[];
    packageManager: string;
    dependencies: string[];
    database: string;
    authentication: string;
    totalFiles: number;
    totalFolders: number;
    readmePresent: boolean;
    services: number;
    apis: number;
    modules: number;
    name: string;
  }> {
    const { files, totalFolders } = this.walkRepository(repoPath);
    const totalFiles = files.length;

    if (!files.length) {
      throw new AppError('Empty repository', 400, 'EMPTY_REPOSITORY');
    }

    const rootPackageJson = files.find(f => f.endsWith('package.json') && f.split(path.sep).includes('package.json') && !f.includes('node_modules'));
    let packageJsonContent: any = {};
    let name = path.basename(repoPath);

    if (rootPackageJson) {
      try {
        const content = fs.readFileSync(rootPackageJson, 'utf-8');
        packageJsonContent = JSON.parse(content);
        name = packageJsonContent.name || name;
      } catch {
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
    let prismaSchema = undefined as string | undefined;
    const prismaFile = files.find(f => f.endsWith('schema.prisma'));
    if (prismaFile) {
      try {
        prismaSchema = fs.readFileSync(prismaFile, 'utf-8');
      } catch {
        prismaSchema = undefined;
      }
    }

    const database = this.detectDatabaseFromDeps(depNamesStr, prismaSchema);
    const authentication = this.detectAuthFromDeps(depNamesStr);

    const languages = this.detectLanguages(files);
    const packageManager = this.detectPackageManager(repoPath);

    const { services, apis, modules } = this.countHeuristics(files);

    const readmePresent = ['README.md', 'README.MD', 'README'].some(r => fs.existsSync(path.join(repoPath, r)));

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
  async getIntelligenceReport(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

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
  async getFrameworks(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
    return { framework: repo.framework, languages: repo.languages || [] };
  }

  /**
   * Get dependencies
   */
  async getDependencies(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
    return { dependencies: [] }; // Simplified - full dependency analysis in memory service
  }

  /**
   * Get services
   */
  async getServices(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
    return { services: repo.services };
  }

  /**
   * Get APIs
   */
  async getApis(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
    return { apis: repo.apis };
  }
}

export const repositoryAnalysisService = new RepositoryAnalysisService();