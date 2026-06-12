import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';
import { Repository } from '../../models/Repository';
import { RepositoryDocument, IRepositoryDocumentDoc } from '../../models/RepositoryDocument';
import { RepositoryChunk } from '../../models/RepositoryChunk';
import { LearningMission } from '../../models/LearningMission';
import { KnowledgeInterview } from '../../models/KnowledgeInterview';
import { geminiService } from '../gemini/gemini.service';
import { RepositoryRisk } from '../../models/RepositoryRisk';
import { RepositoryScore } from '../../models/RepositoryScore';

export class DocumentationService {
  /**
   * Generate documentation for a repository
   */
  async generateDocumentation(repositoryId: string, type: string): Promise<IRepositoryDocumentDoc> {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    let content = '';

    switch (type) {
      case 'README':
        content = await this.generateReadme(repo);
        break;
      case 'architecture':
        content = await this.generateArchitectureDoc(repo);
        break;
      case 'api':
        content = await this.generateApiDoc(repo);
        break;
      case 'onboarding':
        content = await this.generateOnboardingGuide(repo);
        break;
      case 'maintenance':
        content = await this.generateMaintenanceGuide(repo);
        break;
      case 'knowledge_transfer':
        content = await this.generateKnowledgeTransferPlan(repo);
        break;
      default:
        throw new AppError(`Unknown documentation type: ${type}`, 400, 'INVALID_DOC_TYPE');
    }

    // Save documentation
    const doc = await RepositoryDocument.create({
      repositoryId,
      type: type as any,
      content,
      generatedBy: 'agent',
    });

    logger.info(`Documentation generated: ${type} for ${repositoryId}`);
    return doc;
  }

  /**
   * Get all documentation for a repository
   */
  async getDocumentation(repositoryId: string) {
    return RepositoryDocument.find({ repositoryId }).sort({ type: 1 });
  }

  /**
   * Export all documentation for a repository
   */
  async exportDocumentation(repositoryId: string) {
    const docs = await RepositoryDocument.find({ repositoryId });
    const repo = await Repository.findById(repositoryId);

    const exportObj: Record<string, string> = {};
    for (const doc of docs) {
      exportObj[`${doc.type}.md`] = doc.content;
    }

    return {
      repositoryName: repo?.name || 'unknown',
      documentation: exportObj,
    };
  }

  /**
   * Generate learning missions
   */
  async generateLearningMissions(repositoryId: string): Promise<any[]> {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    const metadata = {
      framework: repo.framework,
      language: (repo.languages || [])[0] || 'Unknown',
      database: repo.database,
      authentication: repo.authentication,
    };

    let missionsData: any[];
    try {
      const aiMissions = await geminiService.generateLearningMissions(repo.name, metadata);
      missionsData = JSON.parse(aiMissions);
    } catch {
      // Default missions
      missionsData = [
        { title: 'Understand Repository Architecture', difficulty: 'medium', estimatedTime: '2 hours', objective: 'Understand the overall architecture and component relationships' },
        { title: 'Trace Authentication Flow', difficulty: 'medium', estimatedTime: '1.5 hours', objective: 'Understand how authentication is implemented end-to-end' },
        { title: 'Explore Database Schema', difficulty: 'easy', estimatedTime: '1 hour', objective: 'Understand the database models and relationships' },
        { title: 'Map API Endpoints', difficulty: 'easy', estimatedTime: '1 hour', objective: 'Identify and document all API endpoints' },
        { title: 'Review Dependency Health', difficulty: 'hard', estimatedTime: '3 hours', objective: 'Audit dependencies and identify upgrade requirements' },
      ];
    }

    // Delete old missions
    await LearningMission.deleteMany({ repositoryId });

    // Create new missions
    const missions = [];
    for (const m of missionsData) {
      const mission = await LearningMission.create({
        repositoryId,
        title: m.title,
        difficulty: m.difficulty || 'medium',
        estimatedTime: m.estimatedTime || '1 hour',
        objective: m.objective || m.title,
        status: 'pending',
      });
      missions.push(mission);
    }

    logger.info(`Learning missions generated for ${repositoryId}`);
    return missions;
  }

  /**
   * Get learning missions
   */
  async getLearningMissions(repositoryId: string) {
    return LearningMission.find({ repositoryId }).sort({ difficulty: 1 });
  }

  /**
   * Complete a learning mission
   */
  async completeMission(missionId: string) {
    const mission = await LearningMission.findByIdAndUpdate(
      missionId,
      { status: 'completed' },
      { new: true }
    );
    if (!mission) throw new AppError('Mission not found', 404, 'MISSION_NOT_FOUND');
    return mission;
  }

  /**
   * Start knowledge interview
   */
  async startInterview(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    const metadata = {
      framework: repo.framework,
      language: (repo.languages || [])[0] || 'Unknown',
      database: repo.database,
      authentication: repo.authentication,
    };

    let questions: any[];
    try {
      const aiQuestions = await geminiService.generateInterviewQuestions(repo.name, metadata);
      questions = JSON.parse(aiQuestions);
    } catch {
      questions = [
        { question: 'How is authentication implemented in this repository?', category: 'authentication', correctAnswer: 'Review auth module' },
        { question: 'What database technology is used?', category: 'database', correctAnswer: 'Check database configuration' },
        { question: 'Describe the high-level architecture.', category: 'architecture', correctAnswer: 'See architecture graph' },
        { question: 'How are API routes organized?', category: 'architecture', correctAnswer: 'Check routes directory' },
        { question: 'What authentication middleware is used?', category: 'authentication', correctAnswer: 'Review middleware files' },
        { question: 'How is data persisted?', category: 'database', correctAnswer: 'Check data access layer' },
        { question: 'What security measures are implemented?', category: 'security', correctAnswer: 'Review security modules' },
        { question: 'How are errors handled?', category: 'architecture', correctAnswer: 'Check error handling middleware' },
        { question: 'How are tokens managed?', category: 'authentication', correctAnswer: 'Review token service' },
        { question: 'What input validation is used?', category: 'security', correctAnswer: 'Check validation schemas' },
      ];
    }

    const interview = await KnowledgeInterview.create({
      repositoryId,
      questions: questions.map((q: any) => ({
        question: q.question,
        category: q.category,
        correctAnswer: q.correctAnswer || '',
        score: 0,
      })),
      authenticationScore: 0,
      databaseScore: 0,
      architectureScore: 0,
      securityScore: 0,
      overallScore: 0,
      status: 'in_progress',
    });

    return interview;
  }

  /**
   * Submit answer for interview question
   */
  async submitAnswer(interviewId: string, questionIndex: number, answer: string) {
    const interview = await KnowledgeInterview.findById(interviewId);
    if (!interview) throw new AppError('Interview not found', 404, 'INTERVIEW_NOT_FOUND');

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      throw new AppError('Invalid question index', 400, 'INVALID_QUESTION');
    }

    const question = interview.questions[questionIndex];
    if (!question) throw new AppError('Question not found', 404, 'QUESTION_NOT_FOUND');

    question.answer = answer;
    question.score = answer.trim().length > 10 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 50) + 30;

    // Recalculate scores
    const categoryScores: Record<string, number[]> = {};
    for (const q of interview.questions) {
      if (q.score !== undefined) {
        if (!categoryScores[q.category]) categoryScores[q.category] = [];
        categoryScores[q.category]!.push(q.score);
      }
    }

    interview.authenticationScore = this.averageScore(categoryScores['authentication'] || []);
    interview.databaseScore = this.averageScore(categoryScores['database'] || []);
    interview.architectureScore = this.averageScore(categoryScores['architecture'] || []);
    interview.securityScore = this.averageScore(categoryScores['security'] || []);

    const allScores = Object.values(categoryScores).flat();
    interview.overallScore = this.averageScore(allScores);

    // Check if all questions answered
    const allAnswered = interview.questions.every(q => q.answer);
    if (allAnswered) {
      interview.status = 'completed';
    }

    interview.markModified('questions');
    await interview.save();

    return interview;
  }

  /**
   * Get interview results
   */
  async getInterviewResults(interviewId: string) {
    const interview = await KnowledgeInterview.findById(interviewId);
    if (!interview) throw new AppError('Interview not found', 404, 'INTERVIEW_NOT_FOUND');
    return interview;
  }

  /**
   * Generate freelancer rescue report
   */
  async generateRescueReport(repositoryId: string) {
    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    const scores = await RepositoryScore.findOne({ repositoryId });
    const risks = await RepositoryRisk.find({ repositoryId, severity: { $in: ['critical', 'high'] } });

    // Get critical files from chunks
    const chunks = await RepositoryChunk.find({ repositoryId }).limit(20);
    const criticalFiles = chunks.map(c => c.filePath).filter(Boolean).slice(0, 5);
    const dangerZones = risks.map(r => r.title).slice(0, 5);

    const recoverabilityScore = scores?.recoverabilityScore?.score ?? 50;

    return {
      recoverability: recoverabilityScore,
      recommendation: scores?.recoverabilityScore ? (
        recoverabilityScore >= 81 ? 'continue' :
        recoverabilityScore >= 61 ? 'refactor-minor' :
        recoverabilityScore >= 41 ? 'refactor-major' : 'rebuild'
      ) : 'analyze',
      criticalFiles,
      dangerZones,
      projectSummary: `${repo.name} - ${repo.framework || 'Unknown'} project`,
      architectureOverview: `${(repo.languages || [])[0] || 'Unknown'} based application with ${repo.services || 0} services and ${repo.apis || 0} APIs`,
      topFilesToRead: criticalFiles,
      suggestedStartingPoint: criticalFiles[0] || 'README',
    };
  }

  // ============ Private Helpers ============

  private averageScore(scores: number[]): number {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  private async generateReadme(repo: any): Promise<string> {
    const metadata = {
      framework: repo.framework,
      language: (repo.languages || [])[0],
      database: repo.database,
      authentication: repo.authentication,
      services: repo.services,
      apis: repo.apis
    };
    try {
      return await geminiService.generateReadme(repo.name, metadata, '');
    } catch {
      return this.fallbackReadme(repo);
    }
  }

  private async generateArchitectureDoc(repo: any): Promise<string> {
    const metadata = {
      framework: repo.framework,
      language: (repo.languages || [])[0],
      database: repo.database,
      authentication: repo.authentication
    };
    try {
      return await geminiService.generateArchitectureSummary(repo.name, metadata);
    } catch {
      return this.fallbackArchitectureDoc(repo);
    }
  }

  private async generateApiDoc(repo: any): Promise<string> {
    return `# API Documentation\n\n## Overview\nRepository: ${repo.name}\nFramework: ${repo.framework || 'Unknown'}\n\n## Endpoints\nAPI endpoints detected during analysis.\n\n${repo.apis || 0} API endpoints identified.\n\n> Generated by CodebaseOS Documentation Engine.`;
  }

  private async generateOnboardingGuide(repo: any): Promise<string> {
    const lang = (repo.languages || [])[0] || repo.language || 'Programming language';
    return `# Onboarding Guide\n\n## Getting Started\n\n1. Clone the repository\n2. Install dependencies\n3. Set up environment variables\n4. Run the application\n\n## Prerequisites\n- ${lang} runtime\n- ${repo.database || 'Database'} installed\n\n## Project Structure\nThe repository follows standard project organization.\n\n## Development Workflow\n1. Create a new branch\n2. Make changes\n3. Test thoroughly\n4. Create merge request\n\n> Generated by CodebaseOS Documentation Engine.`;
  }

  private async generateMaintenanceGuide(repo: any): Promise<string> {
    return `# Maintenance Guide\n\n## Regular Tasks\n- Update dependencies regularly\n- Review security advisories\n- Monitor application health\n- Backup database\n\n## Dependency Management\nUse package manager to update and audit dependencies.\n\n## Troubleshooting\nCommon issues and solutions documented in the project.\n\n> Generated by CodebaseOS Documentation Engine.`;
  }

  private async generateKnowledgeTransferPlan(repo: any): Promise<string> {
    return `# Knowledge Transfer Plan\n\n## Overview\nRepository: ${repo.name}\n\n## Critical Knowledge Areas\n1. Architecture decisions and trade-offs\n2. Business logic and workflows\n3. Integration points and APIs\n4. Deployment and operations\n\n## Transfer Methods\n- Documentation reviews\n- Pair programming sessions\n- Code walkthroughs\n- Learning missions\n\n## Success Criteria\n- Team members can independently maintain the repository\n- Documentation covers all critical areas\n- Bus factor increased to 3+\n\n> Generated by CodebaseOS Documentation Engine.`;
  }

  private fallbackReadme(repo: any): string {
    const lang = (repo.languages || [])[0] || repo.language || 'Unknown';
    return `# ${repo.name}

## Overview
This project was analyzed by CodebaseOS.

## Technology Stack
- **Framework:** ${repo.framework || 'Unknown'}
- **Language:** ${lang}
- **Database:** ${repo.database || 'Unknown'}
- **Authentication:** ${repo.authentication || 'Unknown'}

## Quick Start
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the application

## Project Structure
Standard project structure with clear separation of concerns.

> Generated by CodebaseOS Documentation Engine.`;
  }

  private fallbackArchitectureDoc(repo: any): string {
    const lang = (repo.languages || [])[0] || repo.language || 'Unknown';
    return `# Architecture Documentation

## High-Level Architecture
The repository follows standard architectural patterns.

## Components
- **Frontend Layer** (if applicable)
- **API/Routing Layer**
- **Business Logic Services**
- **Data Access Layer**
- **External Integrations**

## Technology Decisions
- **Framework:** ${repo.framework || 'Unknown'}
- **Language:** ${lang}
- **Database:** ${repo.database || 'Unknown'}
- **Authentication:** ${repo.authentication || 'Unknown'}

## Data Flow
1. Requests enter through routing layer
2. Authentication/Authorization middleware processes
3. Business logic services handle operations
4. Data is persisted through data layer
5. Responses returned to caller

> Generated by CodebaseOS Documentation Engine.`;
  }
}

export const documentationService = new DocumentationService();