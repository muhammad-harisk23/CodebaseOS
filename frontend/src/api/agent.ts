// ============================================================
// Agent API Module
// ============================================================
import { apiRequest } from './client';
import type { AgentAction } from '@/types/api';

export const agentApi = {
  run: (repositoryId: string) =>
    apiRequest<{ actionId: string }>(`/agent/${repositoryId}/run`, { method: 'POST' }),

  getStatus: (repositoryId: string) =>
    apiRequest<{ status: string }>(`/agent/${repositoryId}/status`),

  getTimeline: (repositoryId: string) =>
    apiRequest<AgentAction[]>(`/agent/${repositoryId}/timeline`),

  getRecommendations: (repositoryId: string) =>
    apiRequest<{ recommendations: unknown[] }>(`/agent/${repositoryId}/recommendations`),
};