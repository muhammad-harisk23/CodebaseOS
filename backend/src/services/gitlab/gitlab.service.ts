import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';
import { GitlabIssue } from '../../models/GitlabIssue';
import { AgentAction, IAgentActionDocument } from '../../models/AgentAction';

interface GitlabApiError {
  status: number;
  text: string;
}

export class GitlabService {
  private baseUrl: string;
  private token: string;
  private projectId: string;
  private maxRetries: number = 3;

  constructor() {
    this.baseUrl = env.gitlabApiUrl;
    this.token = env.gitlabToken;
    this.projectId = env.gitlabProjectId;
  }

  private get headers(): Record<string, string> {
    return {
      'PRIVATE-TOKEN': this.token,
      'Content-Type': 'application/json',
    };
  }

  private isConfigured(): boolean {
    return !!(this.token && this.projectId);
  }

  /**
   * Exponential backoff sleep helper
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch with retry logic and exponential backoff
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = this.maxRetries
  ): Promise<Response> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok || attempt === retries) {
          return response;
        }

        // Rate limited or server error – retry
        if (response.status === 429 || response.status >= 500) {
          const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          logger.warn(`GitLab API attempt ${attempt}/${retries} failed (${response.status}). Retrying in ${delayMs}ms...`);
          await this.sleep(delayMs);
          continue;
        }

        // Non-retryable error
        return response;
      } catch (error: any) {
        if (attempt === retries) {
          throw error;
        }
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        logger.warn(`GitLab API network error (attempt ${attempt}/${retries}): ${error.message}. Retrying in ${delayMs}ms...`);
        await this.sleep(delayMs);
      }
    }

    // This should not be reached but satisfies TS
    throw new AppError('GitLab API request failed after all retries', 502, 'GITLAB_RETRY_EXHAUSTED');
  }

  /**
   * Record an agent action in MongoDB for audit trail
   */
  private async recordAction(
    repositoryId: string,
    actionType: IAgentActionDocument['actionType'],
    reasoning: string,
    confidence: number,
    result?: string
  ): Promise<void> {
    try {
      await AgentAction.create({
        repositoryId,
        actionType,
        reasoning,
        confidence,
        status: result ? 'completed' : 'failed',
        result,
      });
    } catch (error: any) {
      logger.error(`Failed to record agent action: ${error.message}`);
    }
  }

  /**
   * Create a GitLab issue with retry logic and agent action tracking
   */
  async createIssue(
    repositoryId: string,
    title: string,
    description: string,
    labels: string[] = [],
    confidence: number = 0.85
  ): Promise<any> {
    if (!this.isConfigured()) {
      logger.warn('GitLab MCP not configured – storing issue locally');

      const issue = await this.storeLocalIssue(repositoryId, title, description, labels);

      await this.recordAction(
        repositoryId,
        'create_gitlab_issue',
        `GitLab not configured. Stored local issue: ${title}`,
        confidence,
        `Local issue: ${issue._id}`
      );

      return issue;
    }

    try {
      const url = `${this.baseUrl}/projects/${encodeURIComponent(this.projectId)}/issues`;
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ title, description, labels: labels.join(',') }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(`GitLab API error: ${errorText}`, response.status, 'GITLAB_ERROR');
      }

      const data: any = await response.json();
      logger.info(`GitLab issue created: #${data.iid} – ${title}`);

      // Store in local database
      const issue = await GitlabIssue.create({
        repositoryId,
        gitlabIssueId: data.iid,
        title,
        description,
        status: 'open',
        url: data.web_url,
        labels,
      });

      await this.recordAction(
        repositoryId,
        'create_gitlab_issue',
        `Created GitLab issue #${data.iid}: ${title}`,
        confidence,
        `GitLab issue #${data.iid}: ${data.web_url}`
      );

      return issue;
    } catch (error: any) {
      logger.error(`GitLab issue creation failed: ${error.message}`);

      // Fallback to local storage
      const issue = await this.storeLocalIssue(repositoryId, title, description, labels);

      await this.recordAction(
        repositoryId,
        'create_gitlab_issue',
        `GitLab API error – fell back to local storage: ${title}`,
        confidence * 0.8,
        `Local fallback issue: ${issue._id}`
      );

      return issue;
    }
  }

  /**
   * Create documentation issue
   */
  async createDocumentationIssue(repositoryId: string, moduleName: string): Promise<any> {
    const title = `Generate ${moduleName} Documentation`;
    const description = [
      `## Documentation Required`,
      ``,
      `The **${moduleName}** module requires comprehensive documentation.`,
      ``,
      `### Tasks`,
      `- [ ] Create architecture guide`,
      `- [ ] Document API endpoints`,
      `- [ ] Write usage examples`,
      `- [ ] Add setup instructions`,
      ``,
      `### Reason`,
      `Automatically generated by CodebaseOS Agent – Knowledge Debt Detection`,
    ].join('\n');

    return this.createIssue(repositoryId, title, description, ['documentation', 'agent-generated'], 0.9);
  }

  /**
   * Create learning mission issue
   */
  async createLearningMissionIssue(repositoryId: string, missionTitle: string, objective: string): Promise<any> {
    const title = `Learning Mission: ${missionTitle}`;
    const description = [
      `## Learning Mission`,
      ``,
      `### Objective`,
      objective,
      ``,
      `### Tasks`,
      `- [ ] Study the relevant module`,
      `- [ ] Complete hands-on exercises`,
      `- [ ] Document findings`,
      `- [ ] Share knowledge with team`,
      ``,
      `### Reason`,
      `Automatically generated by CodebaseOS Agent – Knowledge Distribution`,
    ].join('\n');

    return this.createIssue(repositoryId, title, description, ['learning', 'agent-generated'], 0.85);
  }

  /**
   * Create ownership risk issue
   */
  async createOwnershipRiskIssue(repositoryId: string, moduleName: string, ownerPercent: number): Promise<any> {
    const title = `Ownership Risk: ${moduleName} – Knowledge Concentration`;
    const description = [
      `## Ownership Risk Detected`,
      ``,
      `### Module`,
      moduleName,
      ``,
      `### Current Ownership`,
      `${ownerPercent}% owned by single contributor`,
      ``,
      `### Recommended Actions`,
      `- [ ] Assign backup owner`,
      `- [ ] Create knowledge transfer plan`,
      `- [ ] Document module architecture`,
      `- [ ] Schedule pair programming sessions`,
      ``,
      `### Reason`,
      `Automatically generated by CodebaseOS Agent – Bus Factor Analysis`,
    ].join('\n');

    return this.createIssue(repositoryId, title, description, ['ownership', 'agent-generated', 'high-priority'], 0.92);
  }

  /**
   * Create survivability issue
   */
  async createSurvivabilityIssue(repositoryId: string, survivabilityScore: number): Promise<any> {
    const title = `Repository Survivability Risk – Score: ${survivabilityScore}`;
    const description = [
      `## Survivability Risk Detected`,
      ``,
      `### Current Survivability Score: **${survivabilityScore}/100**`,
      ``,
      survivabilityScore < 40
        ? '> ⚠️ Critical: Repository may not survive without the original creator.'
        : '> ⚠️ Elevated: Repository survivability requires improvement.',
      ``,
      `### Recommended Actions`,
      `- [ ] Create knowledge transfer plan`,
      `- [ ] Generate comprehensive documentation`,
      `- [ ] Assign backup owners for each module`,
      `- [ ] Document critical workflows and decision logs`,
      `- [ ] Create onboarding guide for new contributors`,
      ``,
      `### Reason`,
      `Automatically generated by CodebaseOS Agent – Survivability Analysis`,
    ].join('\n');

    return this.createIssue(repositoryId, title, description, ['survivability', 'agent-generated', 'high-priority'], 0.9);
  }

  /**
   * Create recoverability issue
   */
  async createRecoverabilityIssue(repositoryId: string, recoverabilityScore: number): Promise<any> {
    const title = `Repository Recoverability Risk – Score: ${recoverabilityScore}`;
    const description = [
      `## Recoverability Risk Detected`,
      ``,
      `### Current Recoverability Score: **${recoverabilityScore}/100**`,
      ``,
      recoverabilityScore < 40
        ? '> ⚠️ Critical: Significant refactoring or rebuild may be needed.'
        : '> ⚠️ Elevated: Recovery processes need improvement.',
      ``,
      `### Recommended Actions`,
      `- [ ] Conduct recovery impact analysis`,
      `- [ ] Identify and document single points of failure`,
      `- [ ] Create recovery runbook`,
      `- [ ] Refactor high-risk modules`,
      `- [ ] Establish automated backup and restore procedures`,
      `- [ ] Reduce duplicate logic and dead code`,
      ``,
      `### Reason`,
      `Automatically generated by CodebaseOS Agent – Recoverability Analysis`,
    ].join('\n');

    return this.createIssue(repositoryId, title, description, ['recoverability', 'agent-generated', 'high-priority'], 0.88);
  }

  /**
   * Get GitLab activity for a repository
   */
  async getGitlabActivity(repositoryId: string) {
    return GitlabIssue.find({ repositoryId }).sort({ createdAt: -1 });
  }

  /**
   * Store issue locally when GitLab is not configured
   */
  private async storeLocalIssue(
    repositoryId: string,
    title: string,
    description: string,
    labels: string[] = []
  ): Promise<any> {
    const issue = await GitlabIssue.create({
      repositoryId,
      title,
      description,
      status: 'open',
      labels,
      url: '',
    });

    logger.info(`Local issue stored: ${title}`);
    return issue;
  }
}

export const gitlabService = new GitlabService();
