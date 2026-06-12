'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Flow = ReactFlow as any;
import { AlertTriangle, AlertCircle, Info, X, FileText, GraduationCap, FolderGit2, MessageSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionCard } from '@/components/shared/ActionCard';
import { useAppStore } from '@/store/app-store';
import { ownershipEnhancedData } from '@/mock/ownership-enhanced';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const riskBadge: Record<string, string> = {
  silo: 'bg-danger-accent/15 text-danger-accent',
  moderate: 'bg-amber-accent/15 text-amber-accent',
  healthy: 'bg-emerald-accent/15 text-emerald-accent',
  critical: 'bg-danger-accent/15 text-danger-accent',
  high: 'bg-amber-accent/15 text-amber-accent',
  medium: 'bg-electric/15 text-electric',
  low: 'bg-emerald-accent/15 text-emerald-accent',
};

const roleMap: Record<string, string> = { 'Alice Chen': 'Lead Engineer', 'Bob Martinez': 'Backend Dev', 'Charlie Kim': 'Full Stack Dev' };
const insightIcons: Record<string, typeof AlertTriangle> = { critical: AlertTriangle, warning: AlertCircle, info: Info };
const insightBorder: Record<string, string> = { critical: 'border-l-danger-accent', warning: 'border-l-amber-accent', info: 'border-l-electric' };

const modulePositions: Record<string, { x: number; y: number }> = {
  'mod-auth': { x: -100, y: 250 }, 'mod-infra': { x: 0, y: 250 }, 'mod-api': { x: 100, y: 250 },
  'mod-database': { x: 300, y: 250 }, 'mod-payments': { x: 600, y: 250 },
};
const contribPositions: Record<string, { x: number; y: number }> = {
  'contrib-alice': { x: 0, y: 0 }, 'contrib-bob': { x: 300, y: 0 }, 'contrib-charlie': { x: 600, y: 0 },
};

function ContributorNodeComponent({ data, selected }: any) {
  const { name, ownership, role, moduleCount, risk } = data;
  return (
    <div className={cn(
      'min-w-[180px] rounded-lg border border-electric/40 bg-electric/15 backdrop-blur-sm p-3',
      selected && 'ring-2 ring-ring ring-offset-1 ring-offset-background',
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/20 text-electric text-xs font-bold">
          {name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] mb-1.5">
        <span className="text-muted-foreground">{moduleCount} modules</span>
        <span className="font-semibold text-electric">{ownership}% total</span>
      </div>
      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', riskBadge[risk])}>{risk}</Badge>
    </div>
  );
}

function ModuleNodeComponent({ data, selected }: any) {
  const { label, owner, ownerPct, risk, docCov } = data;
  const borderColor = risk === 'silo' ? 'border-l-danger-accent' : risk === 'moderate' ? 'border-l-amber-accent' : 'border-l-emerald-accent';
  return (
    <div className={cn(
      'min-w-[180px] rounded-lg border border-glass-border bg-card backdrop-blur-sm p-3 border-l-[3px]',
      borderColor, selected && 'ring-2 ring-ring ring-offset-1 ring-offset-background',
    )}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-foreground truncate">{label}</p>
        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', riskBadge[risk])}>{risk}</Badge>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{owner} ({ownerPct}%)</p>
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/30">
          <div className={cn('h-full rounded-full', docCov < 10 ? 'bg-danger-accent' : docCov < 30 ? 'bg-amber-accent' : 'bg-emerald-accent')}
            style={{ width: `${docCov}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">{docCov}%</span>
      </div>
    </div>
  );
}

const nodeTypes = { contributor: ContributorNodeComponent, module: ModuleNodeComponent };

const recIcons: Record<string, typeof FileText> = {
  'generate-documentation': FileText, 'create-learning-mission': GraduationCap,
  'create-gitlab-issue': FolderGit2, 'create-knowledge-transfer-plan': MessageSquare, 'assign-backup-owner': Users,
};
const recViews: Record<string, ViewId> = {
  'generate-documentation': 'documentation', 'create-learning-mission': 'learning-missions',
  'create-gitlab-issue': 'gitlab-actions', 'create-knowledge-transfer-plan': 'knowledge-interview', 'assign-backup-owner': 'ownership',
};

export function OwnershipView() {
  const { setCurrentView } = useAppStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const nav = (view: ViewId) => () => setCurrentView(view);

  const moduleLookup = useMemo(() => Object.fromEntries(ownershipEnhancedData.modules.map((m) => [m.id, m])), []);
  const contribLookup = useMemo(() => Object.fromEntries(ownershipEnhancedData.contributors.map((c) => [c.id, c])), []);

  const getConnectedContribs = (moduleId: string) =>
    ownershipEnhancedData.graphEdges.filter((e) => e.target === moduleId).map((e) => contribLookup[e.source]?.name).filter(Boolean);

  const initialNodes = useMemo(() => [
    ...ownershipEnhancedData.graphNodes.filter((n) => n.nodeType === 'contributor').map((n) => {
      const c = contribLookup[n.id];
      return { id: n.id, type: 'contributor', position: contribPositions[n.id] ?? { x: 0, y: 0 },
        data: { name: n.label, ownership: n.ownership, role: roleMap[n.label] ?? '', moduleCount: c?.modules.length ?? 0, risk: c?.risk ?? 'medium' } };
    }),
    ...ownershipEnhancedData.graphNodes.filter((n) => n.nodeType === 'module').map((n) => {
      const m = moduleLookup[n.id];
      return { id: n.id, type: 'module', position: modulePositions[n.id] ?? { x: 0, y: 250 },
        data: { label: n.label, owner: m?.primaryOwner ?? '', ownerPct: m?.ownershipPercent ?? 0, risk: m?.riskLevel ?? 'moderate', docCov: m?.documentationCoverage ?? 0 } };
    }),
  ], [contribLookup, moduleLookup]);

  const initialEdges = useMemo(() => ownershipEnhancedData.graphEdges.map((e) => {
    const isOwns = e.type === 'owns';
    const isBackup = e.type === 'backup';
    let stroke = 'var(--muted-foreground)';
    if (isOwns) stroke = e.weight > 80 ? 'var(--danger-accent)' : e.weight > 50 ? 'var(--amber-accent)' : 'var(--electric)';
    if (isBackup) stroke = 'var(--emerald-accent)';
    return {
      id: e.id, source: e.source, target: e.target, type: 'default', animated: isOwns,
      style: { stroke, strokeWidth: isOwns ? 2.5 : isBackup ? 1.5 : 1.5, strokeDasharray: isOwns ? 'none' : isBackup ? '2 4' : '5 5' },
      label: e.type, labelStyle: { fontSize: 10, fill: 'var(--muted-foreground)' },
    };
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const selectedContrib = selectedNodeId ? contribLookup[selectedNodeId] : undefined;
  const selectedModule = selectedNodeId ? moduleLookup[selectedNodeId] : undefined;
  const selectedNode = selectedContrib ?? selectedModule;
  const isContrib = !!selectedContrib;

  return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" variants={stagger} initial="hidden" animate="show">
      {/* Hero */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Knowledge <span className="gradient-text">Ownership Map™</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Who understands what?</p>
      </motion.div>

      {/* React Flow Graph */}
      <motion.div variants={fadeUp} className="relative glass-card rounded-xl border border-glass-border overflow-hidden" style={{ height: 500 }}>
        <Flow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}>
          <Background gap={20} size={1} />
          <Controls className="!bg-card !border-glass-border [&>button]:!bg-card [&>button]:!border-glass-border [&>button]:!text-foreground" />
          <MiniMap nodeColor={() => 'var(--electric)'} maskColor="rgba(0,0,0,0.6)" className="!bg-card !border-glass-border" />
        </Flow>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-full sm:w-80 bg-card/95 backdrop-blur-xl border-l border-glass-border z-10">
              <ScrollArea className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{isContrib ? selectedContrib!.name : selectedModule!.module}</h3>
                  <button onClick={() => setSelectedNodeId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                {isContrib ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-[10px]', riskBadge[selectedContrib.risk])}>{selectedContrib.risk}</Badge>
                      <span className="text-xs text-muted-foreground">{roleMap[selectedContrib.name]}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Total Ownership</p>
                      <p className="text-lg font-bold text-electric">{selectedContrib.ownershipTotal}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1.5">Owned Modules</p>
                      <div className="space-y-1">
                        {selectedContrib.modules.map((m) => {
                          const mod = ownershipEnhancedData.modules.find((x) => x.module === m);
                          return mod ? (
                            <div key={m} className="flex items-center justify-between rounded-md bg-surface-inset px-2.5 py-1.5">
                              <span className="text-xs text-foreground">{m}</span>
                              <span className="text-[10px] text-muted-foreground">{mod.ownershipPercent}%</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1.5">Recommended Actions</p>
                      <p className="text-xs text-foreground leading-relaxed">Begin cross-training sessions and assign backup owners for all modules owned by this contributor.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-[10px]', riskBadge[selectedModule!.riskLevel])}>{selectedModule!.riskLevel}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Primary Owner</p>
                      <p className="text-sm font-semibold text-foreground">{selectedModule!.primaryOwner} — {selectedModule!.ownershipPercent}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Backup Owner</p>
                      {selectedModule!.backupOwner
                        ? <p className="text-sm text-foreground">{selectedModule!.backupOwner}</p>
                        : <p className="text-sm text-danger-accent">None Assigned</p>}
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Documentation Coverage</p>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedModule!.documentationCoverage} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-foreground">{selectedModule!.documentationCoverage}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1.5">Dependencies</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedModule!.dependencies.map((d) => <span key={d} className="rounded-full bg-surface-inset px-2 py-0.5 text-[10px] text-muted-foreground">{d}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1.5">Connected Contributors</p>
                      <div className="flex flex-wrap gap-1">
                        {getConnectedContribs(selectedModule!.id).map((c) => (
                          <span key={c} className="rounded-full bg-electric/10 px-2 py-0.5 text-[10px] text-electric">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ownership Table */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Ownership Overview</h2>
        <ScrollArea className="w-full">
          <div className="min-w-[640px]">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-glass-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Module</th><th className="pb-2 font-medium">Primary Owner</th>
                <th className="pb-2 font-medium">Backup Owner</th><th className="pb-2 font-medium">Risk</th>
                <th className="pb-2 font-medium w-36">Documentation</th>
              </tr></thead>
              <tbody>
                {ownershipEnhancedData.modules.map((m) => (
                  <tr key={m.id} className={cn('border-b border-glass-border/50 last:border-0',
                    m.riskLevel === 'silo' ? 'bg-danger-accent/[0.03]' : m.riskLevel === 'moderate' ? 'bg-amber-accent/[0.02]' : '')}>
                    <td className="py-2.5 pr-4 font-medium text-foreground">{m.module}</td>
                    <td className="py-2.5 pr-4"><span className="text-foreground">{m.primaryOwner}</span> <span className="text-muted-foreground">({m.ownershipPercent}%)</span></td>
                    <td className="py-2.5 pr-4 text-foreground">{m.backupOwner ? `${m.backupOwner}` : <span className="text-danger-accent">—</span>}</td>
                    <td className="py-2.5 pr-4"><Badge variant="outline" className={cn('text-[10px]', riskBadge[m.riskLevel])}>{m.riskLevel}</Badge></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Progress value={m.documentationCoverage} className="h-1.5 flex-1" />
                        <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">{m.documentationCoverage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-glass-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">AI Insights</h2>
        <div className="space-y-3">
          {ownershipEnhancedData.insights.map((ins) => {
            const Icon = insightIcons[ins.severity];
            return (
              <div key={ins.id} className={cn('rounded-lg border-l-[3px] border border-glass-border bg-surface-inset p-3.5', insightBorder[ins.severity])}>
                <div className="flex items-start gap-2.5">
                  <Icon className={cn('h-4 w-4 mt-0.5 shrink-0',
                    ins.severity === 'critical' ? 'text-danger-accent' : ins.severity === 'warning' ? 'text-amber-accent' : 'text-electric')} />
                  <div><p className="text-sm font-semibold text-foreground">{ins.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ins.description}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recommended Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownershipEnhancedData.recommendations.map((r) => {
            const Icon = recIcons[r.action] ?? FileText;
            const view = recViews[r.action];
            const variant = r.action === 'assign-backup-owner' ? 'danger' as const : 'default' as const;
            return <ActionCard key={r.title} icon={Icon} title={r.title} description={r.description} variant={variant} onClick={view ? nav(view) : undefined} />;
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}