'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  completed: {
    dot: 'bg-emerald-accent',
    ring: 'ring-emerald-accent/30',
    icon: Check,
    iconColor: 'text-emerald-accent',
    line: 'bg-emerald-accent/40',
    titleColor: 'text-foreground',
    descColor: 'text-muted-foreground',
  },
  active: {
    dot: 'bg-electric',
    ring: 'ring-electric/40',
    icon: Clock,
    iconColor: 'text-electric',
    line: 'bg-muted/30',
    titleColor: 'text-foreground',
    descColor: 'text-muted-foreground',
  },
  pending: {
    dot: 'bg-muted',
    ring: 'ring-muted/30',
    icon: Circle,
    iconColor: 'text-muted-foreground',
    line: 'bg-muted/20',
    titleColor: 'text-muted-foreground',
    descColor: 'text-muted-foreground/60',
  },
} as const;

interface TimelineCardProps {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  icon?: LucideIcon;
  timestamp?: string;
}

export function TimelineCard({
  step,
  title,
  description,
  status,
  icon: CustomIcon,
  timestamp,
}: TimelineCardProps) {
  const cfg = statusConfig[status];
  const StatusIcon = CustomIcon ?? cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: step * 0.1 }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      {/* Vertical connecting line */}
      {status !== 'pending' && (
        <div
          className="absolute bottom-0 left-[17px] top-10 w-px"
          style={{ backgroundColor: status === 'completed' ? 'oklch(0.7 0.18 160 / 40%)' : 'oklch(0.5 0 0 / 30%)' }}
        />
      )}

      {/* Dot / Icon */}
      <div className="relative z-10 flex shrink-0">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full ring-2',
            cfg.dot,
            cfg.ring,
            status === 'active' && 'animate-[pulse-glow_2s_ease-in-out_infinite]'
          )}
        >
          <StatusIcon className={cn('h-4 w-4', cfg.iconColor)} />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center gap-2">
          <h4 className={cn('text-sm font-semibold', cfg.titleColor)}>
            {title}
          </h4>
          <span className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Step {step}
          </span>
        </div>
        <p className={cn('mt-1 text-xs leading-relaxed', cfg.descColor)}>
          {description}
        </p>
        {timestamp && (
          <p className="mt-2 text-[10px] text-muted-foreground/60">{timestamp}</p>
        )}
      </div>
    </motion.div>
  );
}