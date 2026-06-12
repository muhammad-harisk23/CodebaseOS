import { scoreApi } from '@/api/score';
import type { ScoreResponse, BusFactorResponse, RiskDashboard, RepositoryScore } from '@/types/api';
import type { MetricData } from '@/types';
import { dashboardMetrics } from '@/mock/metrics';

const metricsByLabel = new Map(dashboardMetrics.map((m) => [m.label, m]));

const toScoreResponse = (): ScoreResponse =>
  ({
    score: metricsByLabel.get('Knowledge Debt Score')?.value ?? 0,
    max: metricsByLabel.get('Knowledge Debt Score')?.max ?? 100,
    trend: metricsByLabel.get('Knowledge Debt Score')?.trend ?? 'stable',
    description: metricsByLabel.get('Knowledge Debt Score')?.description ?? '',
  }) as unknown as ScoreResponse;

const toBusFactorResponse = (): BusFactorResponse =>
  ({
    score: metricsByLabel.get('Bus Factor')?.value ?? 0,
    max: metricsByLabel.get('Bus Factor')?.max ?? 10,
    trend: metricsByLabel.get('Bus Factor')?.trend ?? 'stable',
    description: metricsByLabel.get('Bus Factor')?.description ?? '',
  }) as unknown as BusFactorResponse;

export const scoreService = {
  getKnowledgeDebt: async (_repositoryId: string): Promise<ScoreResponse> => {
    try {
      return await scoreApi.getKnowledgeDebt(_repositoryId);
    } catch {
      return toScoreResponse();
    }
  },

  getSurvivability: async (repositoryId: string): Promise<ScoreResponse> => {
    try {
      return await scoreApi.getSurvivability(repositoryId);
    } catch {
      // For now reuse knowledge-debt score shape; UI can still render existing mock pages.
      return toScoreResponse();
    }
  },

  getRecoverability: async (repositoryId: string): Promise<ScoreResponse> => {
    try {
      return await scoreApi.getRecoverability(repositoryId);
    } catch {
      return toScoreResponse();
    }
  },

  getBusFactor: async (repositoryId: string): Promise<BusFactorResponse> => {
    try {
      return await scoreApi.getBusFactor(repositoryId);
    } catch {
      return toBusFactorResponse();
    }
  },

  getAllScores: async (repositoryId: string): Promise<RepositoryScore> => {
    try {
      return await scoreApi.getAllScores(repositoryId);
    } catch {
      return ({
        repositoryId,
        knowledgeDebt: metricsByLabel.get('Knowledge Debt Score')?.value ?? 0,
        survivability: metricsByLabel.get('Survivability Score')?.value ?? 0,
        recoverability: metricsByLabel.get('Recoverability Score')?.value ?? 0,
        busFactor: metricsByLabel.get('Bus Factor')?.value ?? 0,
      }) as unknown as RepositoryScore;
    }
  },

  getRiskDashboard: async (repositoryId: string): Promise<RiskDashboard> => {
    try {
      return await scoreApi.getRiskDashboard(repositoryId);
    } catch {
      // Keep minimal typed fallback until we convert risk-center UI.
      return ({
        repositoryId,
        risks: [],
      }) as unknown as RiskDashboard;
    }
  },
};
