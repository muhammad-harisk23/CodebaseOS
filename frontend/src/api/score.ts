// ============================================================
// Score & Ownership API Module
// ============================================================
import { apiRequest } from './client';
import type { ScoreResponse, BusFactorResponse, RiskDashboard, RepositoryScore } from '@/types/api';

export const scoreApi = {
  getKnowledgeDebt: (repositoryId: string) =>
    apiRequest<ScoreResponse>(`/scores/${repositoryId}/knowledge-debt`),

  getSurvivability: (repositoryId: string) =>
    apiRequest<ScoreResponse>(`/scores/${repositoryId}/survivability`),

  getRecoverability: (repositoryId: string) =>
    apiRequest<ScoreResponse>(`/scores/${repositoryId}/recoverability`),

  getBusFactor: (repositoryId: string) =>
    apiRequest<BusFactorResponse>(`/scores/${repositoryId}/bus-factor`),

  getAllScores: (repositoryId: string) =>
    apiRequest<RepositoryScore>(`/scores/${repositoryId}`),

  getRiskDashboard: (repositoryId: string) =>
    apiRequest<RiskDashboard>(`/risk-center/${repositoryId}`),

  getRisks: (repositoryId: string) =>
    apiRequest<unknown[]>(`/risks/${repositoryId}`),

  getCriticalRisks: (repositoryId: string) =>
    apiRequest<unknown[]>(`/risks/${repositoryId}/critical`),

  getOwnership: (repositoryId: string) =>
    apiRequest<{ modules: unknown[] }>(`/ownership/${repositoryId}`),

  getModuleOwnership: (repositoryId: string, moduleId: string) =>
    apiRequest<unknown>(`/ownership/${repositoryId}/modules/${moduleId}`),

  getFreelancerRescue: (repositoryId: string) =>
    apiRequest<{ recoverability: number; recommendation: string; criticalFiles: string[]; dangerZones: string[] }>(`/freelancer-rescue/${repositoryId}`, { method: 'POST' }),
};