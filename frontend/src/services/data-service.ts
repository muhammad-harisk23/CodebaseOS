// ============================================================
// Data Service — Provides data to components
// ============================================================
// Once the backend is available, these functions call the API.
// Until then, they return mock data as a seamless fallback.
// ============================================================

// --- Mock Data Imports ---
import { dashboardMetrics } from '@/mock/metrics';
import { survivabilityData } from '@/mock/survivability';
import { recoverabilityData } from '@/mock/recoverability';
import { busFactorData } from '@/mock/bus-factor';
import { ownershipMap } from '@/mock/ownership';
import { ownershipEnhancedData } from '@/mock/ownership-enhanced';
import { riskCenterData } from '@/mock/risk-center';
import { risks } from '@/mock/risk';
import { debtBreakdown } from '@/mock/knowledge-debt-breakdown';
import { debtTrend } from '@/mock/knowledge-debt-breakdown';
import { debtRadarData } from '@/mock/knowledge-debt-breakdown';
import { debtInsights } from '@/mock/knowledge-debt-breakdown';
import { architectureNodes, architectureEdges } from '@/mock/architecture';
import { knowledgeGraphNodes, knowledgeGraphEdges } from '@/mock/knowledge';
import { contextEngineData } from '@/mock/context-engine';
import { memoryEntries } from '@/mock/memory';
import { memoryPipelineStages, memoryStatistics, contextLossMetrics, knowledgeChunks, memoryInsights } from '@/mock/memory-pipeline';
import { knowledgeGapData } from '@/mock/knowledge-gap';
import { knowledgeTransferData } from '@/mock/knowledge-transfer';
import { repositories } from '@/mock/repositories';
import { repositoryDetail } from '@/mock/repository-detail';
import { agentActions } from '@/mock/actions';
import { agentFeedItems } from '@/mock/agent-feed';
import { recommendationsData } from '@/mock/recommendations';
import { activityFeedData } from '@/mock/activity-feed';
import { gitlabIssues } from '@/mock/gitlab';
import { missions } from '@/mock/missions';
import { interviewQuestions, interviewScoring } from '@/mock/interview';
import { freelancerData } from '@/mock/freelancer';
import { dependencyList } from '@/mock/dependencies';

// ============================================================
// Dashboard
// ============================================================
export function getDashboardMetrics() {
  return dashboardMetrics;
}

export function getDefaultRepositoryId(): string {
  return repositories[0]?.id ?? 'repo-1';
}

export function getRepositories() {
  return repositories;
}

// ============================================================
// Repository
// ============================================================
export function getRepositoryDetail() {
  return repositoryDetail;
}

export function getRepositoryById(repoId: string) {
  return repositories.find((r) => r.id === repoId) ?? repositories[0];
}

// ============================================================
// Scores
// ============================================================
export function getSurvivabilityData() {
  return survivabilityData;
}

export function getRecoverabilityData() {
  return recoverabilityData;
}

export function getBusFactorData() {
  return busFactorData;
}

export function getKnowledgeDebtBreakdown() {
  return { breakdown: debtBreakdown, trend: debtTrend, radar: debtRadarData, insights: debtInsights };
}

// ============================================================
// Risk
// ============================================================
export function getRiskCenterData() {
  return riskCenterData;
}

export function getRisks() {
  return risks;
}

// ============================================================
// Ownership
// ============================================================
export function getOwnershipData() {
  return ownershipMap;
}

export function getOwnershipEnhanced() {
  return ownershipEnhancedData;
}

// ============================================================
// Architecture Graph
// ============================================================
export function getArchitectureGraph() {
  return { nodes: architectureNodes, edges: architectureEdges };
}

// ============================================================
// Knowledge Graph
// ============================================================
export function getKnowledgeGraphData() {
  return { nodes: knowledgeGraphNodes, edges: knowledgeGraphEdges };
}

// ============================================================
// Memory Engine
// ============================================================
export function getMemoryData() {
  return memoryEntries;
}

export function getMemoryPipelineData() {
  return {
    stages: memoryPipelineStages,
    statistics: memoryStatistics,
    contextLoss: contextLossMetrics,
    chunks: knowledgeChunks,
    insights: memoryInsights,
  };
}

export function getContextEngineData() {
  return contextEngineData;
}

// ============================================================
// Knowledge Gap & Transfer
// ============================================================
export function getKnowledgeGapData() {
  return knowledgeGapData;
}

export function getKnowledgeTransferData() {
  return knowledgeTransferData;
}

// ============================================================
// Agent
// ============================================================
export function getAgentActions() {
  return agentActions;
}

export function getAgentFeed() {
  return agentFeedItems;
}

export function getRecommendations() {
  return recommendationsData;
}

export function getActivityFeed() {
  return activityFeedData;
}

// ============================================================
// GitLab
// ============================================================
export function getGitLabIssues() {
  return gitlabIssues;
}

// ============================================================
// Missions
// ============================================================
export function getMissions() {
  return missions;
}

// ============================================================
// Interview
// ============================================================
export function getInterviewData() {
  return { questions: interviewQuestions, scoring: interviewScoring };
}

// ============================================================
// Freelancer Rescue
// ============================================================
export function getFreelancerData() {
  return freelancerData;
}

// ============================================================
// Dependencies
// ============================================================
export function getDependenciesData() {
  return dependencyList;
}