import { healthApi } from '@/api/health';

export type HealthCheck = {
  status: 'up' | 'down';
};

export const healthService = {
  getBackend: async (): Promise<HealthCheck> => {
    try {
      return await healthApi.get();
    } catch {
      return { status: 'down' };
    }
  },

  getGemini: async (): Promise<HealthCheck> => {
    try {
      return await healthApi.gemini();
    } catch {
      return { status: 'down' };
    }
  },

  getGitlab: async (): Promise<HealthCheck> => {
    try {
      return await healthApi.gitlab();
    } catch {
      return { status: 'down' };
    }
  },

  getMongoDB: async (): Promise<HealthCheck> => {
    try {
      return await healthApi.mongodb();
    } catch {
      return { status: 'down' };
    }
  },
};
