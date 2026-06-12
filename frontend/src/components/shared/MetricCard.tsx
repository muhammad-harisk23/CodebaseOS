'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricData } from '@/types';

const severityConfig = {
  critical: {
    border: 'border-l-danger-accent',
    glow: 'glow-danger',
    trend: 'text-danger-accent',
    chartFill: 'oklch(0.65 0.22 25)',
    chartStroke: 'oklch(0.65 0.22 25)',
  },
  warning: {
    border: 'border-l-amber-accent',
    glow: 'glow-amber',
    trend: 'text-amber-accent',
    chartFill: 'oklch(0.8 0.16 80)',
    chartStroke: 'oklch(0.8 0.16 80)',
  },
  good: {
    border: 'border-l-emerald-accent',
    glow: 'glow-emerald',
    trend: 'text-emerald-accent',
    chartFill: 'oklch(0.7 0.18 160)',
    chartStroke: 'oklch(0.7 0.18 160)',
  },
  info: {
    border: 'border-l-electric',
    glow: 'glow-blue',
    trend: 'text-electric',
    chartFill: 'oklch(0.65 0.22 260)',
    chartStroke: 'oklch(0.65 0.22 260)',
  },
} as const;

function generateSparklineData(metric: MetricData) {
  const points = 12;
  const baseValue = metric.value;
  const variation = (metric.max - baseValue) * 0.15;
  return Array.from({ length: points }, (_, i) => ({
    v:
      baseValue +
      (Math.sin(i * 0.8) * variation) / 2 +
      (Math.cos(i * 1.3) * variation) / 3,
  }));
}

interface MetricCardProps {
  metric: MetricData;
  index?: number;
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const cfg = severityConfig[metric.severity];
  const sparkline = generateSparklineData(metric);

  const trendIcon =
    metric.trend === 'up' ? (
      <TrendingUp className="h-4 w-4" />
    ) : metric.trend === 'down' ? (
      <TrendingDown className="h-4 w-4" />
    ) : (
      <Minus className="h-4 w-4" />
    );

  const trendPrefix = metric.trendValue > 0 ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className={cn(
        'glass-card glass-card-hover relative overflow-hidden rounded-xl border-l-4 p-5 transition-all duration-300',
        cfg.border,
        cfg.glow
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {metric.label}
        </span>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-semibold',
            cfg.trend
          )}
        >
          {trendIcon}
          <span>
            {trendPrefix}
            {metric.trendValue}%
          </span>
        </div>
      </div>

      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="text-sm font-medium text-muted-foreground">
            {metric.unit}
          </span>
        )}
      </div>

      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {metric.description}
      </p>

      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline}>
            <defs>
              <linearGradient id={`spark-${metric.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.chartFill} stopOpacity={0.3} />
                <stop offset="100%" stopColor={cfg.chartFill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="v" hide />
            <YAxis dataKey="v" domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Area
              type="monotone"
              dataKey="v"
              stroke={cfg.chartStroke}
              strokeWidth={2}
              fill={`url(#spark-${metric.label})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}