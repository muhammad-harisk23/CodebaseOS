'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  Code2,
  Database,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  FileCode,
  Calendar,
  Clock,
  Box,
  Server,
  Globe,
  BoxesIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { repositoryDetail } from '@/mock/repository-detail';
import { repositories } from '@/mock/repositories';
import { dependencyList } from '@/mock/dependencies';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const techBadges = [
  { label: 'Framework', value: 'Next.js', icon: Layers, accent: 'text-purple-glow' },
  { label: 'Language', value: 'TypeScript', icon: Code2, accent: 'text-electric' },
  { label: 'Database', value: 'MongoDB', icon: Database, accent: 'text-emerald-accent' },
  { label: 'Authentication', value: 'JWT', icon: ShieldCheck, accent: 'text-amber-accent' },
];

const healthColors: Record<string, string> = {
  healthy: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  outdated: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  vulnerable: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
  critical: 'bg-danger-accent/20 text-danger-accent border-danger-accent/50 glow-danger',
};
const statusColors: Record<string, string> = {
  active: 'text-electric',
  unused: 'text-muted-foreground',
  'dev-only': 'text-electric',
};
const riskColors: Record<string, string> = {
  low: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  medium: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  high: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
  critical: 'bg-danger-accent/20 text-danger-accent border-danger-accent/50 glow-danger',
};

const categoryAccents: Record<string, string> = {
  Frontend: 'text-purple-glow',
  Backend: 'text-electric',
  Database: 'text-emerald-accent',
  Infrastructure: 'text-amber-accent',
  Authentication: 'text-danger-accent',
  Payments: 'text-amber-accent',
  Monitoring: 'text-purple-glow',
};

export function RepositoryAnalysisView() {
  const { selectedRepositoryId, setCurrentView } = useAppStore();
  const repo = repositories.find((r) => r.id === selectedRepositoryId) ?? repositories[0];
  const detail = repositoryDetail;

  const overviewStats = [
    { label: 'Repository Name', value: detail.fullName, icon: FileCode },
    { label: 'Description', value: detail.description.slice(0, 80) + '...', icon: FileCode },
    { label: 'Created', value: new Date(detail.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar },
    { label: 'Updated', value: new Date(detail.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Clock },
    { label: 'Modules', value: String(detail.modules), icon: Box },
    { label: 'Services', value: String(detail.services), icon: Server },
    { label: 'APIs', value: String(detail.apis), icon: Globe },
    { label: 'Entities', value: String(detail.entities), icon: BoxesIcon },
  ];

  const intelligenceMetrics = [
    { label: 'Knowledge Debt', value: repo.knowledgeDebt, color: 'text-danger-accent' },
    { label: 'Survivability', value: repo.survivability, color: 'text-danger-accent' },
    { label: 'Recoverability', value: repo.recoverability, color: 'text-amber-accent' },
    { label: 'Critical Risks', value: repo.criticalRisks, color: 'text-danger-accent' },
    { label: 'Architecture Complexity', value: repo.architectureComplexity, color: 'text-amber-accent' },
    { label: 'Estimated Onboarding Time', value: '3 Weeks', color: 'text-amber-accent' },
  ];

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Repository Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Intelligence report for <span className="font-medium text-foreground">{detail.fullName}</span>.
        </p>
      </motion.div>

      {/* Technology Badges */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {techBadges.map((badge) => (
          <div key={badge.label} className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-inset">
              <badge.icon className={cn('h-4 w-4', badge.accent)} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{badge.label}</p>
              <p className="text-sm font-semibold text-foreground">{badge.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Repository Overview */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-electric" />
          <h2 className="text-sm font-semibold text-foreground">Repository Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="flex items-start gap-3 p-3 rounded-lg bg-surface-inset/50">
              <stat.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xs font-medium text-foreground mt-0.5 break-words">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Repository Intelligence Report */}
      <motion.div variants={fadeUp} className="glass-card glow-danger rounded-xl border border-danger-accent/30 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-danger-accent" />
          <h2 className="text-sm font-semibold text-foreground">Repository Intelligence Report</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {intelligenceMetrics.map((m) => (
            <div key={m.label} className="text-center p-3 rounded-lg bg-surface-inset/50">
              <p className="text-xl font-bold tabular-nums">{m.value}</p>
              <p className={cn('text-[10px] mt-0.5', m.color)}>{m.label}</p>
            </div>
          ))}
        </div>
        {/* Biggest Risk Callout */}
        <div className="rounded-lg border border-danger-accent/30 bg-danger-accent/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-danger-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-danger-accent">Biggest Risk</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{repo.biggestRisk}</p>
          </div>
        </div>
        <Button className="w-full" onClick={() => setCurrentView('dashboard')}>
          View Dashboard
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </motion.div>

      {/* Technology Stack */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-electric" />
          <h2 className="text-sm font-semibold text-foreground">Technology Stack</h2>
        </div>
        {detail.technologyStack.map((cat) => (
          <div key={cat.category}>
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-2', categoryAccents[cat.category] ?? 'text-foreground')}>
              {cat.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-glass-border bg-surface-inset px-2.5 py-1"
                >
                  <span className="text-xs font-medium text-foreground">{item.name}</span>
                  {item.version !== '\u2014' && (
                    <span className="text-[10px] text-muted-foreground">v{item.version}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Dependencies */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-electric" />
          <h2 className="text-sm font-semibold text-foreground">Dependencies</h2>
          <Badge variant="outline" className="ml-auto text-[10px] border-glass-border text-muted-foreground">
            {dependencyList.length} packages
          </Badge>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-glass-border">
                {['Name', 'Version', 'Health', 'Status', 'Risk', 'Category'].map((h) => (
                  <th key={h} className="pb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dependencyList.map((dep) => (
                <tr key={dep.id} className="border-b border-glass-border/50 last:border-0 hover:bg-surface-inset/30 transition-colors">
                  <td className="py-2.5 pr-4 text-xs font-medium text-foreground">{dep.name}</td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground font-mono">{dep.version}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant="outline" className={cn('text-[10px]', healthColors[dep.health])}>{dep.health}</Badge>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={cn('text-[10px] font-medium capitalize', statusColors[dep.status])}>{dep.status}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant="outline" className={cn('text-[10px]', riskColors[dep.risk])}>{dep.risk}</Badge>
                  </td>
                  <td className="py-2.5 text-[10px] text-muted-foreground capitalize">{dep.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {dependencyList.map((dep) => (
            <div key={dep.id} className="glass-card rounded-lg border border-glass-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{dep.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{dep.version}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className={cn('text-[10px]', healthColors[dep.health])}>{dep.health}</Badge>
                <Badge variant="outline" className={cn('text-[10px]', riskColors[dep.risk])}>{dep.risk}</Badge>
                <span className={cn('text-[10px] capitalize', statusColors[dep.status])}>{dep.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}