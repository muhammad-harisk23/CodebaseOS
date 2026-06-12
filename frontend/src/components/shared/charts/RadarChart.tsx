'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface RadarChartProps {
  data: { category: string; value: number; fullMark: number }[];
  title?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload?: { fullMark?: number } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const fullMark = payload[0].payload?.fullMark ?? 100;
  return (
    <div className="rounded-lg border border-glass-border bg-surface-elevated px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-0.5 tabular-nums text-electric">
        {payload[0].value} / {fullMark}
      </p>
    </div>
  );
}

export function RadarChart({
  data,
  title,
  height = 300,
}: RadarChartProps) {
  const maxFullMark = Math.max(...data.map((d) => d.fullMark), 100);

  return (
    <div className={cn('w-full', title && 'space-y-2')}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, maxFullMark]}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="var(--electric)"
              strokeWidth={2}
              fill="var(--electric)"
              fillOpacity={0.15}
              dot={{
                r: 3,
                fill: 'var(--electric)',
                stroke: 'var(--background)',
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 5,
                fill: 'var(--electric)',
                stroke: 'var(--background)',
                strokeWidth: 2,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}