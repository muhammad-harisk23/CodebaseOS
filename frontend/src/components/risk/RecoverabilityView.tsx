'use client';

import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  CheckSquare,
  FileText,
  FolderGit2,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { TrendChart } from '@/components/shared/charts/TrendChart';
import { RadarChart } from '@/components/shared/charts/RadarChart';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { ActionCard } from '@/components/shared/ActionCard';
import { useAppStore } from '@/store/app-store';
import { recoverabilityData } from '@/mock/recoverability';
import type { ViewId } from '@/types';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function inputBarColor(score: number): string {
  if (score > 70) return 'var(--emerald-accent)';
  if (score > 50) return 'var(--amber-accent)';
  if (score > 30) return 'var(--electric)';
  return 'var(--danger-accent)';
}

function severityBorder(severity: string): string {
  if (severity === 'critical') return 'border-l-danger-accent';
  if (severity === 'high') return 'border-l-amber-accent';
  if (severity === 'medium') return 'border-l-amber-accent';
  return 'border-l-emerald-accent';
}

function severityBadge(severity: string): string {
  if (severity === 'critical') return 'bg-danger-accent/15 text-danger-accent border-danger-accent/20';
  if (severity === 'high') return 'bg-amber-accent/15 text-amber-accent border-amber-accent/20';
  if (severity === 'medium') return 'bg-amber-accent/15 text-amber-accent border-amber-accent/20';
  return 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/20';
}

function severityTextColor(severity: string): string {
  if (severity === 'critical') return 'text-danger-accent';
  if (severity === 'high') return 'text-amber-accent';
  return 'text-foreground';
}

function assessmentScore(severity: string): number {
  if (severity === 'critical') return 20;
  if (severity === 'high') return 45;
  if (severity === 'medium') return 60;
  return 85;
}

const actionIconMap: Record<string, LucideIcon> = {
  'rebuild-auth-layer': Shield,
  'generate-migration-plan': ArrowRightLeft,
  'create-refactoring-tasks': CheckSquare,
  'create-gitlab-issues': FolderGit2,
};

const actionViewMap: Record<string, ViewId> = {
  'rebuild-auth-layer': 'architecture',
  'generate-migration-plan': 'documentation',
  'create-refactoring-tasks': 'agent-actions',
  'create-gitlab-issues': 'gitlab-actions',
};

function DecisionGauge({ score }: { score: number }) {
  const needleAngle = (score / 100) * 180 - 90;
  const decisionColor = score > 60 ? 'var(--emerald-accent)' : score > 40 ? 'var(--amber-accent)' : 'var(--danger-accent)';

  const labels = [
    { text: 'Rebuild', score: 20 },
    { text: 'High Cost', score: 40 },
    { text: 'Recoverable', score: 60 },
    { text: 'Healthy', score: 80 },
  ];

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-sm mx-auto" aria-label={`Recoverability gauge: ${score} out of 100`}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--danger-accent)" />
          <stop offset="50%" stopColor="var(--amber-accent)" />
          <stop offset="100%" stopColor="var(--emerald-accent)" />
        </linearGradient>
      </defs>

      {/* Background track */}
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        className="text-muted/20"
      />

      {/* Colored arc */}
      <motion.path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Needle */}
      <motion.g
        style={{ transformOrigin: '100px 100px' }}
        initial={{ rotate: -90 }}
        animate={{ rotate: needleAngle }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
      >
        <line x1="100" y1="100" x2="100" y2="28" stroke={decisionColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="100" r="5" fill={decisionColor} />
      </motion.g>

      {/* Tick labels */}
      {labels.map((lbl) => {
        const mathAngle = ((180 - (lbl.score / 100) * 180) * Math.PI) / 180;
        const r = 98;
        const x = 100 + r * Math.cos(mathAngle);
        const y = 100 - r * Math.sin(mathAngle);
        const textAnchor = lbl.score < 50 ? 'start' : lbl.score > 50 ? 'end' : 'middle';
        const dy = y < 30 ? 10 : y > 80 ? -4 : 0;
        return (
          <text
            key={lbl.text}
            x={x}
            y={y + dy}
            textAnchor={textAnchor}
            className="fill-muted-foreground"
            fontSize="9"
            fontWeight="500"
          >
            {lbl.text}
          </text>
        );
      })}

      {/* Center score */}
      <text x="100" y="108" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="700">
        {score}
      </text>
      <text x="100" y="118" textAnchor="middle" className="fill-muted-foreground" fontSize="9">
        / 100
      </text>
    </svg>
  );
}

export function RecoverabilityView() {
  const data = recoverabilityData;
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const radarData = data.inputs.map((inp) => ({
    category: inp.label,
    value: inp.score,
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
        className="glass-card glow-danger rounded-xl border border-amber-accent/25 p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Recoverability <span className="gradient-text">Score&#8482;</span>
            </h1>
            <p className="mt-2 text-sm italic text-muted-foreground max-w-2xl">
              This repository may be more cost-effective to rebuild than to refactor.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-5xl font-bold tabular-nums text-amber-accent">
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

      {/* 2. Decision Engine Visual */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-xl border border-glass-border p-6 md:p-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Recovery Assessment</h2>

        <DecisionGauge score={data.score} />

        <motion.p
          className="mt-4 text-center text-sm font-medium text-danger-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {data.decision}
        </motion.p>

        {/* Assessment Cards 2x2 */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {data.assessment.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="glass-card rounded-lg border border-glass-border p-4 flex items-center gap-3"
            >
              <ProgressRing
                value={assessmentScore(item.severity)}
                max={100}
                size={52}
                strokeWidth={4}
                color={inputBarColor(assessmentScore(item.severity))}
              />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground leading-tight">{item.label}</p>
                <p className={`text-base font-bold tabular-nums ${severityTextColor(item.severity)}`}>
                  {item.value}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-0.5 text-[9px] font-semibold uppercase tracking-wider ${severityBadge(item.severity)}`}
                >
                  {item.severity}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3. Score Breakdown */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recovery Inputs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl border border-glass-border p-4">
            <RadarChart data={radarData} height={320} />
          </div>
          <div className="glass-card rounded-xl border border-glass-border p-5 space-y-3">
            {data.inputs.map((inp) => (
              <div key={inp.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{inp.label}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: inputBarColor(inp.score) }}>
                    {inp.score}
                    <span className="text-[10px] font-normal text-muted-foreground">/{inp.max}</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-inset">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: inputBarColor(inp.score) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(inp.score / inp.max) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. Trend */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recoverability Trend</h2>
        <div className="glass-card rounded-xl border border-glass-border p-4">
          <TrendChart data={data.trend} color="var(--amber-accent)" height={220} />
        </div>
      </motion.div>

      {/* 5. Critical Issues */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Critical Issues</h2>
        <div className="space-y-3">
          {data.criticalIssues.map((issue) => (
            <motion.div
              key={issue.title}
              variants={fadeUp}
              className={`glass-card rounded-xl border border-glass-border p-5 border-l-2 ${severityBorder(issue.severity)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold uppercase tracking-wider ${severityBadge(issue.severity)}`}
                >
                  {issue.severity}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{issue.description}</p>
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
            const targetView = actionViewMap[rec.action];
            return (
              <ActionCard
                key={rec.action}
                icon={Icon}
                title={rec.title}
                description={rec.description}
                variant="default"
                onClick={targetView ? () => setCurrentView(targetView) : undefined}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}