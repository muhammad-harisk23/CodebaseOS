'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Brain,
  Activity,
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  FolderGit2,
  GraduationCap,
  MessageSquare,
  Target,
  Zap,
  ChevronRight,
  Play,
  ArrowRight,
  Cpu,
  Eye,
  Upload,
  FileCode,
  Share2,
  ShieldAlert,
  Users,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActionCard } from '@/components/shared/ActionCard';
import { useAppStore } from '@/store/app-store';
import { agentFeedItems } from '@/mock/agent-feed';
import { agentActions } from '@/mock/actions';
import { recommendationsData } from '@/mock/recommendations';
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

/* ─── Timeline Data ─── */
const timelineSteps = [
  { label: 'Repository Uploaded', status: 'completed' as const, Icon: Upload, time: '2h ago' },
  { label: 'Repository Parsed', status: 'completed' as const, Icon: FileCode, time: '1h 45m ago' },
  { label: 'Repository Memory Generated', status: 'completed' as const, Icon: Brain, time: '1h 30m ago' },
  { label: 'Knowledge Graph Created', status: 'completed' as const, Icon: Share2, time: '1h 15m ago' },
  { label: 'Risk Analysis Completed', status: 'completed' as const, Icon: ShieldAlert, time: '1h ago' },
  { label: 'Documentation Gap Found', status: 'completed' as const, Icon: AlertTriangle, time: '45m ago' },
  { label: 'Ownership Risk Found', status: 'completed' as const, Icon: Users, time: '30m ago' },
  { label: 'GitLab Issue Generated', status: 'completed' as const, Icon: FolderGit2, time: '15m ago' },
  { label: 'Learning Mission Generated', status: 'completed' as const, Icon: GraduationCap, time: '10m ago' },
  { label: 'Knowledge Transfer Plan Generated', status: 'completed' as const, Icon: MessageSquare, time: '5m ago' },
];

/* ─── Feed helpers ─── */
const feedTypeIcon: Record<string, typeof Eye> = {
  detection: Eye,
  reasoning: Brain,
  action: Zap,
  risk: AlertTriangle,
  insight: Lightbulb,
};

const riskBorderColor: Record<string, string> = {
  critical: 'border-l-danger-accent',
  high: 'border-l-amber-accent',
  medium: 'border-l-electric',
  low: 'border-l-emerald-accent',
  info: 'border-l-muted-foreground',
};

const riskBadgeClass: Record<string, string> = {
  critical: 'bg-danger-accent/15 text-danger-accent',
  high: 'bg-amber-accent/15 text-amber-accent',
  medium: 'bg-electric/15 text-electric',
  low: 'bg-emerald-accent/15 text-emerald-accent',
  info: 'bg-muted/20 text-muted-foreground',
};

/* ─── Priority badge ─── */
const priorityBadge: Record<string, string> = {
  high: 'bg-danger-accent/15 text-danger-accent',
  medium: 'bg-amber-accent/15 text-amber-accent',
  low: 'bg-emerald-accent/15 text-emerald-accent',
};

/* ─── Status indicators ─── */
const statusItems = [
  { label: 'Agent Status', value: 'Active', Icon: Bot, color: 'text-amber-accent' },
  { label: 'Repository Memory', value: 'Connected', Icon: Brain, color: 'text-emerald-accent' },
  { label: 'Knowledge Graph', value: 'Generated', Icon: Share2, color: 'text-emerald-accent' },
  { label: 'Repository Health', value: 'Analyzed', Icon: Shield, color: 'text-emerald-accent' },
  { label: 'Risk Assessment', value: 'Completed', Icon: CheckCircle2, color: 'text-emerald-accent' },
  { label: 'GitLab Integration', value: 'Ready', Icon: FolderGit2, color: 'text-amber-accent' },
];

/* ─── Reasoning examples ─── */
const reasoningExamples = [
  agentFeedItems.find((f) => f.id === 'af-5'),
  agentFeedItems.find((f) => f.id === 'af-11'),
  agentFeedItems.find((f) => f.id === 'af-15'),
];

/* ─── Execution buttons ─── */
const executionActions: { title: string; desc: string; Icon: typeof FileText; view: ViewId; variant: 'primary' | 'default' }[] = [
  { title: 'Generate Documentation', desc: 'Generate comprehensive documentation for modules with low coverage.', Icon: FileText, view: 'documentation', variant: 'primary' },
  { title: 'Generate Learning Mission', desc: 'Create structured learning missions for knowledge gaps.', Icon: GraduationCap, view: 'learning-missions', variant: 'default' },
  { title: 'Create GitLab Issue', desc: 'Publish findings as actionable GitLab issues with acceptance criteria.', Icon: FolderGit2, view: 'gitlab-actions', variant: 'default' },
  { title: 'Create Onboarding Tasks', desc: 'Generate day-by-day onboarding tasks with verification checkpoints.', Icon: Target, view: 'risk-center', variant: 'default' },
  { title: 'Create Knowledge Transfer Plan', desc: 'Build a transfer plan to redistribute concentrated knowledge.', Icon: MessageSquare, view: 'knowledge-interview', variant: 'default' },
  { title: 'Generate Recovery Report', desc: 'Assess codebase recoverability and generate refactoring roadmap.', Icon: Activity, view: 'recoverability', variant: 'default' },
  { title: 'Generate Architecture Report', desc: 'Produce a full architecture analysis with dependency graph.', Icon: Cpu, view: 'architecture', variant: 'default' },
  { title: 'Generate Survivability Report', desc: 'Evaluate organizational survivability and key-person risk.', Icon: Shield, view: 'survivability', variant: 'default' },
];

/* ─── Format relative time ─── */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

/* ════════════════════════════════════════════════════════════════════ */
export function AgentActionsView() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

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
            <Bot className="h-5 w-5 text-electric" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Agent <span className="gradient-text">Action Center</span>
            <span className="gradient-text">&trade;</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">AI-powered repository operations and recommendations.</p>
        <p className="mt-2 text-xs text-muted-foreground max-w-3xl leading-relaxed">
          The agent analyzes, reasons, and takes action — transforming repository intelligence into organizational knowledge.
        </p>
      </motion.section>

      {/* ── 2. Agent Status ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-electric" /> Agent Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusItems.map((item) => (
            <div
              key={item.label}
              className="glass-card rounded-xl border border-glass-border p-3 flex flex-col items-center gap-2 text-center"
            >
              <item.Icon className={cn('h-4 w-4', item.color)} />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={cn(
                    'inline-block h-2 w-2 rounded-full',
                    item.color === 'text-amber-accent' ? 'bg-amber-accent animate-pulse' : 'bg-emerald-accent'
                  )}
                />
                <span className={item.color}>{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── 3. Execution Pipeline Timeline ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5 md:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Zap className="h-4 w-4 text-electric" /> Agent Execution Pipeline
        </h2>
        <div className="relative space-y-0">
          {timelineSteps.map((step, i) => (
            <motion.div key={step.label} variants={fadeUp} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="absolute left-[17px] top-9 bottom-0 w-px bg-glass-border" />
              <div
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                  step.status === 'completed'
                    ? 'border-emerald-accent/40 bg-emerald-accent/10'
                    : 'border-electric/40 bg-electric/10'
                )}
              >
                <step.Icon className="h-4 w-4 text-emerald-accent" />
              </div>
              <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground mr-2">Step {i + 1}</span>
                  <span className="text-xs font-semibold text-foreground">{step.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-emerald-accent" />
                  <span className="text-[10px] text-muted-foreground">{step.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── 4. Agent Activity Feed ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border p-5 md:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="h-4 w-4 text-electric" /> Agent Activity Feed
        </h2>
        <div className="max-h-[400px] overflow-auto scrollbar-thin space-y-2">
          {agentFeedItems.map((item) => {
            const FeedIcon = feedTypeIcon[item.type] ?? Eye;
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className={cn(
                  'glass-card-hover rounded-xl border border-glass-border border-l-2 p-4 transition-all duration-300',
                  riskBorderColor[item.riskLevel]
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-inset">
                    <FeedIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{item.reasoning}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[10px] bg-surface-inset text-muted-foreground">
                        {item.module}
                      </Badge>
                      <Badge variant="outline" className={cn('text-[10px]', riskBadgeClass[item.riskLevel])}>
                        Confidence: {Math.round(item.confidence * 100)}%
                      </Badge>
                      <Badge variant="outline" className={cn('text-[10px]', riskBadgeClass[item.riskLevel])}>
                        {item.riskLevel}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{timeAgo(item.timestamp)}</span>
                    </div>
                    {item.action && item.actionView && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-7 text-[10px]"
                        onClick={() => setCurrentView(item.actionView as ViewId)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Execute
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── 5. Agent Reasoning Panel ── */}
      <motion.section variants={fadeUp} className="glass-card rounded-2xl border border-glass-border border-l-purple-glow p-5 md:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-glow" /> Why Did the Agent Act?
        </h2>
        <div className="space-y-4">
          {reasoningExamples.map(
            (item) =>
              item && (
                <div key={item.id} className="rounded-xl border border-glass-border bg-surface-inset p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-glow">Decision</span>
                    <p className="text-xs font-semibold text-foreground mt-1">{item.title}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.reasoning}</p>
                  <Separator className="bg-glass-border" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Resulting Action</span>
                        <p className="text-xs text-foreground">{item.action ?? 'Analysis complete'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-emerald-accent/10 text-emerald-accent">
                        Confidence: {Math.round(item.confidence * 100)}%
                      </Badge>
                      {item.actionView && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px]"
                          onClick={() => setCurrentView(item.actionView as ViewId)}
                        >
                          View <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </motion.section>

      {/* ── 6. Priority Recommendations ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-electric" /> Priority Recommendations
        </h2>
        <Tabs defaultValue="high">
          <TabsList className="bg-glass border border-glass-border">
            <TabsTrigger value="high" className="text-xs">
              High ({recommendationsData.high.length})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-xs">
              Medium ({recommendationsData.medium.length})
            </TabsTrigger>
            <TabsTrigger value="low" className="text-xs">
              Low ({recommendationsData.low.length})
            </TabsTrigger>
          </TabsList>

          {(['high', 'medium', 'low'] as const).map((priority) => (
            <TabsContent key={priority} value={priority} className="mt-4">
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendationsData[priority].map((rec) => (
                  <motion.div
                    key={rec.id}
                    variants={fadeUp}
                    className="glass-card rounded-xl border border-glass-border p-5 flex flex-col gap-3 transition-all duration-300 hover:glow-blue"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-foreground">{rec.title}</h3>
                      <Badge variant="outline" className={cn('text-[10px] shrink-0', priorityBadge[rec.priority])}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.affectedModules.map((m) => (
                        <Badge key={m} variant="outline" className="text-[10px] bg-surface-inset text-muted-foreground">
                          {m}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Effort: {rec.estimatedEffort}</span>
                      <Separator orientation="vertical" className="h-3 bg-glass-border" />
                      <span>{rec.impact}</span>
                    </div>
                    <ActionCard
                      icon={ArrowRight}
                      title={rec.action}
                      description=""
                      onClick={() => setCurrentView(rec.actionView as ViewId)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.section>

      {/* ── 7. Action Execution Panel ── */}
      <motion.section variants={fadeUp}>
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Play className="h-4 w-4 text-electric" /> Execute Agent Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {executionActions.map((act) => (
            <ActionCard
              key={act.view}
              icon={act.Icon}
              title={act.title}
              description={act.desc}
              variant={act.variant}
              onClick={() => setCurrentView(act.view)}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
