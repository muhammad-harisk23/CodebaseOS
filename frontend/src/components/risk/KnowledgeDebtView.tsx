'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileX,
  LayoutGrid,
  Package,
  Users,
  Share2,
  GitBranch,
  FolderGit2,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { ActionCard } from '@/components/shared/ActionCard';
import { RadarChart } from '@/components/shared/charts/RadarChart';
import { TrendChart } from '@/components/shared/charts/TrendChart';
import { debtBreakdown, debtTrend, debtRadarData, debtInsights } from '@/mock/knowledge-debt-breakdown';
import { useAppStore } from '@/store/app-store';
import type { ViewId } from '@/types';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const iconMap: Record<string, LucideIcon> = {
  FileText,
  FileX,
  LayoutGrid,
  Package,
  Users,
  Share2,
  GitBranch,
};

const severityBorder: Record<string, string> = {
  critical: 'border-l-danger-accent',
  high: 'border-l-amber-accent',
  medium: 'border-l-electric',
  low: 'border-l-emerald-accent',
};

const severityBadge: Record<string, string> = {
  critical: 'bg-danger-accent/15 text-danger-accent',
  high: 'bg-amber-accent/15 text-amber-accent',
  medium: 'bg-electric/15 text-electric',
  low: 'bg-emerald-accent/15 text-emerald-accent',
};

const severityLabel: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function getScoreBarColor(score: number): string {
  if (score >= 85) return 'bg-danger-accent';
  if (score >= 70) return 'bg-amber-accent';
  if (score >= 50) return 'bg-electric';
  return 'bg-emerald-accent';
}

export function KnowledgeDebtView() {
  const { setCurrentView } = useAppStore();

  const breakdownItems = useMemo(() => {
    return debtBreakdown.map((item) => {
      const Icon = iconMap[item.icon] ?? FileText;
      return { ...item, Icon };
    });
  }, []);

  const scoreBreakdown = useMemo(
    () => debtBreakdown.map((d) => ({ category: d.label, score: d.score, max: d.max, description: d.description })),
    []
  );

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Hero */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight gradient-text">Knowledge Debt Score™</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Measuring the gap between what your team knows and what is documented. High scores indicate
          critical institutional knowledge at risk of being lost.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: AlertTriangle, label: 'Critical Categories', value: '2', detail: 'Documentation, Ownership' },
          { icon: TrendingUp, label: 'Trend', value: '+19', detail: 'Points over 12 weeks' },
          { icon: Users, label: 'Knowledge Holders', value: '3', detail: 'Hold 72% of critical knowledge' },
          { icon: GitBranch, label: 'Modules at Risk', value: '5', detail: 'Bus factor of 1' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl border border-glass-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.detail}</p>
          </div>
        ))}
      </motion.div>

      {/* Score + Visuals Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="flex justify-center lg:justify-start">
          <ScoreCard
            label="Knowledge Debt Score"
            score={81}
            max={100}
            description="Severe knowledge concentration risk detected across the repository."
            size="large"
            breakdown={scoreBreakdown}
          />
        </div>

        {/* Radar Chart */}
        <div className="glass-card rounded-xl border border-glass-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Debt Radar</h3>
          <RadarChart data={debtRadarData} height={280} />
        </div>

        {/* Trend Chart */}
        <div className="glass-card rounded-xl border border-glass-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Debt Trend</h3>
          <TrendChart
            data={debtTrend}
            color="var(--danger-accent)"
            height={280}
            title={undefined}
          />
        </div>
      </motion.div>

      {/* Debt Breakdown */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Debt Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdownItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="glass-card glass-card-hover rounded-xl border border-glass-border p-4 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <item.Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.label}</h3>
                    <Badge className={cn('text-[10px] shrink-0', severityBadge[item.severity])} variant="outline">
                      {severityLabel[item.severity]}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Score</span>
                  <span className="tabular-nums text-foreground font-medium">{item.score}/{item.max}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    className={cn('h-full rounded-full', getScoreBarColor(item.score))}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.score / item.max) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Debt Insights</h2>
        <div className="space-y-3">
          {debtInsights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={fadeUp}
              className={cn(
                'rounded-lg border border-glass-border bg-surface-inset/50 p-4 border-l-[3px]',
                severityBorder[insight.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                    <Badge className={cn('text-[10px] shrink-0', severityBadge[insight.severity])} variant="outline">
                      {severityLabel[insight.severity]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{insight.description}</p>
                  <p className="text-xs text-muted-foreground italic">{insight.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recommended Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActionCard
            icon={FileText}
            title="Generate Documentation"
            description="Auto-generate documentation for the 12 modules with the highest knowledge debt scores, prioritizing undocumented API contracts and critical paths."
            variant="primary"
            onClick={() => setCurrentView('documentation' as ViewId)}
          />
          <ActionCard
            icon={FolderGit2}
            title="Create GitLab Issue"
            description="Create a structured GitLab issue with all debt insights, assigned to the team lead with severity-prioritized action items."
            variant="default"
            onClick={() => setCurrentView('gitlab-actions' as ViewId)}
          />
          <ActionCard
            icon={GraduationCap}
            title="Create Learning Mission"
            description="Generate a guided learning mission to distribute critical knowledge across the team, focusing on the top 3 at-risk modules."
            variant="default"
            onClick={() => setCurrentView('learning-missions' as ViewId)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}