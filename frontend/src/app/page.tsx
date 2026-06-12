'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppShell } from '@/components/layout/AppShell';

// Homepage sections
import { HeroSection } from '@/components/homepage/HeroSection';
import { CrisisSection } from '@/components/homepage/CrisisSection';
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection';
import { WhyDifferentSection } from '@/components/homepage/WhyDifferentSection';
import { FreelancerRescueSection } from '@/components/homepage/FreelancerRescueSection';
import { AgentWorkflowSection } from '@/components/homepage/AgentWorkflowSection';
import { FinalCTASection } from '@/components/homepage/FinalCTASection';

// Dashboard
import { DashboardView } from '@/components/dashboard/DashboardView';
import { SettingsView } from '@/components/shared/SettingsView';

// Sub-views (lazy loaded for performance)
const MemoryEngineView = lazy(() => import('@/components/intelligence/MemoryEngineView').then(m => ({ default: m.MemoryEngineView })));
const ArchitectureView = lazy(() => import('@/components/intelligence/ArchitectureView').then(m => ({ default: m.ArchitectureView })));
const KnowledgeGraphView = lazy(() => import('@/components/intelligence/KnowledgeGraphView').then(m => ({ default: m.KnowledgeGraphView })));
const KnowledgeDebtView = lazy(() => import('@/components/risk/KnowledgeDebtView').then(m => ({ default: m.KnowledgeDebtView })));
const SurvivabilityView = lazy(() => import('@/components/risk/SurvivabilityView').then(m => ({ default: m.SurvivabilityView })));
const RecoverabilityView = lazy(() => import('@/components/risk/RecoverabilityView').then(m => ({ default: m.RecoverabilityView })));
const RiskCenterView = lazy(() => import('@/components/risk/RiskCenterView').then(m => ({ default: m.RiskCenterView })));
const BusFactorView = lazy(() => import('@/components/risk/BusFactorView').then(m => ({ default: m.BusFactorView })));
const OwnershipView = lazy(() => import('@/components/risk/OwnershipView').then(m => ({ default: m.OwnershipView })));
const AgentActionsView = lazy(() => import('@/components/agent/AgentActionsView').then(m => ({ default: m.AgentActionsView })));
const GitLabActionsView = lazy(() => import('@/components/agent/GitLabActionsView').then(m => ({ default: m.GitLabActionsView })));
const LearningMissionsView = lazy(() => import('@/components/knowledge/LearningMissionsView').then(m => ({ default: m.LearningMissionsView })));
const KnowledgeInterviewView = lazy(() => import('@/components/knowledge/KnowledgeInterviewView').then(m => ({ default: m.KnowledgeInterviewView })));
const DocumentationView = lazy(() => import('@/components/knowledge/DocumentationView').then(m => ({ default: m.DocumentationView })));
const FreelancerRescueView = lazy(() => import('@/components/freelancer/FreelancerRescueView').then(m => ({ default: m.FreelancerRescueView })));
const RepositoryUploadView = lazy(() => import('@/components/shared/RepositoryUploadView').then(m => ({ default: m.RepositoryUploadView })));
const RepositoryAnalysisView = lazy(() => import('@/components/shared/RepositoryAnalysisView').then(m => ({ default: m.RepositoryAnalysisView })));

function ViewLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <CrisisSection />
      <HowItWorksSection />
      <WhyDifferentSection />
      <FreelancerRescueSection />
      <AgentWorkflowSection />
      <FinalCTASection />
    </>
  );
}

function AppView() {
  const { currentView } = useAppStore();

  const viewMap: Record<string, React.ReactNode> = {
    'dashboard': <DashboardView />,
    'repository-upload': <Suspense fallback={<ViewLoader />}><RepositoryUploadView /></Suspense>,
    'repository-analysis': <Suspense fallback={<ViewLoader />}><RepositoryAnalysisView /></Suspense>,
    'memory-engine': <Suspense fallback={<ViewLoader />}><MemoryEngineView /></Suspense>,
    'architecture': <Suspense fallback={<ViewLoader />}><ArchitectureView /></Suspense>,
    'knowledge-graph': <Suspense fallback={<ViewLoader />}><KnowledgeGraphView /></Suspense>,
    'knowledge-debt': <Suspense fallback={<ViewLoader />}><KnowledgeDebtView /></Suspense>,
    'survivability': <Suspense fallback={<ViewLoader />}><SurvivabilityView /></Suspense>,
    'recoverability': <Suspense fallback={<ViewLoader />}><RecoverabilityView /></Suspense>,
    'risk-center': <Suspense fallback={<ViewLoader />}><RiskCenterView /></Suspense>,
    'bus-factor': <Suspense fallback={<ViewLoader />}><BusFactorView /></Suspense>,
    'ownership': <Suspense fallback={<ViewLoader />}><OwnershipView /></Suspense>,
    'agent-actions': <Suspense fallback={<ViewLoader />}><AgentActionsView /></Suspense>,
    'gitlab-actions': <Suspense fallback={<ViewLoader />}><GitLabActionsView /></Suspense>,
    'learning-missions': <Suspense fallback={<ViewLoader />}><LearningMissionsView /></Suspense>,
    'knowledge-interview': <Suspense fallback={<ViewLoader />}><KnowledgeInterviewView /></Suspense>,
    'documentation': <Suspense fallback={<ViewLoader />}><DocumentationView /></Suspense>,
    'freelancer-rescue': <Suspense fallback={<ViewLoader />}><FreelancerRescueView /></Suspense>,
    'settings': <Suspense fallback={<ViewLoader />}><SettingsView /></Suspense>,
  };

  return viewMap[currentView] ?? <DashboardView />;
}

export default function Page() {
  const { currentView } = useAppStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const isHome = currentView === 'home';

  return (
    <AppShell>
      {isHome ? <HomePage /> : <AppView />}
    </AppShell>
  );
}