import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error.middleware';
import { RepositoryScore, RiskLevel } from '../../models/RepositoryScore';
import { RepositoryRisk } from '../../models/RepositoryRisk';
import { Repository } from '../../models/Repository';
import { RepositoryChunk } from '../../models/RepositoryChunk';

export type ScoreResponse = {
  score: number;
  riskLevel: RiskLevel;
  breakdown: Record<string, unknown>;
  recommendations: string[];
};

function clamp100(n: number) {
  return Math.max(0, Math.min(100, n));
}

export class ScoringService {
  async calculateAllScores(repositoryId: string): Promise<void> {
    logger.info(`Calculating scores for repository ${repositoryId}`);

    const repo = await Repository.findById(repositoryId);
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    // Deterministic heuristic inputs (placeholders until service-layer refactor)
    const documentationCoverageRisk = await this.calculateDocumentationCoverageRisk(repositoryId);
    const architectureComplexityRisk = await this.calculateArchitectureComplexityRisk(repositoryId);
    const knowledgeConcentrationRisk = await this.calculateKnowledgeConcentrationRisk(repositoryId);
    const dependencyHealthRisk = await this.calculateDependencyHealthRisk(repositoryId);
    const onboardingDifficultyRisk = await this.calculateOnboardingDifficultyRisk(repositoryId);
    const memoryCoverageRisk = await this.calculateMemoryCoverageRisk(repositoryId);

    // Knowledge Debt (higher = more knowledge debt)
    const knowledgeDebt = clamp100(
      Math.round(
        (documentationCoverageRisk * 0.25) +
          (architectureComplexityRisk * 0.20) +
          (knowledgeConcentrationRisk * 0.20) +
          (dependencyHealthRisk * 0.15) +
          (onboardingDifficultyRisk * 0.10) +
          (memoryCoverageRisk * 0.10)
      )
    );

    // Survivability (higher = more survivability)
    const busFactorRisk = await this.calculateBusFactorRisk(repositoryId); // risk term
    const survivabilityRisk = Math.round(
      (documentationCoverageRisk * 0.20) +
        (busFactorRisk * 0.25) +
        (knowledgeConcentrationRisk * 0.25) +
        (architectureComplexityRisk * 0.10) +
        (dependencyHealthRisk * 0.10) +
        (onboardingDifficultyRisk * 0.10)
    );
    const survivability = clamp100(100 - survivabilityRisk);

    // Recoverability (higher = easier recover)
    const deadCodeRisk = await this.calculateDeadCodeRisk(repositoryId);
    const duplicateLogicRisk = await this.calculateDuplicateLogicRisk(repositoryId);
    const recoverability = clamp100(
      Math.round(
        100 -
          (
            (knowledgeDebt * 0.30) +
            (survivabilityRisk * 0.25) +
            (architectureComplexityRisk * 0.15) +
            (dependencyHealthRisk * 0.10) +
            (deadCodeRisk * 0.10) +
            (duplicateLogicRisk * 0.05) +
            (documentationCoverageRisk * 0.05)
          )
      )
    );

    // Bus factor score (higher = better distribution)
    const busFactorScore = clamp100(100 - busFactorRisk);

    // Repository Risk aggregate (higher = worse)
    const repositoryRiskScore = clamp100(
      Math.round(
        (knowledgeDebt + (100 - survivability) + (100 - recoverability) + dependencyHealthRisk) / 4
      )
    );

    const knowledgeDebtRiskLevel = this.riskLevelForScore(knowledgeDebt);
    const survivabilityRiskLevel = this.riskLevelForScore(100 - survivability); // invert for risk-level
    const recoverabilityRiskLevel = this.riskLevelForScore(100 - recoverability);
    const busFactorRiskLevel = this.riskLevelForScore(busFactorRisk); // risk-level for bus factor
    const repositoryRiskLevel = this.riskLevelForScore(repositoryRiskScore);

    const knowledgeDebtBreakdown = {
      documentationCoverageRisk,
      architectureComplexityRisk,
      knowledgeConcentrationRisk,
      dependencyHealthRisk,
      onboardingDifficultyRisk,
      memoryCoverageRisk,
      weights: { docs: 0.25, complexity: 0.20, concentration: 0.20, dependency: 0.15, onboarding: 0.10, memory: 0.10 },
      formula: 'KnowledgeDebt = DocsRisk*0.25 + Complexity*0.20 + Concentration*0.20 + DependencyRisk*0.15 + OnboardingRisk*0.10 + MemoryRisk*0.10',
    };

    const survivabilityBreakdown = {
      documentationCoverageRisk,
      busFactorRisk,
      ownershipRisk: knowledgeConcentrationRisk,
      architectureComplexityRisk,
      dependencyHealthRisk,
      onboardingDifficultyRisk,
      survivabilityRisk,
      formula:
        'SurvivabilityRisk = (DocsRisk*0.20) + (BusFactorRisk*0.25) + (OwnershipRisk*0.25) + (ArchRisk*0.10) + (DependencyRisk*0.10) + (OnboardingRisk*0.10); Survivability = 100 - SurvivabilityRisk',
    };

    const recoverabilityBreakdown = {
      knowledgeDebt,
      survivabilityRisk,
      architectureComplexityRisk,
      dependencyHealthRisk,
      deadCodeRisk,
      duplicateLogicRisk,
      documentationCoverageRisk,
      formula:
        'Recoverability = 100 - (KD*0.30 + SurvivabilityRisk*0.25 + ArchitectureRisk*0.15 + DependencyRisk*0.10 + DeadCodeRisk*0.10 + DuplicateLogicRisk*0.05 + DocumentationRisk*0.05)',
    };

    const busFactorBreakdown = {
      busFactorRisk,
      heuristic: 'Until bus-factor commit analytics is implemented, bus factor risk is derived from knowledge concentration.',
    };

    const repositoryRiskBreakdown = {
      repositoryRiskScore,
      components: {
        knowledgeDebt,
        survivabilityRisk: 100 - survivability,
        recoverabilityRisk: 100 - recoverability,
        dependencyHealthRisk,
      },
      formula: 'RepositoryRisk = Avg(knowledgeDebt, survivabilityRisk, recoverabilityRisk, dependencyHealthRisk)',
    };

    await RepositoryScore.findOneAndUpdate(
      { repositoryId },
      {
        repositoryId,
        knowledgeDebtScore: {
          score: knowledgeDebt,
          riskLevel: knowledgeDebtRiskLevel,
          breakdown: knowledgeDebtBreakdown,
          recommendations: this.recommendationsFor('knowledgeDebt', knowledgeDebtRiskLevel),
        },
        survivabilityScore: {
          score: survivability,
          riskLevel: survivabilityRiskLevel,
          breakdown: survivabilityBreakdown,
          recommendations: this.recommendationsFor('survivability', survivabilityRiskLevel),
        },
        recoverabilityScore: {
          score: recoverability,
          riskLevel: recoverabilityRiskLevel,
          breakdown: recoverabilityBreakdown,
          recommendations: this.recommendationsFor('recoverability', recoverabilityRiskLevel),
        },
        busFactorScore: {
          score: busFactorScore,
          riskLevel: busFactorRiskLevel,
          breakdown: busFactorBreakdown,
          recommendations: this.recommendationsFor('busFactor', busFactorRiskLevel),
        },
        repositoryRiskScore: {
          score: repositoryRiskScore,
          riskLevel: repositoryRiskLevel,
          breakdown: repositoryRiskBreakdown,
          recommendations: this.recommendationsFor('repositoryRisk', repositoryRiskLevel),
        },
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await this.generateRisks(repositoryId, {
      knowledgeDebt,
      survivability,
      recoverability,
      busFactorRisk,
    });
  }

  async getKnowledgeDebt(repositoryId: string): Promise<ScoreResponse> {
    const doc = await RepositoryScore.findOne({ repositoryId });
    if (!doc) throw new AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
    return doc.knowledgeDebtScore as unknown as ScoreResponse;
  }

  async getSurvivability(repositoryId: string): Promise<ScoreResponse> {
    const doc = await RepositoryScore.findOne({ repositoryId });
    if (!doc) throw new AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
    return doc.survivabilityScore as unknown as ScoreResponse;
  }

  async getRecoverability(repositoryId: string): Promise<ScoreResponse> {
    const doc = await RepositoryScore.findOne({ repositoryId });
    if (!doc) throw new AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
    return doc.recoverabilityScore as unknown as ScoreResponse;
  }

  async getBusFactor(repositoryId: string): Promise<ScoreResponse> {
    const doc = await RepositoryScore.findOne({ repositoryId });
    if (!doc) throw new AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');
    return doc.busFactorScore as unknown as ScoreResponse;
  }

  async getRiskDashboard(repositoryId: string) {
    const doc = await RepositoryScore.findOne({ repositoryId });
    if (!doc) throw new AppError('Scores not found. Run analysis first.', 404, 'SCORES_NOT_FOUND');

    return {
      repositoryRiskScore: doc.repositoryRiskScore,
      knowledgeDebtScore: doc.knowledgeDebtScore,
      survivabilityScore: doc.survivabilityScore,
      recoverabilityScore: doc.recoverabilityScore,
      busFactorScore: doc.busFactorScore,
    };
  }

  async getRepositoryRisks(repositoryId: string) {
    return RepositoryRisk.find({ repositoryId }).sort({ severity: 1, createdAt: -1 });
  }

  async getCriticalRisks(repositoryId: string) {
    return RepositoryRisk.find({ repositoryId, severity: { $in: ['critical', 'high'] }, status: 'open' }).sort({ severity: 1 });
  }

  private riskLevelForScore(score: number): RiskLevel {
    if (score <= 30) return 'LOW';
    if (score <= 60) return 'MEDIUM';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  }

  private recommendationsFor(
    kind: 'knowledgeDebt' | 'survivability' | 'recoverability' | 'busFactor' | 'repositoryRisk',
    level: RiskLevel
  ): string[] {
    switch (kind) {
      case 'knowledgeDebt':
        if (level === 'LOW') return ['Maintain documentation and keep knowledge transfer current.'];
        if (level === 'MEDIUM') return ['Target documentation gaps for complex modules and APIs.'];
        if (level === 'HIGH') return ['Generate architecture docs and refactoring recommendations; add learning missions.'];
        return ['Critical knowledge debt: prioritize documentation pack + onboarding guide + rescue plan.'];
      case 'survivability':
        if (level === 'LOW') return ['No immediate survivability actions required.'];
        if (level === 'MEDIUM') return ['Improve backup ownership coverage; document key workflows.'];
        if (level === 'HIGH') return ['Distribute knowledge via missions and produce survivability runbook.'];
        return ['Critical survivability risk: assign backup owners + document critical flows immediately.'];
      case 'recoverability':
        if (level === 'LOW') return ['Continue normal maintenance; keep docs updated.'];
        if (level === 'MEDIUM') return ['Refactor to reduce recovery hot-spots; improve module organization.'];
        if (level === 'HIGH') return ['Plan major recovery refactor; generate recovery documentation.'];
        return ['Recoverability is critical: recommend rebuild/refactor plan and prioritize recovery tasks.'];
      case 'busFactor':
        if (level === 'LOW') return ['Maintain knowledge distribution across contributors.'];
        if (level === 'MEDIUM') return ['Create backup ownership plan and schedule knowledge walkthroughs.'];
        if (level === 'HIGH') return ['Create a knowledge transfer plan; document critical knowledge areas.'];
        return ['Immediate knowledge redistribution: documentation + missions + ownership reassignment.'];
      case 'repositoryRisk':
        if (level === 'LOW') return ['Repository risk is low; continue monitoring.'];
        if (level === 'MEDIUM') return ['Risk is manageable; execute documentation and mission plan.'];
        if (level === 'HIGH') return ['Risk is significant; prioritize refactor and knowledge transfer.'];
        return ['Risk is critical; trigger rescue workflow and create GitLab actions.'];
      default:
        return [];
    }
  }

  private async calculateDocumentationCoverageRisk(repositoryId: string): Promise<number> {
    const docs = await RepositoryChunk.find({ repositoryId, module: { $in: ['Configuration', 'API', 'Routes'] } });
    const totalChunks = await RepositoryChunk.countDocuments({ repositoryId });
    if (totalChunks === 0) return 85;
    const coverage = docs.length / totalChunks;
    return clamp100(Math.round((1 - coverage) * 100));
  }

  private async calculateArchitectureComplexityRisk(repositoryId: string): Promise<number> {
    const repo = await Repository.findById(repositoryId);
    if (!repo) return 50;
    const total = (repo.services || 0) + (repo.apis || 0) + (repo.modules || 0);
    if (total === 0) return 30;
    return clamp100(Math.round(total * 5));
  }

  private async calculateKnowledgeConcentrationRisk(repositoryId: string): Promise<number> {
    const chunks = await RepositoryChunk.find({ repositoryId });
    if (chunks.length === 0) return 50;
    const modules = new Set(chunks.map((c: any) => c.module).filter(Boolean));
    if (modules.size <= 1) return 90;
    if (modules.size <= 3) return 60;
    if (modules.size <= 5) return 40;
    return 20;
  }

  private async calculateDependencyHealthRisk(repositoryId: string): Promise<number> {
    const repo = await Repository.findById(repositoryId);
    const deps = repo?.dependencies?.length ?? 0;
    if (deps === 0) return 70;
    if (deps < 10) return 55;
    if (deps < 30) return 40;
    return 30;
  }

  private async calculateOnboardingDifficultyRisk(repositoryId: string): Promise<number> {
    const complexityRisk = await this.calculateArchitectureComplexityRisk(repositoryId);
    const docsRisk = await this.calculateDocumentationCoverageRisk(repositoryId);
    return clamp100(Math.round((complexityRisk + docsRisk) / 2));
  }

  private async calculateMemoryCoverageRisk(repositoryId: string): Promise<number> {
    const totalChunks = await RepositoryChunk.countDocuments({ repositoryId });
    if (totalChunks === 0) return 100;
    if (totalChunks < 10) return 80;
    if (totalChunks < 50) return 50;
    if (totalChunks < 100) return 30;
    return 10;
  }

  private async calculateBusFactorRisk(repositoryId: string): Promise<number> {
    // Until commit analytics exists, derive from knowledge concentration risk.
    return this.calculateKnowledgeConcentrationRisk(repositoryId);
  }

  private async calculateDeadCodeRisk(_repositoryId: string): Promise<number> {
    return 30;
  }

  private async calculateDuplicateLogicRisk(repositoryId: string): Promise<number> {
    const repo = await Repository.findById(repositoryId);
    const modules = repo?.modules ?? 0;
    if (modules === 0) return 50;
    if (modules < 5) return 25;
    if (modules < 15) return 20;
    return 15;
  }

  private async generateRisks(
    repositoryId: string,
    input: { knowledgeDebt: number; survivability: number; recoverability: number; busFactorRisk: number }
  ) {
    await RepositoryRisk.deleteMany({ repositoryId });

    const risks: any[] = [];

    if (input.knowledgeDebt > 80) {
      risks.push({
        repositoryId,
        title: 'High Knowledge Debt',
        severity: 'critical' as const,
        description: `Knowledge debt score is ${input.knowledgeDebt}. Repository is difficult to understand and maintain.`,
        affectedFiles: [],
        recommendation: 'Generate documentation, create architecture guide, and establish knowledge transfer plan.',
        status: 'open' as const,
      });
    }

    if (input.survivability < 40) {
      risks.push({
        repositoryId,
        title: 'Low Repository Survivability',
        severity: 'critical' as const,
        description: `Survivability score is ${input.survivability}. Repository may not survive without original creator.`,
        affectedFiles: [],
        recommendation: 'Document critical knowledge, assign backup owners, create knowledge transfer plan.',
        status: 'open' as const,
      });
    }

    if (input.recoverability < 40) {
      risks.push({
        repositoryId,
        title: 'Low Recoverability',
        severity: 'high' as const,
        description: `Recoverability score is ${input.recoverability}. Significant refactoring or rebuild may be needed.`,
        affectedFiles: [],
        recommendation: 'Consider rebuild for critical systems, prioritize refactoring efforts.',
        status: 'open' as const,
      });
    }

    if (input.busFactorRisk < 30) {
      risks.push({
        repositoryId,
        title: 'Critical Bus Factor',
        severity: 'critical' as const,
        description: 'Bus factor is critically low. Knowledge is concentrated in too few contributors.',
        affectedFiles: [],
        recommendation: 'Create backup ownership plan, distribute knowledge through documentation and learning missions.',
        status: 'open' as const,
      });
    }

    if (input.knowledgeDebt > 60 && input.knowledgeDebt <= 80) {
      risks.push({
        repositoryId,
        title: 'Moderate Knowledge Debt',
        severity: 'high' as const,
        description: `Knowledge debt score is ${input.knowledgeDebt}. Some areas need documentation improvement.`,
        affectedFiles: [],
        recommendation: 'Review and improve documentation for complex modules.',
        status: 'open' as const,
      });
    }

    if (risks.length > 0) {
      await RepositoryRisk.insertMany(risks);
    }
  }
}

export const scoringService = new ScoringService();