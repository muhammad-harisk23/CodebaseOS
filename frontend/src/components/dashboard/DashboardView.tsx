'use client';

import { motion } from 'framer-motion';
import {
  FileText, FolderGit2, GraduationCap, MessageSquare, AlertTriangle, Clock, Shield, Cpu,
  Users, FileCode, Zap, ArrowRight, ShieldAlert, Activity, Target, GitBranch, TrendingDown,
  Eye, Brain, Lightbulb, Upload, Share2, ChevronRight,
} from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { ActionCard } from '@/components/shared/ActionCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app-store';
import { dashboardMetrics } from '@/mock/metrics';
import { repositories } from '@/mock/repositories';
import { agentActions } from '@/mock/actions';
import { survivabilityData } from '@/mock/survivability';
import { recoverabilityData } from '@/mock/recoverability';
import { busFactorData } from '@/mock/bus-factor';
import { riskCenterData } from '@/mock/risk-center';
import { ownershipEnhancedData } from '@/mock/ownership-enhanced';
import { agentFeedItems } from '@/mock/agent-feed';
import { activityFeedData } from '@/mock/activity-feed';
import { recommendationsData } from '@/mock/recommendations';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-accent/15 text-emerald-accent',
  running: 'bg-electric/15 text-electric',
  pending: 'bg-amber-accent/15 text-amber-accent',
  failed: 'bg-danger-accent/15 text-danger-accent',
};

export function DashboardView() {
  const { selectedRepositoryId, setCurrentView } = useAppStore();
  const repo = repositories.find((r) => r.id === selectedRepositoryId) ?? repositories[0];
  const recentActions = agentActions.slice(0, 3);
  const nav = (view: ViewId) => () => setCurrentView(view);

  const reportItems = [
    { label: 'Knowledge Debt', value: repo.knowledgeDebt, max: 100, icon: AlertTriangle, color: 'text-danger-accent' },
    { label: 'Survivability', value: repo.survivability, max: 100, icon: Shield, color: 'text-amber-accent' },
    { label: 'Recoverability', value: repo.recoverability, max: 100, icon: Zap, color: 'text-amber-accent' },
    { label: 'Critical Risks', value: repo.criticalRisks, max: 10, icon: AlertTriangle, color: 'text-danger-accent' },
    { label: 'Architecture Complexity', value: repo.architectureComplexity === 'Critical' ? 10 : repo.architectureComplexity === 'High' ? 7 : repo.architectureComplexity === 'Medium' ? 4 : 1, max: 10, icon: Cpu, color: repo.architectureComplexity === 'High' || repo.architectureComplexity === 'Critical' ? 'text-danger-accent' : 'text-amber-accent' },
    { label: 'Estimated Onboarding', value: 0, max: 1, icon: Clock, color: 'text-muted-foreground', display: repo.estimatedOnboardingTime },
  ];

  const heroMetrics = [
    { title: 'Survivability Score™', value: `${survivabilityData.score}/${survivabilityData.max}`, color: 'text-danger-accent', border: 'border-t-danger-accent', badge: 'High Risk', badgeClass: 'bg-danger-accent/15 text-danger-accent', desc: 'Measures the repository\'s ability to evolve safely if the primary contributor leaves.', trend: 'down' as const },
    { title: 'Recoverability Score™', value: `${recoverabilityData.score}/${recoverabilityData.max}`, color: 'text-amber-accent', border: 'border-t-amber-accent', badge: 'Rebuild Recommended', badgeClass: 'bg-amber-accent/15 text-amber-accent', desc: 'Evaluates whether refactoring or a full rebuild is the more cost-effective path forward.', trend: 'down' as const },
    { title: 'Bus Factor™', value: `${busFactorData.score}/${busFactorData.totalContributors}`, color: 'text-danger-accent', border: 'border-t-danger-accent', badge: 'Critical', badgeClass: 'bg-danger-accent/15 text-danger-accent', desc: 'The number of contributors who could leave before the repository becomes unmaintainable.', trend: 'flat' as const },
    { title: 'Ownership Health', value: '23%', color: 'text-amber-accent', border: 'border-t-amber-accent', badge: 'Concentrated', badgeClass: 'bg-amber-accent/15 text-amber-accent', desc: 'Average ownership distribution across modules that are not yet classified as knowledge silos.', trend: 'down' as const },
  ];

  const riskSnapshotItems = [
    { icon: AlertTriangle, label: 'Overall Risk', value: 'HIGH', color: 'text-danger-accent', badgeClass: 'bg-danger-accent/15 text-danger-accent', glow: true, sub: 'Across all risk categories' },
    { icon: Shield, label: 'Recoverability', value: `${recoverabilityData.score}/100`, color: 'text-amber-accent', badgeClass: 'bg-amber-accent/15 text-amber-accent', glow: false, sub: 'Rebuild recommended' },
    { icon: Activity, label: 'Critical Risks', value: '4', color: 'text-danger-accent', badgeClass: 'bg-danger-accent/15 text-danger-accent', glow: false, sub: 'Require immediate attention' },
    { icon: Target, label: 'Knowledge Concentration', value: 'Alice Chen holds 72% of critical knowledge', color: 'text-danger-accent', badgeClass: 'text-danger-accent text-[10px]', glow: false, sub: '' },
    { icon: GitBranch, label: 'Ownership Health', value: '3 of 5 modules are knowledge silos', color: 'text-amber-accent', badgeClass: 'text-amber-accent text-[10px]', glow: false, sub: '' },
  ];

  const survivabilityCards = [
    { label: 'Survivability', metric: '34/100 — High Risk', color: 'border-l-danger-accent', valueClass: 'text-danger-accent', text: 'The repository cannot safely evolve without its primary contributor. 3 of 5 modules have no documented backup.' },
    { label: 'Recoverability', metric: '38/100 — Rebuild Recommended', color: 'border-l-amber-accent', valueClass: 'text-amber-accent', text: 'Refactoring would cost more than rebuilding core modules. 18% of the codebase is dead code from previous iterations.' },
    { label: 'Bus Factor', metric: '1 out of 3 — Critical', color: 'border-l-danger-accent', valueClass: 'text-danger-accent', text: 'A single departure would immediately cripple 4 critical modules including authentication and infrastructure.' },
    { label: 'Ownership', metric: '72% concentrated in 1 person', color: 'border-l-danger-accent', valueClass: 'text-danger-accent', text: 'Knowledge concentration creates unacceptable organizational risk with no documented succession plan.' },
  ];

  const pipelineSteps = [
    { icon: 'Upload', label: 'Repository Upload', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'GitBranch', label: 'Repository Analysis', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'Brain', label: 'Repository Memory', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'Share2', label: 'Knowledge Graph', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'ShieldAlert', label: 'Risk Detection', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'Lightbulb', label: 'Recommendations', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'FolderGit2', label: 'GitLab Actions', status: 'completed', color: 'text-emerald-accent' },
    { icon: 'MessageSquare', label: 'Knowledge Transfer', status: 'completed', color: 'text-emerald-accent' },
  ];

  return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-8" variants={stagger} initial="hidden" animate="show">
      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">{repo.fullName}</p>
      </motion.div>

      {/* Top Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboardMetrics.map((m, i) => (
          <MetricCard key={m.label} metric={m} index={i} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-glass-border" />
        <span>Survival Analysis</span>
        <div className="h-px flex-1 bg-glass-border" />
      </motion.div>

      {/* Differentiator Hero Metrics */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-electric/20 p-6 glow-blue">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Repository Survival Assessment</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Can this repository survive without its creator?</p>
          <p className="text-[10px] text-muted-foreground mt-1">Based on {ownershipEnhancedData.modules.length} modules, {busFactorData.totalContributors} contributors, and {riskCenterData.topRisks.length} identified risks.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {heroMetrics.map((m) => (
            <div key={m.title} className={cn('glass-card rounded-lg border border-glass-border border-t-[3px] p-4', m.border)}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{m.title}</p>
                {m.trend === 'down' && <TrendingDown className="h-3 w-3 text-danger-accent" />}
              </div>
              <p className={cn('text-2xl font-bold tracking-tight', m.color)}>{m.value}</p>
              <Badge variant="outline" className={cn('mt-2 text-[10px] px-1.5 py-0', m.badgeClass)}>{m.badge}</Badge>
              <p className="mt-2.5 text-[10px] text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Agent Pipeline */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Agent Pipeline</h2>
          <Badge variant="outline" className="border-electric/50 text-electric">Active</Badge>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {pipelineSteps.map((step, i) => {
              let Icon = Activity;
              try {
                const icons = require('lucide-react');
                Icon = icons[step.icon] || icons.default?.[step.icon] || Activity;
              } catch {
                Icon = Activity;
              }
              return (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-full border-2', step.status === 'completed' ? 'border-emerald-accent/50 bg-emerald-accent/10' : 'border-glass-border bg-surface-inset')}>
                    <Icon className={cn('h-4 w-4', step.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{step.label}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{step.status}</p>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Repository Intelligence Report */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl p-6 border border-glass-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15">
            <FileCode className="h-5 w-5 text-electric" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Repository Intelligence Report</h2>
            <p className="text-xs text-muted-foreground">Analysis completed {new Date(repo.lastAnalyzed).toLocaleDateString()}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">Comprehensive analysis across {reportItems.length} key dimensions of repository health and risk.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg bg-surface-inset p-3">
              <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {item.display ?? `${item.value}${item.max === 100 ? '/100' : `/${item.max}`}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Biggest Risk Callout */}
        <div className="rounded-lg border border-danger-accent/30 bg-danger-accent/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-danger-accent" />
            <div>
              <p className="text-sm font-semibold text-danger-accent">Biggest Risk</p>
              <p className="mt-1 text-sm text-foreground">{repo.biggestRisk}</p>
            </div>
          </div>
        </div>

        {/* Top Risk Categories Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {riskCenterData.riskCategories.slice(0, 4).map((cat) => (
            <div key={cat.category} className="rounded-md bg-surface-inset p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground">{cat.category}</p>
              <p className={cn(
                'text-sm font-bold tabular-nums',
                cat.score > 75 ? 'text-danger-accent' : cat.score > 50 ? 'text-amber-accent' : 'text-emerald-accent',
              )}>
                {cat.score}/{cat.max}
              </p>
              <p className="text-[10px] text-muted-foreground">{cat.riskCount} risk{cat.riskCount !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Repository Risk Snapshot */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-foreground">Repository Risk Snapshot</h2>
          <Badge variant="outline" className="bg-danger-accent/15 text-danger-accent text-[10px]">{riskCenterData.overallStatus.risk} RISK</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Primary concern: {riskCenterData.overallStatus.primaryConcern}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {riskSnapshotItems.map((s) => (
            <div key={s.label} className={cn('glass-card rounded-lg border border-glass-border p-3', s.glow && 'glow-danger')}>
              <s.icon className={cn('h-4 w-4 mb-2', s.color)} />
              <p className="text-[10px] text-muted-foreground mb-0.5">{s.label}</p>
              <p className={cn('text-xs font-semibold leading-snug', s.badgeClass)}>{s.value}</p>
              {s.sub && <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Primary Concern Callout */}
        <div className="mt-3 rounded-md border border-danger-accent/20 bg-danger-accent/[0.03] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-3 w-3 text-danger-accent" />
            <p className="text-[10px] text-danger-accent font-semibold uppercase tracking-wide">Primary Concern</p>
          </div>
          <p className="text-xs text-foreground">{riskCenterData.overallStatus.primaryConcern}. Immediate action recommended to prevent catastrophic knowledge loss.</p>
        </div>
      </motion.div>

      {/* Can This Repository Survive? */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-electric/30 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-1">Can this repository survive?</h2>
        <p className="text-xs text-muted-foreground mb-4">Aggregated assessment from survivability, recoverability, bus factor, and ownership analysis.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {survivabilityCards.map((item) => (
            <div key={item.label} className={cn('rounded-lg border border-glass-border border-l-[3px] bg-surface-inset p-3.5', item.color)}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className={cn('text-sm font-bold mb-1', item.valueClass)}>{item.metric}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={nav('risk-center')} className="flex items-center gap-1.5 rounded-lg bg-electric/15 px-4 py-2 text-xs font-medium text-electric hover:bg-electric/25 transition-colors">
            View Full Analysis <ArrowRight className="h-3 w-3" />
          </button>
          <button onClick={nav('agent-actions')} className="flex items-center gap-1.5 rounded-lg bg-surface-inset border border-glass-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
            Start Risk Mitigation <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* Risk Recommendations */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recommended Actions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Priority-ranked actions to reduce repository risk and improve team resilience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={FileText}
            title="Generate Documentation"
            description="Automatically generate comprehensive documentation for the most critical undocumented modules."
            variant="primary"
            onClick={nav('documentation')}
          />
          <ActionCard
            icon={FolderGit2}
            title="Create GitLab Issue"
            description="Create prioritized GitLab issues for the top detected risks with detailed remediation steps."
            onClick={nav('gitlab-actions')}
          />
          <ActionCard
            icon={GraduationCap}
            title="Generate Learning Mission"
            description="Build a structured learning path tailored to the highest-risk knowledge areas."
            onClick={nav('learning-missions')}
          />
          <ActionCard
            icon={MessageSquare}
            title="Start Knowledge Interview"
            description="Begin an interactive knowledge capture session to extract institutional knowledge."
            onClick={nav('knowledge-interview')}
          />
          <ActionCard
            icon={Users}
            title="Transfer Knowledge"
            description="Initiate structured knowledge transfer sessions for the highest-risk siloed modules to distribute expertise across the team."
            variant="danger"
            onClick={nav('knowledge-interview')}
          />
          <ActionCard
            icon={ShieldAlert}
            title="Assess Bus Factor"
            description="Run a deep bus factor analysis to identify single points of failure and quantify departure risk for each contributor."
            onClick={nav('bus-factor')}
          />
          <ActionCard
            icon={Zap}
            title="Patch Dependency Vulnerabilities"
            description={recommendationsData.high.find(r => r.id === 'rec-1')?.description.slice(0, 140) + '...' || 'Patch critical CVEs in production dependencies including a token verification bypass vector.'}
            variant="danger"
            onClick={nav('risk-center')}
          />
          <ActionCard
            icon={GitBranch}
            title="Break Circular Dependencies"
            description={recommendationsData.high.find(r => r.id === 'rec-3')?.description.slice(0, 140) + '...' || 'Resolve the 5-module circular dependency chain that prevents isolated testing and causes deployment fragility.'}
            onClick={nav('architecture')}
          />
        </div>
      </motion.div>

      {/* Agent Insights */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Agent Insights</h2>
          <button onClick={nav('risk-center')} className="flex items-center gap-1 text-xs font-medium text-electric hover:underline">
            View Risk Center <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Insight 1: Knowledge Concentration */}
          <motion.div variants={fadeUp} className="glass-card rounded-xl border border-danger-accent/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-danger-accent" />
              <span className="text-xs font-semibold text-danger-accent">Critical</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Knowledge Concentration Detected</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Alice Chen holds 72% of critical module knowledge. If Alice departs, the organization
              loses the ability to safely modify authentication, infrastructure, and API gateway modules.
              Immediate knowledge transfer is required to prevent a single-point-of-failure scenario.
            </p>
          </motion.div>

          {/* Insight 2: Survivability */}
          <motion.div variants={fadeUp} className="glass-card rounded-xl border border-amber-accent/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-accent" />
              <span className="text-xs font-semibold text-amber-accent">Warning</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Repository Survivability Critical</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              With a survivability score of 34/100 and bus factor of 1, this repository cannot safely evolve
              without its primary contributor. The risk assessment recommends immediate documentation
              and ownership transfer as the highest priority actions.
            </p>
          </motion.div>

          {/* Insight 3: Recoverability */}
          <motion.div variants={fadeUp} className="glass-card rounded-xl border border-purple-glow/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-glow" />
              <span className="text-xs font-semibold text-purple-glow">Insight</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Low Recoverability Score</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Score of 38/100 indicates rebuilding core modules would be more cost-effective than refactoring.
              The authentication and infrastructure modules are the primary candidates for a rebuild
              approach, while payment and database systems can be retained.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* GitLab Actions Widget */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">GitLab Actions</h2>
          <button onClick={nav('gitlab-actions')} className="flex items-center gap-1 text-xs font-medium text-electric hover:underline">
            View All Actions <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-surface-inset">
              <p className="text-lg font-bold text-foreground">{activityFeedData.summary.issuesCreated}</p>
              <p className="text-[10px] text-muted-foreground">Issues Created</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-inset">
              <p className="text-lg font-bold text-foreground">{activityFeedData.summary.tasksGenerated}</p>
              <p className="text-[10px] text-muted-foreground">Tasks Generated</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-inset">
              <p className="text-lg font-bold text-foreground">{activityFeedData.summary.documentationGenerated}</p>
              <p className="text-[10px] text-muted-foreground">Docs Generated</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-inset">
              <p className="text-lg font-bold text-foreground">{activityFeedData.summary.knowledgeCaptured}</p>
              <p className="text-[10px] text-muted-foreground">Knowledge Captured</p>
            </div>
          </div>

          <Separator className="bg-glass-border" />

          <ScrollArea className="max-h-[300px] overflow-auto scrollbar-thin">
            <div className="space-y-2">
              {activityFeedData.items.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-inset/50 transition-colors">
                  <Badge variant="outline" className={cn(
                    'text-[10px] shrink-0',
                    item.type === 'issue_created' ? 'border-danger-accent/50 text-danger-accent' :
                    item.type === 'documentation_generated' ? 'border-electric/50 text-electric' :
                    item.type === 'mission_generated' ? 'border-purple-glow/50 text-purple-glow' :
                    'border-glass-border text-muted-foreground'
                  )}>
                    {item.title}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex-1 truncate">{item.description}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </motion.div>

      {/* Recent Agent Actions */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Agent Actions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest automated analysis and remediation activities.</p>
          </div>
          <button
            onClick={nav('agent-actions')}
            className="flex items-center gap-1 text-xs font-medium text-electric hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="glass-card rounded-xl border border-glass-border divide-y divide-glass-border overflow-hidden">
          {recentActions.map((action) => (
            <div key={action.id} className="flex items-center gap-4 p-4 hover:bg-surface-inset transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{action.description}</p>
              </div>
              <Badge variant="outline" className={statusColors[action.status]}>
                {action.status}
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Agent Activity Feed */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Agent Activity</h2>
          <button onClick={nav('agent-actions')} className="flex items-center gap-1 text-xs font-medium text-electric hover:underline">
            View All Agent Actions <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-electric" />
            <span className="text-sm font-medium text-foreground">Live Agent Feed</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-accent animate-pulse" />
              <span className="text-[10px] text-emerald-accent">Live</span>
            </div>
          </div>

          <ScrollArea className="max-h-[400px] overflow-auto scrollbar-thin">
            <div className="space-y-2">
              {agentFeedItems.slice(0, 8).map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-surface-inset/50 hover:bg-surface-inset transition-colors">
                  <div className={cn('w-0.5 self-stretch rounded-full', item.riskLevel === 'critical' ? 'bg-danger-accent' : item.riskLevel === 'high' ? 'bg-amber-accent' : item.riskLevel === 'medium' ? 'bg-electric' : item.riskLevel === 'low' ? 'bg-emerald-accent' : 'bg-muted')} />
                  <Activity className={cn('h-4 w-4 shrink-0 mt-0.5', item.riskLevel === 'critical' ? 'text-danger-accent' : item.riskLevel === 'high' ? 'text-amber-accent' : 'text-electric')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-foreground">{item.title}</span>
                      <Badge variant="outline" className="text-[10px] border-glass-border text-muted-foreground">{item.module}</Badge>
                      <Badge variant="outline" className="text-[10px] border-glass-border">
                        {Math.round(item.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{item.reasoning}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </motion.div>
    </motion.div>
  );
}