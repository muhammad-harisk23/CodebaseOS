import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!env.geminiApiKey) {
      logger.warn('GEMINI_API_KEY not set - Gemini features will be disabled');
    }
    this.genAI = new GoogleGenerativeAI(env.geminiApiKey || 'dummy-key');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Generate content using Gemini
   */
  private async generateContent(prompt: string): Promise<string> {
    if (!env.geminiApiKey) {
      return this.getFallbackResponse(prompt);
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      logger.error(`Gemini API error: ${error.message}`);
      // Fallback to template-based generation
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * Generate repository summary
   */
  async generateRepositorySummary(repositoryName: string, metadata: any): Promise<string> {
    const prompt = `Generate a comprehensive repository summary for "${repositoryName}".
Framework: ${metadata.framework || 'Unknown'}
Language: ${metadata.language || 'Unknown'}
Database: ${metadata.database || 'Unknown'}
Authentication: ${metadata.authentication || 'Unknown'}
Services: ${metadata.services || 0}
APIs: ${metadata.apis || 0}

Provide a professional summary covering:
1. Purpose and Overview
2. Technology Stack
3. Architecture Highlights
4. Key Features
5. Maintenance Considerations`;

    return this.generateContent(prompt);
  }

  /**
   * Generate architecture documentation
   */
  async generateArchitectureSummary(repositoryName: string, metadata: any): Promise<string> {
    const prompt = `Generate architecture documentation for "${repositoryName}".
Framework: ${metadata.framework || 'Unknown'}
Language: ${metadata.language || 'Unknown'}
Database: ${metadata.database || 'Unknown'}
Authentication: ${metadata.authentication || 'Unknown'}

Provide:
1. High-Level Architecture
2. Component Breakdown
3. Data Flow
4. Technology Decisions
5. Architecture Diagram Description`;

    return this.generateContent(prompt);
  }

  /**
   * Generate README
   */
  async generateReadme(repositoryName: string, metadata: any, summary: string): Promise<string> {
    const prompt = `Generate a professional README.md for "${repositoryName}".
Repository Summary: ${summary}

Technology Stack:
- Framework: ${metadata.framework || 'Unknown'}
- Language: ${metadata.language || 'Unknown'}
- Database: ${metadata.database || 'Unknown'}
- Authentication: ${metadata.authentication || 'Unknown'}

Include:
1. Project Title and Description
2. Quick Start Guide
3. Technology Stack
4. Project Structure
5. API Overview
6. Environment Variables
7. Contributing Guidelines
8. License`;

    return this.generateContent(prompt);
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(type: string, repositoryName: string, metadata: any): Promise<string> {
    const prompt = `Generate ${type} documentation for "${repositoryName}".
Technology: ${metadata.framework || 'Unknown'} / ${metadata.language || 'Unknown'}
Database: ${metadata.database || 'Unknown'}
Authentication: ${metadata.authentication || 'Unknown'}

Provide comprehensive, well-structured Markdown documentation.`;

    return this.generateContent(prompt);
  }

  /**
   * Generate learning missions
   */
  async generateLearningMissions(repositoryName: string, metadata: any): Promise<string> {
    const prompt = `Generate 5 learning missions for developers working on "${repositoryName}".
Technology: ${metadata.framework || 'Unknown'} / ${metadata.language || 'Unknown'}
Database: ${metadata.database || 'Unknown'}
Authentication: ${metadata.authentication || 'Unknown'}

For each mission provide:
1. Title
2. Difficulty (easy/medium/hard)
3. Estimated Time
4. Learning Objective
5. Tasks to Complete
6. Success Criteria

Format as JSON array.`;

    return this.generateContent(prompt);
  }

  /**
   * Generate knowledge interview questions
   */
  async generateInterviewQuestions(repositoryName: string, metadata: any): Promise<string> {
    const prompt = `Generate 10 knowledge interview questions about "${repositoryName}".
Technology: ${metadata.framework || 'Unknown'} / ${metadata.language || 'Unknown'}
Database: ${metadata.database || 'Unknown'}
Authentication: ${metadata.authentication || 'Unknown'}

Cover categories:
- Architecture (3 questions)
- Authentication (3 questions)
- Database (2 questions)
- Security (2 questions)

Format as JSON with: question, category, correctAnswer.`;

    return this.generateContent(prompt);
  }

  /**
   * Generate agent recommendations based on scores
   */
  async generateAgentRecommendations(scores: any, risks: any[]): Promise<string> {
    const scoresStr = JSON.stringify(scores, null, 2);
    const risksStr = JSON.stringify(risks, null, 2);

    const prompt = `Based on the following repository scores and risks, generate actionable recommendations:

Scores:
${scoresStr}

Risks:
${risksStr}

Provide:
1. Top 3 Critical Actions
2. Documentation Improvements Needed
3. Knowledge Transfer Recommendations
4. Risk Mitigation Strategies

Format as actionable items with priority levels.`;

    return this.generateContent(prompt);
  }

  /**
   * Fallback response when Gemini API is not available
   */
  private getFallbackResponse(prompt: string): string {
    logger.info('Using fallback response generation (Gemini API not configured)');
    
    if (prompt.includes('repository summary') || prompt.includes('Repository Summary')) {
      return this.generateFallbackSummary(prompt);
    }
    if (prompt.includes('README')) {
      return this.generateFallbackReadme(prompt);
    }
    if (prompt.includes('learning missions') || prompt.includes('learning mission')) {
      return this.generateFallbackMissions(prompt);
    }
    if (prompt.includes('interview questions')) {
      return this.generateFallbackQuestions(prompt);
    }
    if (prompt.includes('recommendations') || prompt.includes('Recommendations')) {
      return this.generateFallbackRecommendations(prompt);
    }
    if (prompt.includes('documentation') || prompt.includes('architecture')) {
      return this.generateFallbackDocumentation(prompt);
    }
    
    return 'Documentation and analysis generated by CodebaseOS AI Engine. Configure GEMINI_API_KEY for AI-generated content.';
  }

  private generateFallbackSummary(prompt: string): string {
    return `# Repository Analysis Summary

## Overview
This repository has been automatically analyzed by CodebaseOS.

## Technology Stack
- The repository uses standard web technologies
- Framework and language detected during analysis
- Database and authentication methods identified

## Architecture
- Service-oriented architecture detected
- Multiple modules and components identified
- API endpoints mapped and documented

## Key Findings
- Repository structure analyzed
- Dependencies inventoried
- Knowledge graph constructed
- Risks and scores calculated

## Next Steps
1. Review the detailed analysis below
2. Check risk dashboard for critical items
3. Generate documentation if needed
4. Review agent recommendations`;
  }

  private generateFallbackReadme(prompt: string): string {
    return `# Project README

## Overview
This project was analyzed by CodebaseOS.

## Quick Start
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Run the application: \`npm start\`

## Technology Stack
- Standard web technologies
- Modern development practices

## Project Structure
- Source code in organized directories
- Clear separation of concerns
- Modular architecture

## Documentation
Full documentation available in the CodebaseOS dashboard.

> Generated by CodebaseOS Documentation Engine`;
  }

  private generateFallbackMissions(prompt: string): string {
    const missions = [
      {
        title: 'Understand Repository Architecture',
        difficulty: 'medium',
        estimatedTime: '2 hours',
        objective: 'Understand the overall architecture and component relationships',
      },
      {
        title: 'Trace Authentication Flow',
        difficulty: 'medium',
        estimatedTime: '1.5 hours',
        objective: 'Understand how authentication is implemented end-to-end',
      },
      {
        title: 'Explore Database Schema',
        difficulty: 'easy',
        estimatedTime: '1 hour',
        objective: 'Understand the database models and relationships',
      },
      {
        title: 'Map API Endpoints',
        difficulty: 'easy',
        estimatedTime: '1 hour',
        objective: 'Identify and document all API endpoints',
      },
      {
        title: 'Review Dependency Health',
        difficulty: 'hard',
        estimatedTime: '3 hours',
        objective: 'Audit dependencies and identify upgrade requirements',
      },
    ];

    return JSON.stringify(missions, null, 2);
  }

  private generateFallbackQuestions(prompt: string): string {
    const questions = [
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

    return JSON.stringify(questions, null, 2);
  }

  private generateFallbackRecommendations(prompt: string): string {
    return `## Agent Recommendations

### Critical Actions (Priority: High)
1. Review and address identified risks in the Risk Center
2. Generate missing documentation for critical modules
3. Create knowledge transfer plans for high-risk areas

### Documentation Improvements
1. Generate Architecture Documentation
2. Create API Reference
3. Write Onboarding Guide
4. Document Security Procedures

### Knowledge Transfer
1. Identify bus factor risks
2. Create backup ownership plan
3. Document critical business logic
4. Set up learning missions

### Risk Mitigation
1. Address dependency vulnerabilities
2. Reduce knowledge concentration
3. Improve test coverage
4. Create maintenance guides

Generated by CodebaseOS Agent Engine. Configure GEMINI_API_KEY for AI-powered recommendations.`;
  }

  private generateFallbackDocumentation(prompt: string): string {
    return `# Repository Documentation

## Overview
This documentation was generated by CodebaseOS.

## Architecture
The repository follows standard architectural patterns with clear separation of concerns.

## Components
- Frontend layer (if applicable)
- API/Routing layer
- Business logic services
- Data access layer
- External integrations

## Data Flow
1. Requests enter through the routing layer
2. Authentication/Authorization middleware processes
3. Business logic services handle operations
4. Data is persisted through the data layer
5. Responses are returned to the caller

## Configuration
- Environment variables managed through configuration files
- Database connections configured in data layer
- External service URLs in environment config

> Generated by CodebaseOS Documentation Engine. Configure GEMINI_API_KEY for AI-generated content.`;
  }
}

export const geminiService = new GeminiService();