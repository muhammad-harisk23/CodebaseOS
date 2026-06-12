import { apiRequest } from './client';
import type { RepositoryRisk, RiskDashboard } from '@/types/api';

export const riskApi = {
  getDashboard: (repositoryId: string) =>
    apiRequest<RiskDashboard>(`/risk-center/${repositoryId}`),

  getAll: (repositoryId: string) =>
    apiRequest<RepositoryRisk[]>(`/risks/${repositoryId}`),

  getCritical: (repositoryId: string) =>
    apiRequest<RepositoryRisk[]>(`/risks/${repositoryId}/critical`),

  acknowledge: (repositoryId: string, riskId: string) =>
    apiRequest<RepositoryRisk>(`/risks/${repositoryId}/${riskId}/acknowledge`, {
      method: 'PATCH',
    }),

  resolve: (repositoryId: string, riskId: string) =>
    apiRequest<RepositoryRisk>(`/risks/${repositoryId}/${riskId}/resolve`, {
      method: 'PATCH',
    }),
};
