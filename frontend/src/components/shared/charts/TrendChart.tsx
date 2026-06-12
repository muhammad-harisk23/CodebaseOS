'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { TrendDataPoint } from '@/types';

interface TrendChartProps {
  data: TrendDataPoint[];
  color?: string;
  title?: string;
  height?: number;
  showArea?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-glass-border bg-surface-elevated px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold tabular-nums text-foreground">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function TrendChart({
  data,
  color,
  title,
  height = 200,
  showArea = true,
}: TrendChartProps) {
  const strokeColor = color ?? 'var(--electric)';
  const gradientId = `trend-${title ?? 'default'}`;

  return (
    <div className={cn('w-full', title && 'space-y-2')}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'var(--muted-foreground)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            {showArea ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                  fill: strokeColor,
                }}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                  fill: strokeColor,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}