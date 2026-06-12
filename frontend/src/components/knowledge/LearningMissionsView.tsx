'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  CheckCircle2,
  PlayCircle,
  Circle,
  FolderGit2,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { missions } from '@/mock/missions';
import { useAppStore } from '@/store/app-store';
import type { Mission } from '@/types';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  5th mission added locally                                        */
/* ------------------------------------------------------------------ */
const mission5: Mission = {
  id: 'mission-5',
  title: 'Improve Documentation',
  description:
    'Create comprehensive documentation for the authentication module including API references, sequence diagrams, and troubleshooting guides. This mission focuses on the highest-debt area of the codebase.',
  difficulty: 'intermediate',
  estimatedTime: '4 hours',
  modules: ['Authentication'],
  status: 'not-started',
  progress: 0,
  prerequisites: ['Understand Authentication Flow'],
};

const allMissions: Mission[] = [...missions, mission5];

/* ------------------------------------------------------------------ */
/*  Difficulty & status config                                         */
/* ------------------------------------------------------------------ */
const difficultyConfig: Record<Mission['difficulty'], { className: string }> = {
  beginner: { className: 'bg-emerald-accent/15 text-emerald-accent' },
  intermediate: { className: 'bg-electric/15 text-electric' },
  advanced: { className: 'bg-amber-accent/15 text-amber-accent' },
  expert: { className: 'bg-danger-accent/15 text-danger-accent' },
};

const learningObjectives: Record<string, string> = {
  'mission-1':
    'Master the complete JWT authentication lifecycle including token generation, validation, refresh, and revocation.',
  'mission-2':
    'Understand the Stripe payment flow including intent creation, webhook handling, and refund processing.',
  'mission-3':
    'Comprehend the Airflow DAG architecture, data quality patterns, and backfill procedures.',
  'mission-4':
    'Map the complete frontend component hierarchy, state management patterns, and routing structure.',
  'mission-5':
    'Produce production-ready documentation that enables any developer to onboard within 1 day instead of 3 weeks.',
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function LearningMissionsView() {
  const { setCurrentView } = useAppStore();

  /* ---- summary stats ---- */
  const stats = useMemo(() => {
    const completed = allMissions.filter((m) => m.status === 'completed').length;
    const inProgress = allMissions.filter((m) => m.status === 'in-progress').length;
    const uniqueModules = new Set(allMissions.flatMap((m) => m.modules));
    return {
      completed,
      inProgress,
      totalHours: '16 hours',
      knowledgeAreas: uniqueModules.size,
    };
  }, []);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ---- Hero ---- */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Learning Missions&trade;</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Structured learning paths generated based on your codebase&apos;s knowledge gaps. Each mission
          targets a specific high-risk area and guides you from fundamentals to edge cases.
        </p>
      </motion.div>

      {/* ---- Mission Progress Summary ---- */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-accent/15">
            <CheckCircle2 className="h-5 w-5 text-emerald-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.completed}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15">
            <PlayCircle className="h-5 w-5 text-electric" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.inProgress}</p>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-accent/15">
            <Clock className="h-5 w-5 text-amber-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.totalHours}</p>
            <p className="text-[10px] text-muted-foreground">Estimated Time</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-glow/15">
            <Zap className="h-5 w-5 text-purple-glow" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.knowledgeAreas}</p>
            <p className="text-[10px] text-muted-foreground">Knowledge Areas</p>
          </div>
        </div>
      </motion.div>

      {/* ---- Missions Grid ---- */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allMissions.map((mission) => {
          const diff = difficultyConfig[mission.difficulty];
          const objective = learningObjectives[mission.id];

          const StatusIcon =
            mission.status === 'completed'
              ? CheckCircle2
              : mission.status === 'in-progress'
                ? PlayCircle
                : Circle;

          const statusColor =
            mission.status === 'completed'
              ? 'text-emerald-accent'
              : mission.status === 'in-progress'
                ? 'text-electric'
                : 'text-muted-foreground';

          const pulseClass =
            mission.status === 'in-progress' ? 'animate-pulse' : '';

          return (
            <motion.div
              key={mission.id}
              variants={fadeUp}
              className="glass-card glass-card-hover rounded-xl border border-glass-border p-5 transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusIcon className={cn('h-5 w-5 shrink-0', statusColor, pulseClass)} />
                  <h3 className="text-sm font-semibold text-foreground truncate">{mission.title}</h3>
                </div>
                <Badge variant="outline" className={cn('text-[10px] shrink-0', diff.className)}>
                  {mission.difficulty}
                </Badge>
              </div>

              {/* Description (full, not truncated) */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{mission.description}</p>

              {/* Learning Objective */}
              {objective && (
                <div className="mb-4 rounded-lg border border-glass-border bg-surface-inset p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Learning Objective
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{objective}</p>
                </div>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap gap-3 mb-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{mission.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>{mission.progress}% complete</span>
                </div>
              </div>

              {/* Progress bar */}
              <Progress
                value={mission.progress}
                className={cn(
                  'h-1.5 mb-4',
                  mission.progress === 100
                    ? '[&>div]:bg-emerald-accent'
                    : '[&>div]:bg-electric',
                )}
              />

              {/* Module badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {mission.modules.map((mod) => (
                  <span
                    key={mod}
                    className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {mod}
                  </span>
                ))}
              </div>

              {/* Prerequisites */}
              {mission.prerequisites.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-muted-foreground mb-1.5">Prerequisites</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-surface-inset px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer to push buttons to bottom */}
              <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-glass-border text-[10px]"
                  onClick={() => setCurrentView('gitlab-actions')}
                >
                  <FolderGit2 className="h-3 w-3 mr-1" />
                  Create GitLab Issue
                </Button>

                {mission.status !== 'completed' && (
                  <Button size="sm" className="text-xs">
                    {mission.status === 'in-progress' ? 'Continue' : 'Start Mission'}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
