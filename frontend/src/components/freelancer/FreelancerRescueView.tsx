'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileCode,
  GitBranch,
  Layers,
  ListChecks,
  Shield,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { useAppStore } from '@/store/app-store';
import { freelancerData } from '@/mock/freelancer';
import { recoverabilityData } from '@/mock/recoverability';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const importanceColor: Record<string, string> = {
  critical: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
  high: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  medium: 'bg-electric/15 text-electric border-electric/30',
};

const severityBorderColor: Record<string, string> = {
  critical: 'border-l-danger-accent',
  high: 'border-l-amber-accent',
  medium: 'border-l-electric',
};

const summaryItems = [
  { key: 'purpose', icon: BookOpen, label: 'Purpose' },
  { key: 'architecture', icon: Layers, label: 'Architecture' },
  { key: 'techStack', icon: Zap, label: 'Tech Stack' },
  { key: 'criticalModules', icon: Shield, label: 'Critical Modules' },
  { key: 'businessLogic', icon: ListChecks, label: 'Business Logic' },
  { key: 'authentication', icon: Shield, label: 'Authentication' },
  { key: 'database', icon: Layers, label: 'Database' },
  { key: 'payments', icon: Zap, label: 'Payments' },
  { key: 'integrations', icon: GitBranch, label: 'Integrations' },
] as const;

const dayGradients = [
  'from-electric to-electric/70',
  'from-electric to-cyan-500/70',
  'from-cyan-400/70 to-amber-accent/70',
  'from-amber-accent/70 to-emerald-accent/70',
  'from-emerald-accent to-emerald-accent/70',
];

const statusIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: Circle,
};

export function FreelancerRescueView() {
  const { setCurrentView } = useAppStore();
  const criticalCount = freelancerData.topFiles.filter((f) => f.importance === 'critical').length;
  const ktTotal = freelancerData.knowledgeTransfer.reduce((s, c) => s + c.items.length, 0);
  const ktCompleted = freelancerData.knowledgeTransfer.reduce(
    (s, c) => s + c.items.filter((i) => i.status === 'completed').length,
    0
  );
  const ktOverallPct = Math.round((ktCompleted / ktTotal) * 100);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* 1 - Problem Scenario Card */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-xl border border-danger-accent/40 glow-danger p-6"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-danger-accent">
          Scenario
        </span>
        <p className="mt-2 text-lg italic text-foreground leading-relaxed">
          &ldquo;{freelancerData.scenario.clientQuote}&rdquo;
        </p>
        <Separator className="my-4 bg-glass-border" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="text-danger-accent font-semibold">Problem:</span>{' '}
          {freelancerData.scenario.problem}
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Context:</span>{' '}
          {freelancerData.scenario.context}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs border-amber-accent/30 text-amber-accent">
            <Clock className="h-3 w-3 mr-1" />Deadline: {freelancerData.scenario.deadline}
          </Badge>
          <Badge variant="outline" className="text-xs border-electric/30 text-electric">
            {freelancerData.scenario.budget}
          </Badge>
        </div>
      </motion.div>

      {/* 2 - Project Intelligence Summary */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Project Intelligence Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            const value = freelancerData.projectSummary[item.key];
            const isList = Array.isArray(value);
            return (
              <div key={item.key} className="rounded-lg border border-glass-border bg-surface-inset/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-electric shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </div>
                {isList ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(value as string[]).slice(0, 5).map((v) => (
                      <Badge
                        key={v}
                        variant="outline"
                        className="text-[10px] border-glass-border text-muted-foreground"
                      >
                        {v.length > 28 ? v.slice(0, 28) + '...' : v}
                      </Badge>
                    ))}
                    {(value as string[]).length > 5 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{(value as string[]).length - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {value as string}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3 - Top Files to Read */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <ProgressRing value={criticalCount} max={freelancerData.topFiles.length} size={48} strokeWidth={4} />
          <div>
            <h2 className="text-base font-semibold text-foreground">Files Ranked by Importance</h2>
            <p className="text-xs text-muted-foreground">
              {criticalCount} critical files identified
            </p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-glass-border">
                {['#', 'File', 'Reason', 'Importance', 'Read Time'].map((h) => (
                  <th
                    key={h}
                    className="pb-2 pr-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {freelancerData.topFiles.map((file, idx) => (
                <tr
                  key={file.file}
                  className="border-b border-glass-border/50 last:border-0 hover:bg-surface-inset/30 transition-colors"
                >
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground tabular-nums w-8">{idx + 1}</td>
                  <td className="py-2.5 pr-3 text-xs font-mono text-foreground max-w-[220px] truncate">
                    {file.file}
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground max-w-[300px] truncate">
                    {file.reason}
                  </td>
                  <td className="py-2.5 pr-3 w-24">
                    <Badge variant="outline" className={cn('text-[10px] border', importanceColor[file.importance])}>
                      {file.importance}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground tabular-nums">{file.estimatedReadTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {freelancerData.topFiles.map((file, idx) => (
            <div
              key={file.file}
              className="rounded-lg border border-glass-border bg-surface-inset/50 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">#{idx + 1}</span>
                <Badge variant="outline" className={cn('text-[10px] border', importanceColor[file.importance])}>
                  {file.importance}
                </Badge>
              </div>
              <p className="text-xs font-mono text-foreground truncate">{file.file}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{file.reason}</p>
              <span className="text-[10px] text-muted-foreground tabular-nums">{file.estimatedReadTime}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4 - Danger Zones */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Danger Zones Identified</h2>
        <div className="space-y-4">
          {freelancerData.dangerZones.map((zone) => (
            <div
              key={zone.zone}
              className={cn(
                'rounded-lg border border-glass-border bg-surface-inset/50 p-4 border-l-2',
                severityBorderColor[zone.severity]
              )}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground">{zone.zone}</h3>
                <Badge
                  variant="outline"
                  className={cn('text-[10px] border', importanceColor[zone.severity])}
                >
                  {zone.severity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{zone.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {zone.affectedFiles.slice(0, 4).map((f) => (
                  <code
                    key={f}
                    className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-glass-border"
                  >
                    {f.split('/').pop()}
                  </code>
                ))}
                {zone.affectedFiles.length > 4 && (
                  <span className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{zone.affectedFiles.length - 4} more
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground">
                <span className="font-semibold">Recommendation:</span>{' '}
                <span className="text-muted-foreground">{zone.recommendation}</span>
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5 - Recoverability Assessment */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Recoverability Assessment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          <ScoreCard
            score={recoverabilityData.score}
            max={recoverabilityData.max}
            label="Recoverability Score\u2122"
            description="This codebase has significant recoverability challenges. High knowledge debt, low documentation, and critical ownership risks make a full rebuild the recommended path."
            size="large"
          />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recoverabilityData.assessment.slice(0, 3).map((a) => (
                <div
                  key={a.label}
                  className={cn(
                    'glass-card rounded-xl border p-4 text-center',
                    a.severity === 'critical'
                      ? 'border-danger-accent/30 bg-danger-accent/5'
                      : a.severity === 'high'
                        ? 'border-amber-accent/30 bg-amber-accent/5'
                        : 'border-glass-border'
                  )}
                >
                  <p
                    className={cn(
                      'text-lg font-bold tabular-nums',
                      a.severity === 'critical'
                        ? 'text-danger-accent'
                        : a.severity === 'high'
                          ? 'text-amber-accent'
                          : 'gradient-text'
                    )}
                  >
                    {a.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{a.label}</p>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-xl border border-glass-border p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-emerald-accent font-semibold">Recommendation:</span>{' '}
                Rebuild Authentication. Retain Payments. Retain Infrastructure.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6 - Onboarding Plan */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-6">5-Day Accelerated Onboarding Plan</h2>
        <div className="relative space-y-0">
          {freelancerData.onboardingPlan.map((day, idx) => {
            const isLast = idx === freelancerData.onboardingPlan.length - 1;
            return (
              <div key={day.day} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <div className="absolute left-[17px] top-10 bottom-0 w-px bg-glass-border" />
                )}
                <div
                  className={cn(
                    'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold bg-gradient-to-br text-background',
                    dayGradients[idx]
                  )}
                >
                  {day.day}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-semibold text-foreground">{day.title}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {day.tasks.map((task, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-electric/60" />
                        <span className="leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                  {day.milestones.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {day.milestones.map((m) => (
                        <Badge
                          key={m}
                          variant="outline"
                          className="text-[10px] border-electric/20 text-electric bg-electric/5"
                        >
                          {m}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 7 - Knowledge Transfer Plan */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <ProgressRing value={ktCompleted} max={ktTotal} size={44} strokeWidth={4} />
          <div>
            <h2 className="text-base font-semibold text-foreground">Knowledge Transfer Plan</h2>
            <p className="text-xs text-muted-foreground">{ktOverallPct}% overall completion</p>
          </div>
        </div>
        <div className="space-y-5">
          {freelancerData.knowledgeTransfer.map((cat) => {
            const completed = cat.items.filter((i) => i.status === 'completed').length;
            const pct = Math.round((completed / cat.items.length) * 100);
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {completed}/{cat.items.length} completed
                  </span>
                </div>
                <Progress
                  value={pct}
                  className="h-1.5 mb-3 [&>div]:bg-electric"
                />
                <ul className="space-y-1.5">
                  {cat.items.map((item, ii) => {
                    const StatusIcon = statusIcons[item.status] ?? Circle;
                    return (
                      <li key={ii} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <StatusIcon
                          className={cn(
                            'h-3.5 w-3.5 mt-0.5 shrink-0',
                            item.status === 'completed' && 'text-emerald-accent',
                            item.status === 'in-progress' && 'text-amber-accent',
                            item.status === 'pending' && 'text-muted-foreground'
                          )}
                        />
                        <span className="leading-relaxed">{item.task}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 8 - CTA */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-xl border border-electric/30 glow-blue p-8 text-center max-w-lg mx-auto"
      >
        <AlertTriangle className="h-8 w-8 text-electric mx-auto mb-3" />
        <h3 className="text-base font-semibold text-foreground mb-1">Ready to Start Your Rescue?</h3>
        <p className="text-xs text-muted-foreground mb-5 max-w-sm mx-auto">
          Upload your repository and let the agent analyze the current state, identify risks, and
          generate a tailored recovery plan.
        </p>
        <Button onClick={() => setCurrentView('repository-upload')} className="bg-electric text-electric-foreground hover:bg-electric/90">
          <FileCode className="h-4 w-4 mr-2" />
          Upload Repository
        </Button>
      </motion.div>
    </motion.div>
  );
}