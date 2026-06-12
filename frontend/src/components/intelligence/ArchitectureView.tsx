'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Search,
  Layers,
  Gauge,
  AlertTriangle,
  Link2,
  X,
  FileCode2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { architectureNodes, architectureEdges } from '@/mock/architecture';
import { ScoreCard } from '@/components/shared/ScoreCard';
import type { ArchitectureNode, ArchitectureEdge } from '@/types';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const typeAccent: Record<ArchitectureNode['type'], string> = {
  module: 'border-l-electric',
  service: 'border-l-purple-glow',
  component: 'border-l-emerald-accent',
  data: 'border-l-amber-accent',
  external: 'border-l-muted-foreground',
};

const typeBadge: Record<ArchitectureNode['type'], string> = {
  module: 'bg-electric/10 text-electric',
  service: 'bg-purple-glow/10 text-purple-glow',
  component: 'bg-emerald-accent/10 text-emerald-accent',
  data: 'bg-amber-accent/10 text-amber-accent',
  external: 'bg-muted/30 text-muted-foreground',
};

const edgeStyle: Record<ArchitectureEdge['type'], { stroke: string; animated: boolean; dash: string }> = {
  'api-call': { stroke: 'var(--electric)', animated: true, dash: 'none' },
  'data-flow': { stroke: 'var(--emerald-accent)', animated: false, dash: 'none' },
  dependency: { stroke: 'var(--amber-accent)', animated: false, dash: '8 4' },
  event: { stroke: 'var(--purple-glow)', animated: false, dash: '4 4' },
  imports: { stroke: 'var(--muted-foreground)', animated: false, dash: '2 4' },
};

const strengthDash: Record<ArchitectureEdge['strength'], string> = {
  strong: 'none',
  medium: '8 4',
  weak: '2 4',
};

const nodePositions: Record<string, { x: number; y: number }> = {
  'arch-cdn': { x: 400, y: 0 },
  'arch-frontend': { x: 0, y: 0 },
  'arch-api-gateway': { x: 200, y: 150 },
  'arch-auth-service': { x: 0, y: 300 },
  'arch-product-service': { x: 200, y: 300 },
  'arch-cart-service': { x: 400, y: 300 },
  'arch-order-service': { x: 0, y: 450 },
  'arch-payment-service': { x: 400, y: 450 },
  'arch-database': { x: 200, y: 600 },
  'arch-cache': { x: 400, y: 600 },
};

type ArchNodeData = {
  label: string;
  nodeType: ArchitectureNode['type'];
  complexity: number;
  connections: number;
};

function ArchitectureNodeComponent({ data, selected }: NodeProps) {
  const { label, nodeType, complexity, connections } = data as unknown as ArchNodeData;
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border border-border bg-card p-3 border-l-[3px] shadow-lg backdrop-blur-sm',
        typeAccent[nodeType],
        selected && 'ring-2 ring-ring ring-offset-1 ring-offset-background'
      )}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-foreground truncate">{label}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Badge className={cn('text-[10px] px-1.5 py-0', typeBadge[nodeType])} variant="outline">
          {nodeType}
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Complexity</span>
          <span className="tabular-nums">{complexity}/10</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted/30">
          <div
            className={cn(
              'h-full rounded-full',
              complexity > 7
                ? 'bg-danger-accent'
                : complexity > 5
                  ? 'bg-amber-accent'
                  : 'bg-emerald-accent'
            )}
            style={{ width: `${(complexity / 10) * 100}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground">
          {connections} connection{connections !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  architecture: ArchitectureNodeComponent,
};

// @xyflow/react v12 + React 19 type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Flow = ReactFlow as any;

function getRiskLevel(complexity: number): { label: string; className: string } {
  if (complexity > 7) return { label: 'Critical', className: 'bg-danger-accent/15 text-danger-accent' };
  if (complexity > 5) return { label: 'High', className: 'bg-amber-accent/15 text-amber-accent' };
  if (complexity > 3) return { label: 'Medium', className: 'bg-electric/15 text-electric' };
  return { label: 'Low', className: 'bg-emerald-accent/15 text-emerald-accent' };
}

export function ArchitectureView() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const initialNodes: Node[] = architectureNodes.map((n) => ({
    id: n.id,
    type: 'architecture',
    position: nodePositions[n.id] ?? { x: 0, y: 0 },
    data: {
      label: n.label,
      nodeType: n.type,
      description: n.description,
      complexity: n.complexity,
      connections: n.connections,
      files: n.files,
    },
  }));

  const initialEdges: Edge[] = architectureEdges.map((e) => {
    const cfg = edgeStyle[e.type];
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'default',
      animated: cfg.animated,
      style: {
        stroke: cfg.stroke,
        strokeWidth: e.strength === 'strong' ? 2 : e.strength === 'medium' ? 1.5 : 1,
        strokeDasharray: strengthDash[e.strength],
      },
    };
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const filteredNodeIds = useMemo(() => {
    const lower = search.toLowerCase();
    return new Set(
      architectureNodes
        .filter((n) => {
          const matchSearch = n.label.toLowerCase().includes(lower);
          const matchType = filterType === 'all' || n.type === filterType;
          return matchSearch && matchType;
        })
        .map((n) => n.id)
    );
  }, [search, filterType]);

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: filteredNodeIds.size === 0 || filteredNodeIds.has(n.id) ? 1 : 0.25,
          transition: 'opacity 0.3s ease',
        },
      })),
    [nodes, filteredNodeIds]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        style: {
          ...e.style,
          opacity: filteredNodeIds.size === 0 || (filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)) ? 1 : 0.1,
          transition: 'opacity 0.3s ease',
        },
      })),
    [edges, filteredNodeIds]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const selectedNodeData = selectedNodeId
    ? architectureNodes.find((n) => n.id === selectedNodeId)
    : null;

  const selectedNodeEdges = selectedNodeId
    ? architectureEdges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
    : [];

  const filterOptions: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Module', value: 'module' },
    { label: 'Service', value: 'service' },
    { label: 'Component', value: 'component' },
    { label: 'Data', value: 'data' },
    { label: 'External', value: 'external' },
  ];

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Hero */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight gradient-text">Architecture Graph™</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Automatically generated repository architecture.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={cn(
                'px-2.5 py-1 text-[11px] rounded-md border transition-all duration-200',
                filterType === opt.value
                  ? 'border-electric/40 bg-electric/10 text-electric'
                  : 'border-glass-border bg-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* React Flow Graph */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-xl border border-glass-border overflow-hidden relative"
      >
        <div className="min-h-[500px] md:min-h-[600px] h-[600px]">
          <Flow
            nodes={styledNodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick as any}
            onPaneClick={onPaneClick as any}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            className="bg-background"
          >
            <Background gap={20} size={1} className="!opacity-20" />
            <Controls
              className="!bg-card !border !border-border !rounded-lg !shadow-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-muted-foreground [&>button:hover]:!text-foreground"
            />
            <MiniMap
              className="!bg-card !border !border-border !rounded-lg"
              nodeColor={(n) => {
                const t = n.data?.nodeType as ArchitectureNode['type'] | undefined;
                if (t === 'service') return 'var(--purple-glow)';
                if (t === 'component') return 'var(--emerald-accent)';
                if (t === 'data') return 'var(--amber-accent)';
                if (t === 'external') return 'var(--muted-foreground)';
                return 'var(--electric)';
              }}
              maskColor="rgba(0,0,0,0.6)"
            />
          </Flow>
        </div>

        {/* Node Details Panel */}
        <AnimatePresence>
          {selectedNodeData && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-full sm:w-80 border-l border-glass-border bg-card/95 backdrop-blur-xl p-4 overflow-auto z-10"
            >
              <button
                onClick={() => setSelectedNodeId(null)}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground pr-6">{selectedNodeData.label}</h2>
                  <Badge className={cn('mt-1.5 text-[10px]', typeBadge[selectedNodeData.type])} variant="outline">
                    {selectedNodeData.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedNodeData.description}</p>

                <div>
                  <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
                    Connected Systems
                  </h3>
                  <div className="space-y-1">
                    {selectedNodeEdges.map((e) => {
                      const otherId = e.source === selectedNodeId ? e.target : e.source;
                      const other = architectureNodes.find((n) => n.id === otherId);
                      return other ? (
                        <div key={e.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: edgeStyle[e.type].stroke }}
                          />
                          <span className="truncate">{other.label}</span>
                          <span className="ml-auto text-[10px] opacity-60">{e.type}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Dependencies</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">{selectedNodeData.connections}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Complexity</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">{selectedNodeData.complexity}/10</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Risk</p>
                    <Badge className={cn('text-[10px]', getRiskLevel(selectedNodeData.complexity).className)} variant="outline">
                      {getRiskLevel(selectedNodeData.complexity).label}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
                    Files
                  </h3>
                  <div className="space-y-1">
                    {selectedNodeData.files.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileCode2 className="h-3 w-3 shrink-0" />
                        <code className="truncate text-[11px]">{f}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Architecture Summary */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: Layers, label: 'Layers', value: '3', sub: 'Presentation / Logic / Data' },
          { icon: Gauge, label: 'Complexity', value: '7.2/10', sub: 'Average across modules' },
          { icon: Link2, label: 'Coupling', value: 'High', sub: 'Many cross-service calls' },
          { icon: AlertTriangle, label: 'Critical Systems', value: '3', sub: 'Auth, Payment, Order' },
          { icon: AlertTriangle, label: 'Bottleneck', value: 'API Gateway', sub: '6 downstream connections' },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-xl border border-glass-border p-4">
            <item.icon className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="max-w-xs">
        <ScoreCard
          label="Architecture Complexity Score"
          score={72}
          max={100}
          description="Moderate architectural complexity with room for improvement in service decoupling."
        />
      </motion.div>
    </motion.div>
  );
}