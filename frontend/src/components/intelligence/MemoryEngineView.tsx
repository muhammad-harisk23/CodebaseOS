'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  FileCode,
  Boxes,
  Server,
  Globe,
  Database,
  Brain,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Circle,
  CheckCircle2 as CheckIcon,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { ScoreCard } from '@/components/shared/ScoreCard';
import {
  memoryStatistics,
  memoryPipelineStages,
  contextLossMetrics,
  knowledgeChunks,
  memoryInsights,
} from '@/mock/memory-pipeline';
import { contextEngineData } from '@/mock/context-engine';
import { knowledgeTransferData } from '@/mock/knowledge-transfer';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const iconMap: Record<string, typeof FileCode> = {
  FileText: FileCode,
  FolderTree: Boxes,
  Server: Server,
  Plug: Globe,
  Database: Database,
  Puzzle: Brain,
  Brain: Brain,
  ShieldCheck: ShieldCheck,
};

function getCoverageColor(pct: number) {
  if (pct > 80) return 'oklch(0.7 0.18 160)';
  if (pct > 60) return 'oklch(0.8 0.16 80)';
  return 'oklch(0.65 0.22 25)';
}

function getCoverageClass(pct: number) {
  if (pct > 80) return 'text-emerald-accent';
  if (pct > 60) return 'text-amber-accent';
  return 'text-danger-accent';
}

function getInsightConfig(type: 'success' | 'warning' | 'info') {
  const map = {
    success: { icon: CheckCircle2, color: 'border-emerald-accent/50', iconColor: 'text-emerald-accent' },
    warning: { icon: AlertTriangle, color: 'border-amber-accent/50', iconColor: 'text-amber-accent' },
    info: { icon: Info, color: 'border-electric/50', iconColor: 'text-electric' },
  };
  return map[type];
}

const chunkStatusColors: Record<string, string> = {
  indexed: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  processing: 'bg-electric/15 text-electric border-electric/30',
  pending: 'bg-muted/30 text-muted-foreground border-glass-border',
};

function AnimatedCounter({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const count = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
        }
      },
    });
    return () => controls.stop();
  }, [count, target, decimals]);

  return <span ref={ref}>0</span>;
}

export function MemoryEngineView() {
  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Hero */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Repository Memory Engine<span className="gradient-text">{"\u2122"}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Persistent repository understanding without repeated uploads.
        </p>
      </motion.div>

      {/* Memory Statistics Row */}
      <motion.div variants={fadeUp}>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2 min-w-max md:min-w-0 md:grid md:grid-cols-4 lg:grid-cols-8 md:pb-0">
            {memoryStatistics.map((stat) => {
              const Icon = iconMap[stat.icon] ?? FileCode;
              return (
                <div key={stat.label} className="glass-card rounded-xl border border-glass-border p-4 min-w-[140px] md:min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-electric shrink-0" />
                    <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold tabular-nums gradient-text">
                    <AnimatedCounter target={stat.value} />
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.unit}</p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Two-Column: Pipeline + Context Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Pipeline */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-electric" />
            <h2 className="text-sm font-semibold text-foreground">Memory Pipeline</h2>
          </div>
          <div className="relative space-y-0">
            {memoryPipelineStages.map((stage, idx) => {
              const isLast = idx === memoryPipelineStages.length - 1;
              const StatusIcon = stage.status === 'completed' ? CheckIcon : stage.status === 'active' ? Loader2 : Circle;
              const pct = stage.totalItems > 0 ? Math.round((stage.itemsProcessed / stage.totalItems) * 100) : 0;
              return (
                <div key={stage.id} className="relative flex gap-3 pb-6 last:pb-0">
                  {/* Connecting line */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-9 bottom-0 w-px bg-glass-border" />
                  )}
                  {/* Icon */}
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2',
                      stage.status === 'completed' && 'bg-emerald-accent/20 ring-emerald-accent/30',
                      stage.status === 'active' && 'bg-electric/20 ring-electric/40 animate-[pulse-glow_2s_ease-in-out_infinite]',
                      stage.status === 'pending' && 'bg-muted/20 ring-muted/30'
                    )}
                  >
                    <StatusIcon className={cn(
                      'h-3.5 w-3.5',
                      stage.status === 'completed' && 'text-emerald-accent',
                      stage.status === 'active' && 'text-electric animate-spin',
                      stage.status === 'pending' && 'text-muted-foreground'
                    )} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        'text-xs font-medium',
                        stage.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {stage.label}
                      </p>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{pct}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{stage.description}</p>
                    <Progress
                      value={pct}
                      className={cn(
                        'mt-2 h-1',
                        stage.status === 'completed' && '[&>div]:bg-emerald-accent',
                        stage.status === 'active' && '[&>div]:bg-electric',
                        stage.status === 'pending' && '[&>div]:bg-muted'
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Context Loss Prevention */}
        <motion.div variants={fadeUp} className="glass-card glow-blue rounded-xl border border-glass-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-electric" />
            <h2 className="text-sm font-semibold text-foreground">
              Context Loss Prevention Engine<span className="gradient-text">{"\u2122"}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {contextLossMetrics.map((metric) => {
              const color = getCoverageColor(metric.coverage);
              return (
                <div key={metric.label} className="flex items-center gap-4">
                  <ProgressRing
                    value={metric.coverage}
                    max={100}
                    size={52}
                    strokeWidth={4}
                    color={color}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground">{metric.label}</p>
                      <p className={cn('text-sm font-bold tabular-nums', getCoverageClass(metric.coverage))}>
                        {metric.coverage}%
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{metric.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Knowledge Chunks Table */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-electric" />
          <h2 className="text-sm font-semibold text-foreground">Knowledge Chunks</h2>
          <Badge variant="outline" className="ml-auto text-[10px] border-glass-border text-muted-foreground">
            {knowledgeChunks.length} chunks
          </Badge>
        </div>
        <div className="max-h-[320px] overflow-y-auto thin-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-surface-elevated z-10">
              <tr className="border-b border-glass-border">
                {['Chunk', 'Source File', 'Module', 'Summary', 'Rel.', 'Status', 'Tokens'].map((h) => (
                  <th key={h} className="pb-2 pr-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {knowledgeChunks.map((chunk) => (
                <tr key={chunk.id} className="border-b border-glass-border/50 last:border-0 hover:bg-surface-inset/30 transition-colors">
                  <td className="py-2 pr-3 text-[10px] font-mono text-muted-foreground">{chunk.id}</td>
                  <td className="py-2 pr-3 text-[10px] font-mono text-foreground max-w-[160px] truncate">{chunk.sourceFile}</td>
                  <td className="py-2 pr-3">
                    <Badge variant="outline" className="text-[10px] border-glass-border text-muted-foreground">
                      {chunk.module}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-[10px] text-muted-foreground max-w-[200px] truncate">{chunk.summary}</td>
                  <td className="py-2 pr-3 text-[10px] text-muted-foreground tabular-nums text-center">{chunk.relationships}</td>
                  <td className="py-2 pr-3">
                    <Badge variant="outline" className={cn('text-[10px]', chunkStatusColors[chunk.status])}>
                      {chunk.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-[10px] text-muted-foreground tabular-nums">{chunk.tokens.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Embeddings & Memory Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Embeddings */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-electric" />
            <h2 className="text-sm font-semibold text-foreground">Embeddings</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Total Embeddings', value: '1,564' },
              { label: 'Knowledge Nodes', value: '892' },
              { label: 'Relationships', value: '2,341' },
              { label: 'Coverage', value: '87%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-inset/50">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-bold tabular-nums gradient-text">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Memory Health Score */}
        <motion.div variants={fadeUp}>
          <ScoreCard
            label="Memory Health Score"
            score={87}
            max={100}
            description="Repository memory is healthy. 87% of the codebase is indexed and searchable through the memory engine."
            size="large"
          />
        </motion.div>
      </div>

      {/* Context Loss Prevention Engine */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-electric/30 p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Context Loss <span className="gradient-text">Prevention Engine™</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Solve AI context loss without repeated uploads.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional AI */}
          <div className="rounded-lg border border-danger-accent/30 bg-danger-accent/5 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-danger-accent uppercase tracking-wider">Traditional AI</h3>
            <div className="space-y-2">
              {[...contextEngineData.traditionalFlow, { step: 'Context Lost', description: '' }, { step: 'Hallucinations', description: '' }].map((item, idx, arr) => (
                <div key={item.step} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono w-5 text-right shrink-0">{idx + 1}</span>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded border truncate',
                    idx >= arr.length - 2
                      ? 'border-danger-accent/40 bg-danger-accent/10 text-danger-accent font-semibold'
                      : 'border-glass-border bg-surface-inset/50 text-muted-foreground'
                  )}>
                    {item.step}
                  </span>
                  {idx < arr.length - 1 && (
                    <ChevronDown className="h-3 w-3 text-danger-accent/50 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CodebaseOS */}
          <div className="rounded-lg border border-emerald-accent/30 bg-emerald-accent/5 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-emerald-accent uppercase tracking-wider">CodebaseOS</h3>
            <div className="space-y-2">
              {contextEngineData.codebaseOSFlow.map((item, idx, arr) => (
                <div key={item.step} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono w-5 text-right shrink-0">{idx + 1}</span>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded border truncate',
                    idx === arr.length - 1
                      ? 'border-emerald-accent/40 bg-emerald-accent/10 text-emerald-accent font-semibold'
                      : 'border-glass-border bg-surface-inset/50 text-electric'
                  )}>
                    {item.step}
                  </span>
                  {idx < arr.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-emerald-accent/50 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contextEngineData.metrics.map((m) => {
            const pct = Math.round((m.value / m.max) * 100);
            const color = pct > 80 ? 'oklch(0.7 0.18 160)' : pct > 60 ? 'oklch(0.8 0.16 80)' : 'oklch(0.65 0.22 25)';
            const textColor = pct > 80 ? 'text-emerald-accent' : pct > 60 ? 'text-amber-accent' : 'text-electric';
            return (
              <div key={m.label} className="rounded-lg border border-glass-border bg-surface-inset/50 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  <span className={cn('text-sm font-bold tabular-nums', textColor)}>{pct}%</span>
                </div>
                <Progress value={pct} className="h-1 mb-1.5" />
                <p className="text-[10px] text-muted-foreground line-clamp-2">{m.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Knowledge Transfer Engine */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-purple-glow/30 p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Knowledge Transfer <span className="gradient-text">Engine™</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Automated knowledge transfer plan generation.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card rounded-lg border border-glass-border p-3 text-center">
            <p className="text-lg font-bold tabular-nums text-emerald-accent">{knowledgeTransferData.summary.completed}</p>
            <p className="text-[10px] text-muted-foreground">Tasks Completed</p>
          </div>
          <div className="glass-card rounded-lg border border-glass-border p-3 text-center">
            <p className="text-lg font-bold tabular-nums text-amber-accent">{knowledgeTransferData.summary.inProgress}</p>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </div>
          <div className="glass-card rounded-lg border border-glass-border p-3 text-center">
            <p className="text-lg font-bold tabular-nums text-electric">{knowledgeTransferData.summary.pending}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className="glass-card rounded-lg border border-glass-border p-3 text-center">
            <p className="text-lg font-bold tabular-nums gradient-text">{knowledgeTransferData.summary.estimatedHours}h</p>
            <p className="text-[10px] text-muted-foreground">Estimated</p>
          </div>
        </div>

        <div className="space-y-4">
          {knowledgeTransferData.categories.map((cat) => {
            const completed = cat.tasks.filter((t) => t.status === 'completed').length;
            const pct = cat.progress;
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {completed} of {cat.tasks.length} completed
                  </span>
                </div>
                <Progress
                  value={pct}
                  className={cn(
                    'h-1.5 mb-3',
                    pct > 50 ? '[&>div]:bg-emerald-accent' : pct > 25 ? '[&>div]:bg-amber-accent' : '[&>div]:bg-electric'
                  )}
                />
                <ul className="space-y-1.5">
                  {cat.tasks.map((task) => {
                    const StatusIcon = task.status === 'completed' ? CheckCircle2 : task.status === 'in-progress' ? Clock : Circle;
                    return (
                      <li key={task.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <StatusIcon
                          className={cn(
                            'h-3.5 w-3.5 mt-0.5 shrink-0',
                            task.status === 'completed' && 'text-emerald-accent',
                            task.status === 'in-progress' && 'text-amber-accent',
                            task.status === 'pending' && 'text-muted-foreground'
                          )}
                        />
                        <span className="leading-relaxed">{task.task}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Memory Insights */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-electric" />
          <h2 className="text-sm font-semibold text-foreground">Memory Insights</h2>
        </div>
        <div className="space-y-3">
          {memoryInsights.map((insight) => {
            const cfg = getInsightConfig(insight.type);
            const Icon = cfg.icon;
            return (
              <div
                key={insight.id}
                className={cn('rounded-lg border-l-2 bg-surface-inset/30 p-4', cfg.color)}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', cfg.iconColor)} />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{insight.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}