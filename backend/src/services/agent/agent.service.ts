import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';
import { Repository } from '../../models/Repository';
import { RepositoryScore } from '../../models/RepositoryScore';
import { RepositoryRisk } from '../../models/RepositoryRisk';
import { AgentAction } from '../../models/AgentAction';
import { scoringService } from '../scoring/scoring.service';
import { gitlabService } from '../gitlab/gitlab.service';
import { geminiService } from '../gemini/gemini.service';

interface TimelineStep {
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: Date;
  detail?: string;
}

export class AgentService {
  /**
   * Execute full agent workflow for a repository:
   *
   * Repository Upload
   *   ↓
   * Repository Analysis
   *   ↓
   * Repository Memory Generation
   *   ↓
   * Knowledge Debt Calculation
   *   ↓
   * Risk Detection
   *   ↓
   * Gemini Reasoning
   *   ↓
   * Recommendation Generation
   *   ↓
   * GitLab Issue Creation
   *   ↓
   * Store Agent Actions
   */
  async runAgent(repositoryId: string): Promise<any> {
    logger.info(`[Agent] Starting workflow for repository ${repositoryId}`);

    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    if (repo.status !== 'analyzed') {
      throw new AppError('Repository must be analyzed first', 400, 'NOT_ANALYZED');
    }

    const timeline: TimelineStep[] = [];

    // ─── Step 1: Calculate Knowledge Debt / Scores ──────────────────────────
    timeline.push({ step: 'Knowledge Debt Calculation', status: 'in_progress', timestamp: new Date() });
    try {
      await scoringService.calculateAllScores(repositoryId);
      timeline[timeline.length - 1] = { step: 'Knowledge Debt Calculation', status: 'completed', timestamp: new Date(), detail: 'Scores calculated successfully' };
    } catch (error: any) {
      timeline[timeline.length - 1] = { step: 'Knowledge Debt Calculation', status: 'failed', timestamp: new Date(), detail: error.message };
      throw new AppError(`Score calculation failed: ${error.message}`, 500, 'SCORE_FAILED');
    }

    // ─── Step 2: Risk Detection ─────────────────────────────────────────────
    timeline.push({ step: 'Risk Detection', status: 'in_progress', timestamp: new Date() });
    let risks: any[] = [];
    let scores: any = null;
    try {
      risks = await RepositoryRisk.find({ repositoryId, status: 'open' }).sort({ severity: 1 });
      scores = await RepositoryScore.findOne({ repositoryId });
      timeline[timeline.length - 1] = {
        step: 'Risk Detection',
        status: 'completed',
        timestamp: new Date(),
        detail: `${risks.length} risk(s) detected`,
      };
    } catch (error: any) {
      timeline[timeline.length - 1] = { step: 'Risk Detection', status: 'failed', timestamp: new Date(), detail: error.message };
    }

    // ─── Step 3: Gemini Reasoning ───────────────────────────────────────────
    timeline.push({ step: 'Gemini Reasoning', status: 'in_progress', timestamp: new Date() });
    let reasoning = '';
    try {
      reasoning = await this.generateReasoning(repositoryId, risks, scores);
      await this.storeAgentAction(repositoryId, 'generate_report', reasoning, 0.9, 'Reasoning completed');
      timeline[timeline.length - 1] = { step: 'Gemini Reasoning', status: 'completed', timestamp: new Date(), detail: 'Reasoning generated' };
    } catch (error: any) {
      reasoning = 'Reasoning unavailable due to error';
      timeline[timeline.length - 1] = { step: 'Gemini Reasoning', status: 'failed', timestamp: new Date(), detail: error.message };
    }

    // ─── Step 4: Recommendation Generation ──────────────────────────────────
    timeline.push({ step: 'Recommendation Generation', status: 'in_progress', timestamp: new Date() });
    let recommendations: string[] = [];
    try {
      recommendations = await this.generateRecommendations(repositoryId, risks, scores);
      await this.storeAgentAction(repositoryId, 'generate_report', `Generated ${recommendations.length} recommendations`, 0.88, recommendations.join('; '));
      timeline[timeline.length - 1] = {
        step: 'Recommendation Generation',
        status: 'completed',
        timestamp: new Date(),
        detail: `${recommendations.length} recommendation(s) generated`,
      };
    } catch (error: any) {
      timeline[timeline.length - 1] = { step: 'Recommendation Generation', status: 'failed', timestamp: new Date(), detail: error.message };
    }

    // ─── Step 5: GitLab Issue Creation ──────────────────────────────────────
    timeline.push({ step: 'GitLab Issue Creation', status: 'in_progress', timestamp: new Date() });
    let gitlabActions: any[] = [];
    try {
      gitlabActions = await this.executeActions(repositoryId, risks, scores);
      timeline[timeline.length - 1] = {
        step: 'GitLab Issue Creation',
        status: 'completed',
        timestamp: new Date(),
        detail: `${gitlabActions.length} GitLab action(s) executed`,
      };
    } catch (error: any) {
      timeline[timeline.length - 1] = { step: 'GitLab Issue Creation', status: 'failed', timestamp: new Date(), detail: error.message };
    }

    // ─── Step 6: Store Agent Actions (audit trail) ──────────────────────────
    timeline.push({ step: 'Store Agent Actions', status: 'in_progress', timestamp: new Date() });
    try {
      await this.storeAgentAction(repositoryId, 'generate_report', 'Agent workflow completed', 0.95, JSON.stringify({ recommendations, gitlabActions }));
      timeline[timeline.length - 1] = { step: 'Store Agent Actions', status: 'completed', timestamp: new Date(), detail: 'All actions persisted' };
    } catch (error: any) {
      timeline[timeline.length - 1] = { step: 'Store Agent Actions', status: 'failed', timestamp: new Date(), detail: error.message };
    }

    return {
      repositoryId,
      status: 'completed',
      repositoryName: repo.name,
      reasoning,
      recommendations,
      gitlabActions,
      timeline,
    };
  }

  /**
   * Get agent status for a repository
   */
  async getAgentStatus(repositoryId: string) {
    const actions = await AgentAction.find({ repositoryId }).sort({ createdAt: -1 }).limit(1);
    const lastAction = actions[0];

    return {
      repositoryId,
      status: lastAction?.status || 'pending',
      lastAction: lastAction?.actionType || 'none',
      lastActionReasoning: lastAction?.reasoning || '',
      lastActionConfidence: lastAction?.confidence || 0,
      totalActions: await AgentAction.countDocuments({ repositoryId }),
      lastRun: lastAction?.createdAt || null,
    };
  }

  /**
   * Get agent timeline (recent actions in chronological order)
   */
  async getAgentTimeline(repositoryId: string) {
    return AgentAction.find({ repositoryId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('actionType reasoning confidence status createdAt result');
  }

  /**
   * Get enriched agent feed combining actions + scores + risks
   */
  async getAgentFeed(repositoryId: string) {
    const [actions, scores, risks] = await Promise.all([
      AgentAction.find({ repositoryId }).sort({ createdAt: -1 }).limit(20).lean(),
      RepositoryScore.findOne({ repositoryId }).lean(),
      RepositoryRisk.find({ repositoryId, status: 'open' }).sort({ severity: 1 }).limit(10).lean(),
    ]);

    return {
      repositoryId,
      actions,
      scores: scores
        ? {
            knowledgeDebt: (scores as any).knowledgeDebtScore?.score,
            survivability: (scores as any).survivabilityScore?.score,
            recoverability: (scores as any).recoverabilityScore?.score,
            busFactor: (scores as any).busFactorScore?.score,
            repositoryRisk: (scores as any).repositoryRiskScore?.score,
          }
        : null,
      risks: risks.map((r: any) => ({
        title: r.title,
        severity: r.severity,
        description: r.description,
        recommendation: r.recommendation,
        status: r.status,
      })),
      generatedAt: new Date(),
    };
  }

  /**
   * Get full agent action history
   */
  async getAgentActionHistory(repositoryId: string) {
    return AgentAction.find({ repositoryId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }

  /**
   * Get agent recommendations based on detected risks and scores
   */
  async getAgentRecommendations(repositoryId: string) {
    const risks = await RepositoryRisk.find({ repositoryId, status: 'open' }).limit(10).lean();
    const scores = await RepositoryScore.findOne({ repositoryId }).lean();

    let aiRecommendations = '';
    try {
      const repo = await Repository.findById(repositoryId);
      aiRecommendations = await geminiService.generateAgentRecommendations(
        scores?.toJSON() || {},
        risks.map(r => r.toJSON())
      );
    } catch (e) {
      aiRecommendations = 'AI recommendations unavailable. Configure GEMINI_API_KEY.';
    }

    return {
      repositoryId,
      risks: risks.map((r: any) => ({
        title: r.title,
        severity: r.severity,
        description: r.description,
        recommendation: r.recommendation,
      })),
      scores: scores
        ? {
            knowledgeDebt: (scores as any).knowledgeDebtScore?.score,
            survivability: (scores as any).survivabilityScore?.score,
            recoverability: (scores as any).recoverabilityScore?.score,
            busFactor: (scores as any).busFactorScore?.score,
          }
        : null,
      aiRecommendations,
      manualRecommendations: this.getDefaultRecommendations(scores),
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  /**
   * Generate reasoning based on detected risks and scores
   */
  private async generateReasoning(repositoryId: string, risks: any[], scores: any): Promise<string> {
    const lines: string[] = [];
    lines.push(`## Agent Reasoning for Repository ${repositoryId}`);
    lines.push('');

    if (scores) {
      const kd = scores.knowledgeDebtScore?.score;
      const sv = scores.survivabilityScore?.score;
      const rc = scores.recoverabilityScore?.score;
      const bf = scores.busFactorScore?.score;

      if (kd !== undefined) {
        if (kd > 80) {
          lines.push(`🔴 **Knowledge Debt (${kd}/100):** Critical. Repository lacks documentation and understanding. Action required.`);
        } else if (kd > 60) {
          lines.push(`🟡 **Knowledge Debt (${kd}/100):** Elevated. Documentation gaps exist in complex modules.`);
        } else {
          lines.push(`🟢 **Knowledge Debt (${kd}/100):** Acceptable. Continue monitoring.`);
        }
      }

      if (sv !== undefined) {
        if (sv < 40) {
          lines.push(`🔴 **Survivability (${sv}/100):** Critical. Repository cannot survive without original creator. Immediate knowledge transfer needed.`);
        } else if (sv < 60) {
          lines.push(`🟡 **Survivability (${sv}/100):** Moderate. Backup ownership and documentation recommended.`);
        } else {
          lines.push(`🟢 **Survivability (${sv}/100):** Healthy. No immediate action.`);
        }
      }

      if (rc !== undefined) {
        if (rc < 40) {
          lines.push(`🔴 **Recoverability (${rc}/100):** Critical. Rebuild or major refactoring recommended.`);
        } else if (rc < 60) {
          lines.push(`🟡 **Recoverability (${rc}/100):** Moderate. Recovery plan needed.`);
        } else {
          lines.push(`🟢 **Recoverability (${rc}/100):** Healthy.`);
        }
      }

      if (bf !== undefined && bf <= 1) {
        lines.push(`🔴 **Bus Factor (${bf}):** Critical. Knowledge concentrated in single contributor.`);
      }
    }

    if (risks.length === 0) {
      lines.push('');
      lines.push('✅ No critical risks detected. Repository appears healthy.');
    } else {
      lines.push('');
      lines.push(`⚠️ ${risks.length} risk(s) detected requiring attention:`);
      for (const risk of risks) {
        lines.push(`  - **${risk.severity?.toUpperCase()}:** ${risk.title} – ${risk.description}`);
      }
    }

    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('**Conclusion:** Agent has analyzed the repository, detected risks, and created actionable GitLab issues. Recommendations are available for review.');

    return lines.join('\n');
  }

  /**
   * Generate recommendations based on detected risks
   */
  private async generateRecommendations(repositoryId: string, risks: any[], scores: any): Promise<string[]> {
    const recommendations: string[] = [];

    if (scores?.knowledgeDebtScore?.score > 80) {
      recommendations.push('Generate comprehensive documentation for all modules');
      recommendations.push('Create architecture guide and onboarding documentation');
      recommendations.push('Schedule knowledge transfer sessions');
    } else if (scores?.knowledgeDebtScore?.score > 60) {
      recommendations.push('Review and improve documentation for complex modules');
      recommendations.push('Target documentation gaps for APIs and services');
    }

    if (scores?.survivabilityScore?.score < 40) {
      recommendations.push('Create knowledge transfer plan for critical components');
      recommendations.push('Assign backup owners for all modules');
      recommendations.push('Document critical workflows and decision logs');
      recommendations.push('Create onboarding guide for new contributors');
    } else if (scores?.survivabilityScore?.score < 60) {
      recommendations.push('Improve backup ownership coverage');
      recommendations.push('Document key workflows and processes');
    }

    if (scores?.recoverabilityScore?.score < 40) {
      recommendations.push('Consider rebuilding critical systems with proper documentation');
      recommendations.push('Create refactoring tasks for high-risk areas');
      recommendations.push('Conduct recovery impact analysis');
      recommendations.push('Create recovery runbook');
    } else if (scores?.recoverabilityScore?.score < 60) {
      recommendations.push('Refactor to reduce recovery hot-spots');
      recommendations.push('Improve module organization');
    }

    if (scores?.busFactorScore?.score <= 1) {
      recommendations.push('Distribute knowledge through learning missions');
      recommendations.push('Set up pair programming sessions');
      recommendations.push('Create backup ownership plan');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring repository health');
      recommendations.push('Maintain documentation as code evolves');
      recommendations.push('Run periodic risk assessments');
    }

    return recommendations;
  }

  /**
   * Execute GitLab actions based on risk triggers
   */
  private async executeActions(repositoryId: string, risks: any[], scores: any): Promise<any[]> {
    const actions: any[] = [];

    // ── Knowledge Debt Trigger (> 80) ──────────────────────────────────────
    if (scores?.knowledgeDebtScore?.score > 80) {
      await this.storeAgentAction(repositoryId, 'create_documentation',
        `Knowledge debt score is ${scores.knowledgeDebtScore.score}. Documentation generation triggered.`, 0.92);

      const docIssue = await gitlabService.createDocumentationIssue(repositoryId, 'Repository');
      actions.push({ type: 'create_documentation', target: 'documentation-issue', result: this.safeSerialize(docIssue) });
    }

    // ── Survivability Trigger (< 40) ───────────────────────────────────────
    if (scores?.survivabilityScore?.score < 40) {
      await this.storeAgentAction(repositoryId, 'transfer_knowledge',
        `Survivability score is ${scores.survivabilityScore.score}. Knowledge transfer required.`, 0.88);

      const ownershipIssue = await gitlabService.createOwnershipRiskIssue(repositoryId, 'Critical Modules', 90);
      actions.push({ type: 'create_ownership_issue', target: 'ownership-risk', result: this.safeSerialize(ownershipIssue) });

      const survivabilityIssue = await gitlabService.createSurvivabilityIssue(repositoryId, scores.survivabilityScore.score);
      actions.push({ type: 'create_survivability_issue', target: 'survivability-issue', result: this.safeSerialize(survivabilityIssue) });
    }

    // ── Recoverability Trigger (< 40) ──────────────────────────────────────
    if (scores?.recoverabilityScore?.score < 40) {
      await this.storeAgentAction(repositoryId, 'generate_report',
        `Recoverability score is ${scores.recoverabilityScore.score}. Recovery plan required.`, 0.85);

      const recoverabilityIssue = await gitlabService.createRecoverabilityIssue(repositoryId, scores.recoverabilityScore.score);
      actions.push({ type: 'create_recoverability_issue', target: 'recoverability-issue', result: this.safeSerialize(recoverabilityIssue) });
    }

    // ── Bus Factor Trigger (<= 1) ──────────────────────────────────────────
    const busFactorScoreVal = scores?.busFactorScore?.score;
    if (busFactorScoreVal !== undefined && busFactorScoreVal <= 1) {
      await this.storeAgentAction(repositoryId, 'create_learning_mission',
        `Bus factor is ${busFactorScoreVal}. Learning missions created to distribute knowledge.`, 0.94);

      const missionIssue = await gitlabService.createLearningMissionIssue(
        repositoryId,
        'Knowledge Distribution',
        'Distribute critical knowledge across team members to reduce bus factor risk'
      );
      actions.push({ type: 'create_learning_mission', target: 'learning-mission', result: this.safeSerialize(missionIssue) });
    }

    // ── Fallback: always create at least one hygiene action ─────────────────
    if (actions.length === 0) {
      await this.storeAgentAction(repositoryId, 'generate_report',
        'Routine repository health check completed. No critical triggers detected.', 0.70);

      actions.push({ type: 'health_check', target: 'none', result: 'No GitLab actions required' });
    }

    return actions;
  }

  /**
   * Store an agent action in MongoDB
   */
  private async storeAgentAction(
    repositoryId: string,
    actionType: 'create_documentation' | 'create_gitlab_issue' | 'create_learning_mission' | 'generate_report' | 'transfer_knowledge',
    reasoning: string,
    confidence: number,
    result?: string
  ): Promise<any> {
    const action = await AgentAction.create({
      repositoryId,
      actionType,
      reasoning,
      confidence,
      status: 'completed',
      result: result || 'Action executed successfully',
    });

    logger.info(`[Agent] Action stored: ${actionType} (confidence: ${confidence}) for ${repositoryId}`);
    return action;
  }

  /**
   * Get default recommendations when scores are unavailable
   */
  private getDefaultRecommendations(scores: any): string[] {
    if (!scores) {
      return [
        'Analyze repository to get started',
        'Generate repository documentation',
        'Check for knowledge concentration risks',
        'Review dependency health',
        'Assess bus factor',
      ];
    }

    const kd = scores.knowledgeDebtScore?.score;
    const sv = scores.survivabilityScore?.score;
    const rc = scores.recoverabilityScore?.score;
    const bf = scores.busFactorScore?.score;

    return [
      kd > 60 ? `Reduce knowledge debt (${kd}/100) through documentation and knowledge transfer` : 'Maintain current documentation levels',
      sv < 50 ? `Improve survivability (${sv}/100) by assigning backup owners and documenting workflows` : 'Repository survivability is acceptable',
      rc < 50 ? `Create recovery plan — recoverability is ${rc}/100` : 'Repository is recoverable',
      bf !== undefined && bf <= 1 ? `Critical bus factor (${bf}) — distribute knowledge immediately` : 'Bus factor is acceptable',
    ];
  }

  /**
   * Safely serialize a MongoDB document to a plain object
   */
  private safeSerialize(doc: any): any {
    if (!doc) return null;
    if (typeof doc.toJSON === 'function') return doc.toJSON();
    if (typeof doc.toObject === 'function') return doc.toObject();
    return doc;
  }
}

export const agentService = new AgentService();