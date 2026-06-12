'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search,
  LayoutDashboard,
  Upload,
  GitBranch,
  Brain,
  Network,
  Share2,
  AlertTriangle,
  Shield,
  RefreshCw,
  Activity,
  Users,
  Map,
  Bot,
  FolderGit2,
  GraduationCap,
  MessageSquare,
  FileText,
  LifeBuoy,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import type { ViewId } from '@/types';

interface CommandItem {
  id: ViewId;
  label: string;
  group: string;
  icon: LucideIcon;
}

const commandItems: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', group: 'Navigation', icon: LayoutDashboard },
  { id: 'repository-upload', label: 'Upload Repository', group: 'Navigation', icon: Upload },
  { id: 'repository-analysis', label: 'Repository Analysis', group: 'Navigation', icon: GitBranch },
  { id: 'memory-engine', label: 'Memory Engine', group: 'Intelligence', icon: Brain },
  { id: 'architecture', label: 'Architecture Graph', group: 'Intelligence', icon: Network },
  { id: 'knowledge-graph', label: 'Knowledge Graph', group: 'Intelligence', icon: Share2 },
  { id: 'knowledge-debt', label: 'Knowledge Debt', group: 'Risk', icon: AlertTriangle },
  { id: 'survivability', label: 'Survivability', group: 'Risk', icon: Shield },
  { id: 'recoverability', label: 'Recoverability', group: 'Risk', icon: RefreshCw },
  { id: 'risk-center', label: 'Risk Center', group: 'Risk', icon: Activity },
  { id: 'bus-factor', label: 'Bus Factor', group: 'Risk', icon: Users },
  { id: 'ownership', label: 'Ownership Map', group: 'Risk', icon: Map },
  { id: 'agent-actions', label: 'Agent Actions', group: 'Agent', icon: Bot },
  { id: 'gitlab-actions', label: 'GitLab Actions', group: 'Agent', icon: FolderGit2 },
  { id: 'learning-missions', label: 'Learning Missions', group: 'Knowledge', icon: GraduationCap },
  { id: 'knowledge-interview', label: 'Knowledge Interview', group: 'Knowledge', icon: MessageSquare },
  { id: 'documentation', label: 'Documentation', group: 'Knowledge', icon: FileText },
  { id: 'freelancer-rescue', label: 'Freelancer Rescue', group: 'Tools', icon: LifeBuoy },
  { id: 'settings', label: 'Settings', group: 'Tools', icon: Settings },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentView } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commandItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (id: ViewId) => {
      setCurrentView(id);
      setCommandPaletteOpen(false);
      setQuery('');
    },
    [setCurrentView, setCommandPaletteOpen]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].id);
      }
    },
    [filtered, selectedIndex, handleSelect]
  );

  // Group filtered items
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden border border-border bg-background/95 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, commands..."
            className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search commands"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin" role="listbox">
          {Object.keys(grouped).length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group}
                </div>
                {items.map((item) => {
                  const currentIndex = flatIndex++;
                  const isSelected = currentIndex === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                Esc
              </kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}