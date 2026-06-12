'use client';

import { motion } from 'framer-motion';
import {
  FileText, GraduationCap, MessageSquare, FolderGit2, Users, Shield,
  ArrowRightLeft, ClipboardList,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ActionCard } from '@/components/shared/ActionCard';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { busFactorData } from '@/mock/bus-factor';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const riskBadge: Record<string, string> = {
  critical: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
  high: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  medium: 'bg-electric/15 text-electric border-electric/30',
  low: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
};

const riskBarColor: Record<string, string> = {
  critical: 'bg-danger-accent',
  high: 'bg-amber-accent',
  medium: 'bg-electric',
  low: 'bg-emerald-accent',
};

function ownershipBarColor(pct: number) {
  if (pct > 80) return 'bg-danger-accent';
  if (pct > 60) return 'bg-amber-accent';
  return 'bg-electric';
}

const contributorColors = ['bg-danger-accent', 'bg-amber-accent', 'bg-electric'];

const recommendationMap: Record<string, { icon: typeof FileText; view: string; variant: 'default' | 'primary' | 'danger' }> = {
  'generate-documentation': { icon: FileText, view: 'documentation', variant: 'primary' },
  'create-learning-mission': { icon: GraduationCap, view: 'learning-missions', variant: 'default' },
  'transfer-ownership': { icon: ArrowRightLeft, view: 'ownership', variant: 'danger' },
  'generate-knowledge-transfer-plan': { icon: ClipboardList, view: 'knowledge-interview', variant: 'default' },
  'create-gitlab-issue': { icon: FolderGit2, view: 'gitlab-actions', variant: 'default' },
};

export function BusFactorView() {
  const { setCurrentView } = useAppStore();
  const maxModules = Math.max(...busFactorData.contributorNetwork.map((c) => c.modules));

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* 1 - Hero Section */}
      <motion.div variants={fadeUp} className="flex flex-col items-center text-center py-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bus Factor<span className="text-muted-foreground text-lg ml-1.5">&trade;</span>
        </h1>
        <div className="relative mt-6 mb-4">
          <motion.div
            className="absolute inset-0 rounded-full bg-danger-accent/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ margin: '-16px' }}
          />
          <span className="relative text-7xl font-black text-danger-accent tabular-nums">
            {busFactorData.score}
          </span>
        </div>
        <Badge variant="outline" className="border-danger-accent/30 bg-danger-accent/10 text-danger-accent text-xs">
          Critical Risk
        </Badge>
        <p className="mt-2 text-sm text-muted-foreground">
          out of {busFactorData.totalContributors} contributors
        </p>
        <p className="mt-4 max-w-md text-sm italic text-muted-foreground leading-relaxed">
          {busFactorData.question}
        </p>
      </motion.div>

      {/* 2 - Contributor Network */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Contributor Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {busFactorData.contributorNetwork.map((c, i) => {
            const riskLevel = c.modules >= 5 ? 'critical' : c.modules >= 3 ? 'high' : 'medium';
            return (
              <div key={c.id} className="glass-card rounded-xl border border-glass-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <Badge variant="outline" className={cn('text-[10px] border', riskBadge[riskLevel])}>
                    {riskLevel}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-[10px] bg-surface-inset border-glass-border text-muted-foreground w-fit">
                  {c.role}
                </Badge>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground tabular-nums">{c.modules}</p>
                    <p className="text-[10px] text-muted-foreground">Modules</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground tabular-nums">{c.commits}</p>
                    <p className="text-[10px] text-muted-foreground">Commits</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{new Date(c.lastActive).toLocaleDateString()}</p>
                    <p className="text-[10px] text-muted-foreground">Last Active</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">Module Coverage</span>
                    <span className="text-[10px] font-medium text-foreground">{c.modules}/{maxModules}</span>
                  </div>
                  <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', riskBarColor[riskLevel])}
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.modules / maxModules) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3 - Module Ownership */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Module Ownership</h2>
        <div className="space-y-3">
          {busFactorData.moduleOwnership.map((mod) => (
            <div key={mod.module} className="glass-card rounded-xl border border-glass-border p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{mod.module}</h3>
                  <Badge variant="outline" className={cn('text-[10px] border', riskBadge[mod.risk])}>
                    {mod.risk}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{mod.files} files</span>
                </div>
              </div>
              {/* Ownership bar */}
              <div className="h-8 rounded-lg overflow-hidden flex">
                <motion.div
                  className={cn('h-full flex items-center justify-start pl-3', ownershipBarColor(mod.primaryPercent))}
                  initial={{ width: 0 }}
                  animate={{ width: `${mod.primaryPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {mod.primaryPercent >= 25 && (
                    <span className="text-[10px] font-semibold text-white truncate">
                      {mod.primaryOwner} {mod.primaryPercent}%
                    </span>
                  )}
                </motion.div>
                <motion.div
                  className="h-full bg-muted/40 flex items-center justify-start pl-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${mod.backupPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                >
                  {mod.backupPercent >= 15 && (
                    <span className="text-[10px] font-medium text-muted-foreground truncate">
                      {mod.backupOwner} {mod.backupPercent}%
                    </span>
                  )}
                </motion.div>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-sm', ownershipBarColor(mod.primaryPercent))} />
                  {mod.primaryOwner}: {mod.primaryPercent}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-muted/40" />
                  {mod.backupOwner}: {mod.backupPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4 - Impact Analysis */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-danger-accent/40 glow-danger p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Impact Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">What happens if key contributors leave?</p>
        </div>
        {busFactorData.impactAnalysis.map((entry) => (
          <div key={entry.contributor} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{entry.contributor}</h3>
            <div className="space-y-2 pl-2 border-l-2 border-glass-border">
              {entry.risks.map((r) => (
                <div key={r.module} className="bg-surface-inset rounded-lg p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{r.module}</span>
                    <Badge variant="outline" className={cn('text-[10px] border', riskBadge[r.severity])}>
                      {r.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.risk}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* 5 - Knowledge Concentration Chart */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Knowledge Concentration</h2>
        <div className="space-y-3">
          {busFactorData.moduleOwnership.map((mod) => {
            const isDangerous = mod.primaryPercent > 80;
            return (
              <div key={mod.module} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{mod.module}</span>
                  {isDangerous && (
                    <Badge variant="outline" className="text-[9px] border-danger-accent/30 bg-danger-accent/10 text-danger-accent">
                      Siloed
                    </Badge>
                  )}
                </div>
                <div className="flex h-6 rounded-md overflow-hidden">
                  <motion.div
                    className={cn('h-full', contributorColors[0])}
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.primaryPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  <motion.div
                    className={cn('h-full', contributorColors[1])}
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.backupPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', contributorColors[0])} />
                    {mod.primaryOwner}: {mod.primaryPercent}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', contributorColors[1])} />
                    {mod.backupOwner}: {mod.backupPercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 6 - Recommendations */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {busFactorData.recommendations.map((rec) => {
            const mapped = recommendationMap[rec.action] ?? { icon: Shield, view: 'risk-center', variant: 'default' as const };
            return (
              <ActionCard
                key={rec.action}
                icon={mapped.icon}
                title={rec.title}
                description={rec.description}
                variant={mapped.variant}
                onClick={() => setCurrentView(mapped.view as 'dashboard')}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}