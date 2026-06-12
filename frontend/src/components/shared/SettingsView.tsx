'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        <Badge variant={value === 'healthy' || value === 'up' ? 'default' : 'secondary'}>
          {value === 'healthy' || value === 'up' ? 'OK' : 'N/A'}
        </Badge>
      </div>
    </div>
  );
}

/**
 * Minimal internal diagnostics page.
 * Hidden from sidebar by design (no Sidebar item + not in Sidebar nav).
 * Accessible via internal route (see frontend/src/app/page.tsx viewMap).
 */
export function SettingsView() {
  const [backendStatus] = useState<'unknown' | 'up' | 'down'>('unknown');
  const [mongoStatus] = useState<'unknown' | 'up' | 'down'>('unknown');
  const [geminiStatus] = useState<'unknown' | 'up' | 'down'>('unknown');
  const [gitlabStatus] = useState<'unknown' | 'up' | 'down'>('unknown');
  const [envInfo] = useState<string>('API: (configured in .env.local)');
  const [themeInfo, setThemeInfo] = useState<string>('—');

  const labels = useMemo(
    () => ({
      backend: 'Backend',
      mongodb: 'MongoDB',
      gemini: 'Gemini',
      gitlab: 'GitLab',
      env: 'Environment',
      theme: 'Theme',
    }),
    []
  );

  useEffect(() => {
    const root = document.documentElement;
    setThemeInfo(root.className?.includes('dark') ? 'dark' : 'light');
  }, []);

  const statusToText = (s: typeof backendStatus) => {
    if (s === 'unknown') return 'unknown';
    return s === 'up' ? 'healthy' : 'down';
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Internal Diagnostics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Low-priority health & environment overview for demos and backend integration.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <StatusRow label={labels.backend} value={statusToText(backendStatus)} />
        <StatusRow label={labels.mongodb} value={statusToText(mongoStatus)} />
        <StatusRow label={labels.gemini} value={statusToText(geminiStatus)} />
        <StatusRow label={labels.gitlab} value={statusToText(gitlabStatus)} />

        <div className="py-2 border-b border-border">
          <div className="text-sm text-muted-foreground">Environment Information</div>
          <div className="text-sm font-medium text-foreground mt-1">{envInfo}</div>
        </div>

        <div className="py-2">
          <div className="text-sm text-muted-foreground">Theme Status</div>
          <div className="text-sm font-medium text-foreground mt-1">{themeInfo}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Health endpoints will be wired in later phases using React Query and the centralized API layer.
      </div>
    </div>
  );
}
