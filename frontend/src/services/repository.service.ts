import { repositoryApi } from '@/api/repository';
import type { Repository, IntelligenceReport } from '@/types/api';
import { repositories as mockRepositories } from '@/mock/repositories';
import { repositoryDetail as mockRepositoryDetail } from '@/mock/repository-detail';

const mockRepoById = (id: string): Repository | undefined =>
  mockRepositories.find((r) => r.id === id) as unknown as Repository;

const mockIntelligence = (repositoryId: string): IntelligenceReport | undefined => {
  // Mock fallback: cast after making shape unknown to avoid TS strict overlap errors.
  const raw = {
    repositoryId,
    repository: mockRepoById(repositoryId),
    summary: (mockRepositoryDetail as any)?.summary ?? 'Mock intelligence report',
    risks: (mockRepositoryDetail as any)?.risks ?? [],
    recommendations: (mockRepositoryDetail as any)?.recommendations ?? [],
  };

  return raw as unknown as IntelligenceReport;
};

export const repositoryService = {
  upload: async (file: File) => {
    try {
      return await repositoryApi.upload(file);
    } catch {
      return { repositoryId: 'repo-1' };
    }
  },

  get: async (repositoryId: string): Promise<Repository> => {
    try {
      return await repositoryApi.get(repositoryId);
    } catch {
      return mockRepoById(repositoryId) ?? (mockRepoById('repo-1') as Repository);
    }
  },

  analyze: async (repositoryUrl: string, source: 'github' | 'gitlab') => {
    try {
      return await repositoryApi.analyze(repositoryUrl, source);
    } catch {
      return { repositoryId: 'repo-1', status: 'complete' };
    }
  },

  getIntelligence: async (repositoryId: string): Promise<IntelligenceReport> => {
    try {
      return await repositoryApi.getIntelligence(repositoryId);
    } catch {
      return mockIntelligence(repositoryId) as IntelligenceReport;
    }
  },
};
