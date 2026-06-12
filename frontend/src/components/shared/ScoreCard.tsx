'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ScoreBreakdown } from '@/types';

function getScoreColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct > 70) return 'oklch(0.7 0.18 160)';
  if (pct > 40) return 'oklch(0.8 0.16 80)';
  return 'oklch(0.65 0.22 25)';
}

function getScoreGlow(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct > 70) return 'glow-emerald';
  if (pct > 40) return 'glow-amber';
  return 'glow-danger';
}

function getScoreLabel(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct > 70) return 'text-emerald-accent';
  if (pct > 40) return 'text-amber-accent';
  return 'text-danger-accent';
}

interface ScoreCardProps {
  label: string;
  score: number;
  max: number;
  description: string;
  size?: 'default' | 'large';
  breakdown?: ScoreBreakdown[];
}

export function ScoreCard({
  label,
  score,
  max,
  description,
  size = 'default',
  breakdown,
}: ScoreCardProps) {
  const pct = score / max;
  const color = getScoreColor(score, max);
  const glow = getScoreGlow(score, max);
  const textColor = getScoreLabel(score, max);

  const ringSize = size === 'large' ? 180 : 120;
  const strokeWidth = size === 'large' ? 12 : 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct);

  const fontSize = size === 'large' ? 'text-4xl' : 'text-2xl';
  const labelSize = size === 'large' ? 'text-base' : 'text-xs';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'glass-card glass-card-hover rounded-xl p-6 transition-all duration-300',
        glow
      )}
    >
      <div className="flex flex-col items-center">
        {/* Circular score ring */}
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg
            width={ringSize}
            height={ringSize}
            className="-rotate-90"
            viewBox={`0 0 ${ringSize} ${ringSize}`}
          >
            {/* Background ring */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/30"
            />
            {/* Progress ring */}
            <motion.circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-bold tabular-nums', fontSize, textColor)}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/ {max}</span>
          </div>
        </div>

        {/* Label and description */}
        <h3 className={cn('mt-3 font-semibold text-foreground', labelSize)}>
          {label}
        </h3>
        <p className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Breakdown bars */}
      {breakdown && breakdown.length > 0 && (
        <div className="mt-5 space-y-2.5 border-t border-glass-border pt-4">
          {breakdown.map((item) => {
            const itemPct = item.score / item.max;
            const itemColor = getScoreColor(item.score, item.max);
            return (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {item.category}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {item.score}/{item.max}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: itemColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${itemPct * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}