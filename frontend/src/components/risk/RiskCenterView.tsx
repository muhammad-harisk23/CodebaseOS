'use client';

import { motion } from 'framer-motion';
import { FileText, FolderGit2, GraduationCap, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionCard } from '@/components/shared/ActionCard';
import { riskCenterData } from '@/mock/risk-center';
import { risks } from '@/mock/risk';
import { knowledgeGapData } from '@/mock/knowledge-gap';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const severityColor: Record<string, string> = {
  critical: 'text-danger-accent',
  high: 'text-amber-accent',
  medium: 'text-electric',
  low: 'text-emerald-accent',
};

const severityBadge: Record<string, string> = {
  critical: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
  high: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  medium: 'bg-electric/15 text-electric border-electric/30',
  low: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
};

const severityRingColor: Record<string, string> = {
  critical: 'var(--danger-accent)',
  high: 'var(--amber-accent)',
  medium: 'var(--electric)',
  low: 'var(--emerald-accent)',
};

function categoryBarColor(score: number) {
  if (score > 70) return 'bg-danger-accent';
  if (score > 50) return 'bg-amber-accent';
  if (score > 30) return 'bg-electric';
  return 'bg-emerald-accent';
}

const distributionColors: Record<string, string> = {
  Architecture: 'bg-danger-accent',
  Dependencies: 'bg-amber-accent',
  Ownership: 'bg-danger-accent',
  Documentation: 'bg-danger-accent',
  Maintainability: 'bg-electric',
  'Knowledge Debt': 'bg-danger-accent',
  Recoverability: 'bg-amber-accent',
};

export function RiskCenterView() {
  const { setCurrentView } = useAppStore();
  const totalCategoryScore = riskCenterData.riskCategories.reduce((s, c) => s + c.score, 0);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Risk Center</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Executive command center for repository risk intelligence. Automated detection of knowledge
          concentration, dependency vulnerabilities, and structural decay.
        </p>
      </motion.div>

      {/* 1 - Top Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {riskCenterData.topMetrics.map((m) => {
          const pct = Math.min((m.value / m.max) * 100, 100);
          const radius = 18;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference * (1 - pct / 100);
          return (
            <div key={m.label} className="glass-card rounded-xl border border-glass-border p-4 flex flex-col items-center gap-2">
              <svg width={48} height={48} className="-rotate-90">
                <circle cx={24} cy={24} r={radius} fill="none" stroke="currentColor" strokeWidth={4} className="text-muted/20" />
                <motion.circle
                  cx={24} cy={24} r={radius} fill="none"
                  stroke={severityRingColor[m.severity]}
                  strokeWidth={4} strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <span className={cn('text-2xl font-bold tabular-nums', severityColor[m.severity])}>
                {m.value}
              </span>
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <Badge variant="outline" className={cn('text-[10px] border', severityBadge[m.severity])}>
                {m.severity}
              </Badge>
            </div>
          );
        })}
      </motion.div>

      {/* 2 - Overall Status Card */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-danger-accent/40 glow-danger p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-danger-accent">
                Repository Risk: {riskCenterData.overallStatus.risk}
              </h2>
              <Badge variant="outline" className="border-danger-accent/30 bg-danger-accent/10 text-danger-accent">
                Critical
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Primary Concern: {riskCenterData.overallStatus.primaryConcern}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-surface-inset rounded-lg border border-glass-border px-4 py-3 text-center min-w-[120px]">
              <p className="text-xl font-bold text-danger-accent tabular-nums">4</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Critical Risks</p>
            </div>
            <div className="bg-surface-inset rounded-lg border border-glass-border px-4 py-3 text-center min-w-[120px]">
              <p className="text-xl font-bold text-amber-accent tabular-nums">3</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">High Risk Modules</p>
            </div>
            <div className="bg-surface-inset rounded-lg border border-glass-border px-4 py-3 text-center min-w-[120px]">
              <p className="text-xl font-bold text-amber-accent tabular-nums">2</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Contributors at Risk</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 - Risk Categories */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Risk Categories</h2>
        <div className="glass-card rounded-xl border border-glass-border p-5 space-y-3">
          {riskCenterData.riskCategories.map((cat) => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{cat.category}</span>
              <div className="flex-1 h-6 bg-surface-inset rounded-md overflow-hidden relative">
                <motion.div
                  className={cn('h-full rounded-md', categoryBarColor(cat.score))}
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.score / cat.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <Badge variant="outline" className="text-[10px] border-glass-border bg-surface-inset text-muted-foreground shrink-0">
                {cat.riskCount}
              </Badge>
              <span className={cn('text-sm font-semibold tabular-nums w-8 text-right shrink-0', severityColor[cat.score > 70 ? 'critical' : cat.score > 50 ? 'high' : cat.score > 30 ? 'medium' : 'low'])}>
                {cat.score}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4 - Top 10 Risks */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Top Risks</h2>
        <div className="max-h-[600px] overflow-auto scrollbar-thin space-y-3 pr-1">
          {riskCenterData.topRisks.map((risk) => {
            const showFiles = risk.affectedFiles.slice(0, 4);
            const extra = risk.affectedFiles.length - 4;
            return (
              <div key={risk.id} className="glass-card glass-card-hover rounded-xl border border-glass-border p-4 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={cn('w-0.5 self-stretch rounded-full shrink-0', severityColor[risk.severity].replace('text-', 'bg-'))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{risk.title}</h3>
                      <Badge variant="outline" className={cn('text-[10px] border', severityBadge[risk.severity])}>
                        {risk.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] bg-surface-inset border-glass-border text-muted-foreground">
                        {risk.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                      {risk.recommendation}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {showFiles.map((f) => (
                        <code key={f} className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {f.split('/').pop()}
                        </code>
                      ))}
                      {extra > 0 && (
                        <span className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          +{extra} more
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-glass-border hover:border-electric/40">
                      Create GitLab Issue
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 5 - Risk Distribution */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Risk Distribution</h2>
        <div className="flex h-10 rounded-lg overflow-hidden">
          {riskCenterData.riskCategories.map((cat) => {
            const pct = (cat.score / totalCategoryScore) * 100;
            if (pct < 3) return null;
            return (
              <motion.div
                key={cat.category}
                className={cn('flex items-center justify-center transition-all', distributionColors[cat.category] ?? 'bg-muted')}
                title={`${cat.category}: ${cat.score}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {pct > 10 && <span className="text-[10px] font-medium text-white truncate px-1">{cat.category}</span>}
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {riskCenterData.riskCategories.map((cat) => (
            <div key={cat.category} className="flex items-center gap-1.5">
              <div className={cn('h-2.5 w-2.5 rounded-sm', distributionColors[cat.category] ?? 'bg-muted')} />
              <span className="text-[10px] text-muted-foreground">{cat.category}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Knowledge Gap Prediction */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Knowledge Gap <span className="gradient-text">Prediction™</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Predict future problems before they become critical.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {knowledgeGapData.predictions.map((p) => (
            <div
              key={p.module}
              className={cn(
                'rounded-lg border border-glass-border bg-surface-inset/50 p-4 space-y-3 border-l-2',
                p.predictionSeverity === 'critical' && 'border-l-danger-accent',
                p.predictionSeverity === 'high' && 'border-l-amber-accent',
                p.predictionSeverity === 'medium' && 'border-l-electric',
                p.predictionSeverity === 'low' && 'border-l-emerald-accent'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{p.module}</h3>
                <Badge variant="outline" className={cn('text-[10px] border shrink-0', severityBadge[p.predictionSeverity])}>
                  {p.predictionSeverity}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Current Risk:</span>
                <Badge variant="outline" className={cn('text-[10px] border', severityBadge[p.predictionSeverity])}>
                  {p.currentRisk.split('—')[0].trim()}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {p.factors.slice(0, 2).map((f) => (
                  <span
                    key={f}
                    className="inline-block rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground border border-glass-border truncate max-w-full"
                    title={f}
                  >
                    {f.length > 40 ? f.slice(0, 40) + '...' : f}
                  </span>
                ))}
                {p.factors.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">+{p.factors.length - 2}</span>
                )}
              </div>

              <p className="text-xs text-foreground font-medium leading-relaxed line-clamp-3">
                {p.prediction}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Time to Impact: <span className={cn('font-semibold', severityColor[p.predictionSeverity])}>{p.timeToImpact}</span>
                </span>
              </div>

              <div className="h-0.5 w-full rounded-full overflow-hidden bg-muted/30">
                <div
                  className={cn(
                    'h-full rounded-full',
                    p.predictionSeverity === 'critical' && 'bg-danger-accent',
                    p.predictionSeverity === 'high' && 'bg-amber-accent',
                    p.predictionSeverity === 'medium' && 'bg-electric',
                    p.predictionSeverity === 'low' && 'bg-emerald-accent'
                  )}
                  style={{
                    width: p.predictionSeverity === 'critical' ? '100%' : p.predictionSeverity === 'high' ? '75%' : p.predictionSeverity === 'medium' ? '50%' : '25%',
                  }}
                />
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs border-glass-border hover:border-electric/40">
                {p.recommendedAction.split('.')[0]}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {knowledgeGapData.predictions.length} modules analyzed.{' '}
          {knowledgeGapData.predictions.filter((x) => x.predictionSeverity === 'critical').length} critical predictions.{' '}
          {knowledgeGapData.predictions.filter((x) => x.predictionSeverity === 'high').length} high-risk predictions identified.
        </p>
      </motion.div>

      {/* 6 - AI Recommendations */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            icon={FileText}
            title="Generate Documentation"
            description="Auto-generate comprehensive documentation for the three highest-risk modules to reduce knowledge debt."
            variant="primary"
            onClick={() => setCurrentView('documentation')}
          />
          <ActionCard
            icon={FolderGit2}
            title="Create GitLab Issue"
            description="File a critical-priority GitLab issue tracking risk remediation with sub-tasks and deadlines."
            onClick={() => setCurrentView('gitlab-actions')}
          />
          <ActionCard
            icon={GraduationCap}
            title="Generate Learning Mission"
            description="Build a structured learning mission to cross-train team members on critical modules."
            onClick={() => setCurrentView('learning-missions')}
          />
          <ActionCard
            icon={MessageSquare}
            title="Transfer Knowledge"
            description="Initiate a knowledge interview session to extract and document tacit knowledge from key contributors."
            onClick={() => setCurrentView('knowledge-interview')}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}