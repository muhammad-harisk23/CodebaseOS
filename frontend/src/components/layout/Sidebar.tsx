'use client';

import React, { useCallback, useMemo } from 'react';
import {
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { repositories } from '@/mock/repositories';
import type { ViewId } from '@/types';

interface SidebarItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

interface NavItemProps {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  depth?: number;
  active?: boolean;
  onClick: (id: ViewId) => void;
}

function NavItem({ id, label, icon: Icon, depth = 0, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        'flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm transition-all duration-150',
        'hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        depth > 0 && 'pl-9',
        active
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Repository',
    items: [
      { id: 'repository-upload', label: 'Upload', icon: Upload },
      { id: 'repository-analysis', label: 'Analysis', icon: GitBranch },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'memory-engine', label: 'Memory Engine', icon: Brain },
      { id: 'architecture', label: 'Architecture Graph', icon: Network },
      { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Share2 },
    ],
  },
  {
    label: 'Risk',
    items: [
      { id: 'knowledge-debt', label: 'Knowledge Debt', icon: AlertTriangle },
      { id: 'survivability', label: 'Survivability', icon: Shield },
      { id: 'recoverability', label: 'Recoverability', icon: RefreshCw },
      { id: 'risk-center', label: 'Risk Center', icon: Activity },
      { id: 'bus-factor', label: 'Bus Factor', icon: Users },
      { id: 'ownership', label: 'Ownership Map', icon: Map },
    ],
  },
  {
    label: 'Agent',
    items: [
      { id: 'agent-actions', label: 'Agent Actions', icon: Bot },
      { id: 'gitlab-actions', label: 'GitLab Actions', icon: FolderGit2 },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { id: 'learning-missions', label: 'Learning Missions', icon: GraduationCap },
      { id: 'knowledge-interview', label: 'Knowledge Interview', icon: MessageSquare },
      { id: 'documentation', label: 'Documentation', icon: FileText },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'freelancer-rescue', label: 'Freelancer Rescue', icon: LifeBuoy },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, selectedRepositoryId, setSelectedRepositoryId } =
    useAppStore();
  const selectedRepo = useMemo(
    () => repositories.find((r) => r.id === selectedRepositoryId) ?? repositories[0],
    [selectedRepositoryId]
  );

  const handleNavClick = useCallback(
    (id: ViewId) => {
      setCurrentView(id);
      setSidebarOpen(false);
    },
    [setCurrentView, setSidebarOpen]
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 px-4 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-purple-glow">
            <Network className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground leading-none">
              CodebaseOS
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Engineering Knowledge
            </span>
          </div>
        </div>

        {/* Repository Selector */}
        <div className="px-3 py-3">
          <select
            value={selectedRepositoryId ?? ''}
            onChange={(e) => setSelectedRepositoryId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Select repository"
          >
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>

        <Separator className="opacity-50" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2 scrollbar-thin">
          <nav className="flex flex-col gap-1" aria-label="Sidebar navigation">
            {sidebarGroups.map((group) => (
              <div key={group.label} className="mb-2">
                <span className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </span>
                {group.items.map((item) => (
                  <NavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={currentView === item.id}
                    onClick={handleNavClick}
                  />
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Repository Status Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-md bg-surface-inset p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground truncate">
                {selectedRepo.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {selectedRepo.language}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>{selectedRepo.files} files</span>
              <span>{selectedRepo.dependencies} deps</span>
              <span>{selectedRepo.contributors} contributors</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  selectedRepo.knowledgeDebt > 70
                    ? 'bg-danger-accent'
                    : selectedRepo.knowledgeDebt > 40
                      ? 'bg-amber-accent'
                      : 'bg-emerald-accent'
                )}
                style={{ width: `${selectedRepo.knowledgeDebt}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">Debt Score</span>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  selectedRepo.knowledgeDebt > 70
                    ? 'text-danger-accent'
                    : selectedRepo.knowledgeDebt > 40
                      ? 'text-amber-accent'
                      : 'text-emerald-accent'
                )}
              >
                {selectedRepo.knowledgeDebt}/100
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}