// ============================================================
// GitLab API Module
// ============================================================
import { apiRequest } from './client';
import type { GitlabIssue } from '@/types/api';

export const gitlabApi = {
  createIssue: (repositoryId: string, title: string, description?: string) =>
    apiRequest<GitlabIssue>('/gitlab/issues', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, title, description }),
    }),

  createDocumentationIssue: (repositoryId: string, title: string, description?: string) =>
    apiRequest<GitlabIssue>('/gitlab/documentation-issue', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, title, description }),
    }),

  createLearningMissionIssue: (repositoryId: string, title: string, description?: string) =>
    apiRequest<GitlabIssue>('/gitlab/learning-mission', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, title, description }),
    }),

  createOwnershipRiskIssue: (repositoryId: string, title: string, description?: string) =>
    apiRequest<GitlabIssue>('/gitlab/ownership-risk', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, title, description }),
    }),

  getActivity: (repositoryId: string) =>
    apiRequest<unknown[]>(`/gitlab/activity/${repositoryId}`),
};