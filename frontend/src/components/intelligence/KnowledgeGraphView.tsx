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
  X,
  GitGraph,
  Link2,
  FolderTree,
  BrainCircuit,
  ShieldCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { knowledgeGraphNodes, knowledgeGraphEdges } from '@/mock/knowledge';
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from '@/types';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const categoryBorder: Record<string, string> = {
  Security: 'border-t-danger-accent',
  Architecture: 'border-t-electric',
  Data: 'border-t-emerald-accent',
  Infrastructure: 'border-t-purple-glow',
};

const categoryBadge: Record<string, string> = {
  Security: 'bg-danger-accent/10 text-danger-accent',
  Architecture: 'bg-electric/10 text-electric',
  Data: 'bg-emerald-accent/10 text-emerald-accent',
  Infrastructure: 'bg-purple-glow/10 text-purple-glow',
};

const categoryMiniMapColor: Record<string, string> = {
  Security: 'var(--danger-accent)',
  Architecture: 'var(--electric)',
  Data: 'var(--emerald-accent)',
  Infrastructure: 'var(--purple-glow)',
};

const clusterPositions: Record<string, { x: number; y: number }> = {
  'kg-auth': { x: 0, y: 0 },
  'kg-jwt': { x: 150, y: 80 },
  'kg-oauth': { x: 0, y: 160 },
  'kg-sessions': { x: 150, y: 160 },
  'kg-api-design': { x: 400, y: 0 },
  'kg-rest': { x: 600, y: 0 },
  'kg-middleware': { x: 400, y: 200 },
  'kg-graphql': { x: 600, y: 120 },
  'kg-database': { x: 0, y: 350 },
  'kg-orm': { x: 150, y: 350 },
  'kg-caching': { x: 0, y: 450 },
};

interface KGNodeData {
  label: string;
  category: string;
  weight: number;
  description: string;
}

function KnowledgeNodeComponent({ data, selected }: NodeProps) {
  const { label, category, weight } = data as unknown as KGNodeData;
  const isLarge = weight >= 85;
  const isMedium = weight >= 60 && !isLarge;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card shadow-lg backdrop-blur-sm border-t-[3px] transition-shadow',
        categoryBorder[category] ?? 'border-t-muted-foreground',
        isLarge ? 'min-w-[180px] p-3.5' : isMedium ? 'min-w-[150px] p-3' : 'min-w-[130px] p-2.5',
        selected && 'ring-2 ring-ring ring-offset-1 ring-offset-background'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={cn('text-xs font-semibold text-foreground truncate', isLarge && 'text-sm')}>
          {label}
        </span>
        <span className="ml-auto text-[10px] tabular-nums text-muted-foreground shrink-0">{weight}</span>
      </div>
      {isLarge && (
        <Badge className={cn('text-[10px] px-1.5 py-0', categoryBadge[category] ?? '')} variant="outline">
          {category}
        </Badge>
      )}
    </div>
  );
}

const nodeTypes = {
  knowledge: KnowledgeNodeComponent,
};

// @xyflow/react v12 + React 19 type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Flow = ReactFlow as any;

function getOwnershipInfo(category: string): { primary: string; secondary: string } {
  const map: Record<string, { primary: string; secondary: string }> = {
    Security: { primary: 'Sarah Chen', secondary: 'Alex Kim' },
    Architecture: { primary: 'Alex Rivera', secondary: 'Sarah Chen' },
    Data: { primary: 'Mike Okonkwo', secondary: 'Alex Rivera' },
    Infrastructure: { primary: 'Mike Okonkwo', secondary: 'Sarah Chen' },
  };
  return map[category] ?? { primary: 'Team', secondary: 'Team' };
}

function getRiskAssessment(weight: number, category: string): { label: string; className: string } {
  if (category === 'Security' && weight >= 80) return { label: 'Critical', className: 'bg-danger-accent/15 text-danger-accent' };
  if (weight >= 85) return { label: 'High', className: 'bg-amber-accent/15 text-amber-accent' };
  if (weight >= 70) return { label: 'Medium', className: 'bg-electric/15 text-electric' };
  return { label: 'Low', className: 'bg-emerald-accent/15 text-emerald-accent' };
}

export function KnowledgeGraphView() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const initialNodes: Node[] = knowledgeGraphNodes.map((n) => ({
    id: n.id,
    type: 'knowledge',
    position: clusterPositions[n.id] ?? { x: 0, y: 0 },
    data: {
      label: n.label,
      category: n.category,
      weight: n.weight,
      description: n.description,
    },
  }));

  const initialEdges: Edge[] = knowledgeGraphEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'default',
    animated: e.weight > 0.7,
    label: e.relationType,
    style: {
      stroke: e.weight > 0.7 ? 'var(--electric)' : 'var(--purple-glow)',
      strokeWidth: Math.max(1, Math.min(3, e.weight * 3)),
    },
    labelStyle: {
      fontSize: 10,
      fill: 'var(--muted-foreground)',
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: 'var(--card)',
      fillOpacity: 0.9,
    },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const filteredNodeIds = useMemo(() => {
    const lower = search.toLowerCase();
    return new Set(
      knowledgeGraphNodes
        .filter((n) => {
          const matchSearch = n.label.toLowerCase().includes(lower);
          const matchCat = filterCategory === 'all' || n.category === filterCategory;
          return matchSearch && matchCat;
        })
        .map((n) => n.id)
    );
  }, [search, filterCategory]);

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        hidden: filteredNodeIds.size > 0 && !filteredNodeIds.has(n.id),
      })),
    [nodes, filteredNodeIds]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        hidden: filteredNodeIds.size > 0 && !(filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)),
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

  const selectedNode = selectedNodeId
    ? knowledgeGraphNodes.find((n) => n.id === selectedNodeId)
    : null;

  const relatedEdges = selectedNodeId
    ? knowledgeGraphEdges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
    : [];

  const relatedNodes = useMemo(() => {
    if (!selectedNodeId) return [];
    const ids = new Set(
      relatedEdges.map((e) => (e.source === selectedNodeId ? e.target : e.source))
    );
    return knowledgeGraphNodes.filter((n) => ids.has(n.id));
  }, [selectedNodeId, relatedEdges]);

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Security', value: 'Security' },
    { label: 'Architecture', value: 'Architecture' },
    { label: 'Data', value: 'Data' },
    { label: 'Infrastructure', value: 'Infrastructure' },
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
        <h1 className="text-2xl font-bold tracking-tight gradient-text">Knowledge Graph™</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Visualize repository concepts and relationships.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search concepts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterCategory(opt.value)}
              className={cn(
                'px-2.5 py-1 text-[11px] rounded-md border transition-all duration-200',
                filterCategory === opt.value
                  ? 'border-electric/40 bg-electric/10 text-electric'
                  : 'border-glass-border bg-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* React Flow Knowledge Graph */}
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
            <Controls className="!bg-card !border !border-border !rounded-lg !shadow-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-muted-foreground [&>button:hover]:!text-foreground" />
            <MiniMap
              className="!bg-card !border !border-border !rounded-lg"
              nodeColor={(n) => categoryMiniMapColor[n.data?.category as string] ?? 'var(--muted-foreground)'}
              maskColor="rgba(0,0,0,0.6)"
            />
          </Flow>
        </div>

        {/* Concept Details Panel */}
        <AnimatePresence>
          {selectedNode && (
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
                  <h2 className="text-sm font-semibold text-foreground pr-6">{selectedNode.label}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge className={cn('text-[10px]', categoryBadge[selectedNode.category] ?? '')} variant="outline">
                      {selectedNode.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Weight: {selectedNode.weight}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.description}</p>

                <div>
                  <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
                    Related Concepts
                  </h3>
                  <div className="space-y-1.5">
                    {relatedNodes.map((rn) => {
                      const edge = relatedEdges.find(
                        (e) => (e.source === selectedNodeId && e.target === rn.id) || (e.target === selectedNodeId && e.source === rn.id)
                      );
                      return (
                        <div key={rn.id} className="flex items-center gap-2 text-xs">
                          <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', categoryBorder[rn.category]?.replace('border-t-', 'bg-') ?? 'bg-muted-foreground')} />
                          <span className="text-foreground font-medium truncate">{rn.label}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{edge?.relationType}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
                    Ownership
                  </h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {(() => {
                      const own = getOwnershipInfo(selectedNode.category);
                      return (
                        <>
                          <p>Primary: <span className="text-foreground font-medium">{own.primary}</span></p>
                          <p>Secondary: <span className="text-foreground font-medium">{own.secondary}</span></p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">Risk</h3>
                  <Badge className={cn('text-[10px]', getRiskAssessment(selectedNode.weight, selectedNode.category).className)} variant="outline">
                    {getRiskAssessment(selectedNode.weight, selectedNode.category).label}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Knowledge Statistics */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BrainCircuit, label: 'Knowledge Nodes', value: '12' },
          { icon: Link2, label: 'Relationships', value: '16' },
          { icon: FolderTree, label: 'Clusters', value: '4' },
          { icon: GitGraph, label: 'Concept Coverage', value: '78%' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl border border-glass-border p-4">
            <stat.icon className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground mt-0.5 tabular-nums">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}