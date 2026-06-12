'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, FileCode2, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Repository } from '@/types';

const statusColor: Record<Repository['status'], string> = {
  complete: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/20',
  analyzing: 'bg-electric/15 text-electric border-electric/20',
  queued: 'bg-amber-accent/15 text-amber-accent border-amber-accent/20',
  error: 'bg-danger-accent/15 text-danger-accent border-danger-accent/20',
};

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/30">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="w-7 text-right text-[11px] tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

interface RepositoryCardProps {
  repository: Repository;
  onSelect: (id: string) => void;
  active?: boolean;
}

export function RepositoryCard({ repository, onSelect, active = false }: RepositoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(repository.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(repository.id); }}
      className={cn(
        'glass-card cursor-pointer rounded-xl p-5 transition-all duration-300',
        'glass-card-hover',
        active
          ? 'ring-2 ring-electric/60 glow-blue border-electric/30'
          : 'border-glass-border'
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {repository.fullName}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {repository.description}
          </p>
        </div>
        <Badge variant="outline" className={cn('shrink-0 text-[10px]', statusColor[repository.status])}>
          {repository.status}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileCode2 className="h-3 w-3" />
          {repository.language}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repository.stars}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {repository.contributors}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repository.dependencies}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(repository.lastAnalyzed).toLocaleDateString()}
        </span>
      </div>

      {/* Mini metric bars */}
      <div className="space-y-1.5">
        <MiniBar
          label="Knowledge Debt"
          value={repository.knowledgeDebt}
          max={100}
          color="oklch(0.65 0.22 25)"
        />
        <MiniBar
          label="Survivability"
          value={repository.survivability}
          max={100}
          color="oklch(0.7 0.18 160)"
        />
        <MiniBar
          label="Recoverability"
          value={repository.recoverability}
          max={100}
          color="oklch(0.65 0.22 260)"
        />
      </div>
    </motion.div>
  );
}