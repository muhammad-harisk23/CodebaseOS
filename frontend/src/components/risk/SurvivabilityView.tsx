'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  FolderGit2,
  GraduationCap,
  Target,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { RadarChart } from '@/components/shared/charts/RadarChart';
import { TrendChart } from '@/components/shared/charts/TrendChart';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { ActionCard } from '@/components/shared/ActionCard';
import { useAppStore } from '@/store/app-store';
import { survivabilityData } from '@/mock/survivability';
import type { ScoreBreakdown, ViewId } from '@/types';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function scoreColor(score: number): string {
  if (score < 30) return 'text-danger-accent';
  if (score < 50) return 'text-amber-accent';
  if (score < 70) return 'text-electric';
  return 'text-emerald-accent';
}

function barColor(score: number): string {
  if (score < 30) return 'var(--danger-accent)';
  if (score < 50) return 'var(--amber-accent)';
  if (score < 70) return 'var(--electric)';
  return 'var(--emerald-accent)';
}

function severityColor(severity: 'critical' | 'high'): string {
  return severity === 'critical' ? 'border-l-danger-accent' : 'border-l-amber-accent';
}

function severityBadgeClass(severity: 'critical' | 'high'): string {
  return severity === 'critical'
    ? 'bg-danger-accent/15 text-danger-accent border-danger-accent/20'
    : 'bg-amber-accent/15 text-amber-accent border-amber-accent/20';
}

const actionIconMap: Record<string, LucideIcon> = {
  'generate-documentation': FileText,
  'create-knowledge-transfer-plan': Users,
  'generate-learning-missions': Target,
  'create-gitlab-issue': FolderGit2,
  'assign-ownership': UserCheck,
};

const breakdownDescriptions: Record<string, string> = {
  Documentation: 'Near-zero documentation across the repository',
  'Knowledge Distribution': 'Concentrated in 1 developer for critical modules',
  'Dependency Health': 'Dependencies are relatively healthy and up to date',
  Architecture: 'Moderate but lacking architectural clarity',
  'Bus Factor': 'Single point of failure for most modules',
  Ownership: 'Concentrated ownership with limited cross-module contributions',
};

export function SurvivabilityView() {
  const data = survivabilityData;
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const mappedBreakdown: ScoreBreakdown[] = data.breakdown.map((b) => ({
    ...b,
    description: breakdownDescriptions[b.category] ?? '',
  }));

  const radarData = data.breakdown.map((b) => ({
    category: b.category,
    value: b.score,
    fullMark: 100,
  }));

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* 1. Hero Card */}
      <motion.div
        variants={fadeUp}
        className="glass-card glow-danger rounded-xl border border-danger-accent/25 p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Survivability <span className="gradient-text">Score&#8482;</span>
            </h1>
            <p className="mt-2 text-sm italic text-muted-foreground max-w-2xl">
              {data.question}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-5xl font-bold tabular-nums text-danger-accent">
              {data.score}{' '}
              <span className="text-2xl font-normal text-muted-foreground">/ {data.max}</span>
            </span>
            <Badge
              variant="outline"
              className="bg-danger-accent/15 text-danger-accent border-danger-accent/25 text-xs font-semibold uppercase tracking-wider"
            >
              {data.status}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* 2. Inputs Grid */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Score Inputs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.inputs.map((input) => (
            <motion.div
              key={input.label}
              variants={fadeUp}
              className="glass-card rounded-xl border border-glass-border p-4"
            >
              <p className="text-xs text-muted-foreground mb-1">{input.label}</p>
              <p className={`text-lg font-bold tabular-nums ${scoreColor(input.score)}`}>
                {input.score}
                <span className="text-xs font-normal text-muted-foreground">/{input.max}</span>
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor(input.score) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(input.score / input.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Weight: {input.weight}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3. Visuals Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <ScoreCard
            score={data.score}
            max={data.max}
            label="Survivability Score\u2122"
            description="Overall survivability assessment"
            size="large"
            breakdown={mappedBreakdown}
          />
        </div>
        <div className="glass-card rounded-xl border border-glass-border p-4">
          <RadarChart data={radarData} height={260} />
        </div>
        <div className="glass-card rounded-xl border border-glass-border p-4">
          <TrendChart
            data={data.trend}
            color="var(--danger-accent)"
            height={260}
          />
        </div>
      </motion.div>

      {/* 4. Survivability Breakdown */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Survivability Breakdown</h2>
        <div className="glass-card rounded-xl border border-glass-border p-5 space-y-4">
          {data.breakdown.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{item.category}</span>
                <span className={`text-sm font-bold tabular-nums ${scoreColor(item.score)}`}>
                  {item.score}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-inset">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor(item.score) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / item.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {breakdownDescriptions[item.category] ?? ''}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. High Risk Factors */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">High Risk Factors</h2>
        <div className="space-y-3">
          {data.highRiskFactors.map((factor) => (
            <motion.div
              key={factor.title}
              variants={fadeUp}
              className={`glass-card rounded-xl border border-glass-border p-5 border-l-2 ${severityColor(factor.severity)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold uppercase tracking-wider ${severityBadgeClass(factor.severity)}`}
                >
                  {factor.severity}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground">{factor.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{factor.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 6. AI Recommendations */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.recommendations.map((rec) => {
            const Icon = actionIconMap[rec.action] ?? FileText;
            return (
              <ActionCard
                key={rec.action}
                icon={Icon}
                title={rec.title}
                description={rec.description}
                variant="default"
                onClick={() => {
                  if (rec.view) setCurrentView(rec.view as ViewId);
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}