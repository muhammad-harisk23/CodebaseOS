'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  FileText,
  GraduationCap,
  Target,
  AlertTriangle,
  Activity,
  Users,
  RefreshCcw,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  GitFork,
  UsersRound,
  CircleDot,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActionCard } from '@/components/shared/ActionCard';
import { useAppStore } from '@/store/app-store';
import { gitlabIssues } from '@/mock/gitlab';
import { activityFeedData } from '@/mock/activity-feed';
import { repositories } from '@/mock/repositories';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';

/* ─── Animation ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ─── GitLab action types ─── */
const gitlabActionTypes: {
  title: string;
  desc: string;
  Icon: typeof FileText;
  type: string;
}[] = [
  {
    title: 'Create Documentation Issue',
    desc: 'Automatically generates comprehensive documentation issues for modules with less than 30% documentation coverage.',
    Icon: FileText,
    type: 'documentation',
  },
  {
    title: 'Create Learning Mission Issue',
    desc: 'Creates structured learning missions in GitLab with acceptance criteria for each knowledge gap.',
    Icon: GraduationCap,
    type: 'learning',
  },
  {
    title: 'Create Onboarding Issue',
    desc: 'Generates day-by-day onboarding issues with tasks, milestones, and verification checkpoints.',
    Icon: Target,
    type: 'onboarding',
  },
  {
    title: 'Create Knowledge Gap Issue',
    desc: 'Documents detected knowledge concentration risks and creates remediation issues.',
    Icon: AlertTriangle,
    type: 'knowledge-gap',
  },
  {
    title: 'Create Health Finding Issue',
    desc: 'Publishes repository health findings including dependency, security, and architecture assessments.',
    Icon: Activity,
    type: 'health',
  },
  {
    title: 'Create Ownership Risk Issue',
    desc: 'Raises ownership concentration risks with specific module-owner assignments and backup owner suggestions.',
    Icon: Users,
    type: 'ownership-risk',
  },
  {
    title: 'Create Recoverability Issue',
    desc: 'Generates a recoverability assessment issue with refactor vs rebuild recommendation and cost estimates.',
    Icon: RefreshCcw,
    type: 'recoverability',
  },
];

/* ─── Activity feed helpers ─── */
const activityTypeIcon: Record<string, typeof FileText> = {
  issue_created: AlertTriangle,
  task_created: Target,
  documentation_generated: FileText,
  recommendation: Activity,
  knowledge_captured: GraduationCap,
  mission_generated: GraduationCap,
  transfer_plan: FolderGit2,
};

const activityTypeColor: Record<string, string> = {
  issue_created: 'border-l-amber-accent',
  task_created: 'border-l-electric',
  documentation_generated: 'border-l-emerald-accent',
  recommendation: 'border-l-purple-glow',
  knowledge_captured: 'border-l-electric',
  mission_generated: 'border-l-emerald-accent',
  transfer_plan: 'border-l-purple-glow',
};

/* ─── GitLab issue type / priority helpers ─── */
const issueTypeBadge: Record<string, string> = {
  documentation: 'bg-electric/15 text-electric',
  refactor: 'bg-purple-glow/15 text-purple-glow',
  'risk-mitigation': 'bg-danger-accent/15 text-danger-accent',
  'knowledge-transfer': 'bg-emerald-accent/15 text-emerald-accent',
};

const issuePriorityClass: Record<string, string> = {
  critical: 'text-danger-accent',
  high: 'text-amber-accent',
  medium: 'text-electric',
  low: 'text-muted-foreground',
};

/* ─── Relative time ─── */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

/* ─── Repository stats from first repo ─── */
const repo = repositories[0];

/* ════════════════════════════════════════════════════════════════════ */
export function GitLabActionsView() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const [createdIssue, setCreatedIssue] = useState<string | null>(null);

  /* Issue preview — first issue */
  const preview = gitlabIssues[0];
  const descLines = preview.description
    .replace(/##\s*\w+|-\s*\[.\]/g, '')
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, 3)
    .join(' ');

  const handleCreate = (title: string) => {
    setCreatedIssue(title);
    setTimeout(() => setCreatedIssue(null), 2500);
  };

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── 1. Hero ── */}
      <motion.section variants={fadeUp} className="glass-card glow-blue rounded-2xl border border-glass-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/15">
            <FolderGit2 className="h-5 w-5 text-electric" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            GitLab Agent <span className="gradient-text">Actions</span>
            <span className="gradient-text">&trade;</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">Turn repository intelligence into action.</p>
      </motion.section>

      {/* ── 2. Connected Repository Card ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <GitFork className="h-4 w-4 text-electric" /> Connected Repository
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Repository', value: repo.fullName, Icon: FolderGit2 },
            { label: 'Branch', value: 'main', Icon: GitFork },
            { label: 'Issues', value: `${gitlabIssues.length} open`, Icon: CircleDot },
            { label: 'MRs', value: '12 open', Icon: ArrowRight },
            { label: 'Contributors', value: `${repo.contributors} active`, Icon: UsersRound },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl border border-glass-border p-3 flex flex-col items-center gap-2 text-center">
              <stat.Icon className="h-4 w-4 text-electric" />
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <span className="text-xs font-medium text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── 3. GitLab Action Cards ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-electric" /> Create Agent Action
        </h2>
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gitlabActionTypes.map((act) => {
            const created = createdIssue === act.title;
            return (
              <motion.div
                key={act.type}
                variants={fadeUp}
                className="glass-card glass-card-hover rounded-xl border border-glass-border p-5 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-inset">
                    <act.Icon className="h-4 w-4 text-electric" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-foreground">{act.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{act.desc}</p>
                  </div>
                </div>
                <Button
                  variant={created ? 'outline' : 'default'}
                  size="sm"
                  className="h-8 w-full text-xs"
                  onClick={() => handleCreate(act.title)}
                >
                  {created ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1.5 text-emerald-accent" />
                      Issue Created
                    </>
                  ) : (
                    <>
                      Create Issue
                      <ArrowRight className="h-3 w-3 ml-1.5" />
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── 4. GitLab Activity Feed ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5 md:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-electric" /> Recent GitLab Activity
        </h2>
        <div className="max-h-[350px] overflow-auto scrollbar-thin space-y-2">
          {activityFeedData.items.map((item) => {
            const Icon = activityTypeIcon[item.type] ?? Activity;
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className={cn(
                  'rounded-xl border border-glass-border border-l-2 p-4 bg-surface-inset transition-all duration-200',
                  activityTypeColor[item.type]
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-glass">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[10px] bg-surface-inset text-muted-foreground">
                        {item.type.replace(/_/g, ' ')}
                      </Badge>
                      {Object.entries(item.metadata).map(([k, v]) => (
                        <Badge key={k} variant="outline" className="text-[10px] bg-glass text-muted-foreground">
                          {k}: {v}
                        </Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{timeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── 5. Issue Preview Panel ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5 md:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-electric" /> Issue Preview
        </h2>
        <div className="rounded-xl border border-glass-border bg-surface-inset p-5 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{preview.title}</h3>
            <a
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-electric hover:underline mt-0.5 inline-flex items-center gap-1"
            >
              {preview.url.split('/').pop()} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={cn('text-[10px]', issuePriorityClass[preview.priority], 'border-current/20')}>
              {preview.priority}
            </Badge>
            <Badge variant="outline" className={cn('text-[10px]', issueTypeBadge[preview.type])}>
              {preview.type}
            </Badge>
            {preview.assignee && (
              <Badge variant="outline" className="text-[10px] bg-surface-inset text-muted-foreground">
                {preview.assignee}
              </Badge>
            )}
          </div>

          {/* Labels */}
          <div className="flex flex-wrap gap-1">
            {preview.labels.map((label) => (
              <span key={label} className="rounded-full bg-glass px-2 py-0.5 text-[10px] text-muted-foreground border border-glass-border">
                {label}
              </span>
            ))}
          </div>

          <Separator className="bg-glass-border" />

          {/* Description preview */}
          <p className="text-xs text-muted-foreground leading-relaxed">{descLines}</p>

          <Separator className="bg-glass-border" />

          {/* Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-glass-border bg-glass p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimated Effort</span>
              <p className="text-xs font-semibold text-foreground mt-1">2-3 days</p>
            </div>
            <div className="rounded-lg border border-glass-border bg-glass p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Actions</span>
              <p className="text-xs font-semibold text-foreground mt-1">6 acceptance criteria</p>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => setCurrentView('gitlab-actions')}
          >
            <FolderGit2 className="h-3 w-3 mr-1.5" />
            Create Similar Issue
            <ArrowRight className="h-3 w-3 ml-1.5" />
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}
