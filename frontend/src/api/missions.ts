// ============================================================
// Learning Missions API Module
// ============================================================
import { apiRequest } from './client';
import type { LearningMission } from '@/types/api';

export const missionsApi = {
  generate: (repositoryId: string) =>
    apiRequest<LearningMission[]>(`/missions/${repositoryId}/generate`, { method: 'POST' }),

  get: (repositoryId: string) =>
    apiRequest<LearningMission[]>(`/missions/${repositoryId}`),

  complete: (missionId: string) =>
    apiRequest<LearningMission>(`/missions/${missionId}/complete`, { method: 'PATCH' }),
};