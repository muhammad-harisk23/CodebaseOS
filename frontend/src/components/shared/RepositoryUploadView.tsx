'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  GitBranch,
  Upload,
  FileCode,
  Cpu,
  Layers,
  Share2,
  Brain,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TimelineCard } from '@/components/shared/TimelineCard';
import { repositoryDetail } from '@/mock/repository-detail';
import { repositories } from '@/mock/repositories';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

type UploadTab = 'github' | 'gitlab' | 'zip';
type UploadState = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'failed';

const pipelineSteps = [
  { label: 'Repository Connected', icon: GitBranch, status: 'completed' as const, desc: 'Successfully cloned the target repository.' },
  { label: 'Repository Parsing', icon: FileCode, status: 'completed' as const, desc: 'Scanned 1,847 files and directory structure.' },
  { label: 'AST Analysis', icon: Cpu, status: 'completed' as const, desc: 'Abstract syntax trees built for all source files.' },
  { label: 'Chunk Generation', icon: Layers, status: 'active' as const, desc: 'Splitting code into semantic knowledge chunks.' },
  { label: 'Knowledge Graph Creation', icon: Share2, status: 'pending' as const, desc: 'Building relationships between code entities.' },
  { label: 'Repository Memory Created', icon: Brain, status: 'pending' as const, desc: 'Generating persistent repository memory.' },
  { label: 'Analysis Complete', icon: CheckCircle2, status: 'pending' as const, desc: 'Full analysis pipeline finished.' },
];

const detailCards = [
  { label: 'Language', value: repositoryDetail.language },
  { label: 'Framework', value: repositoryDetail.framework },
  { label: 'Database', value: repositoryDetail.database },
  { label: 'Authentication', value: repositoryDetail.authentication },
];

const metricsCards = [
  { label: 'Lines of Code', value: repositoryDetail.linesOfCode.toLocaleString() },
  { label: 'Modules', value: String(repositoryDetail.modules) },
  { label: 'Services', value: String(repositoryDetail.services) },
  { label: 'APIs', value: String(repositoryDetail.apis) },
  { label: 'Entities', value: String(repositoryDetail.entities) },
];

const statusColors: Record<string, string> = {
  complete: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  analyzing: 'bg-electric/15 text-electric border-electric/30',
  queued: 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  error: 'bg-danger-accent/15 text-danger-accent border-danger-accent/30',
};

export function RepositoryUploadView() {
  const { setCurrentView } = useAppStore();
  const [tab, setTab] = useState<UploadTab>('github');
  const [repoUrl, setRepoUrl] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeStep, setActiveStep] = useState(3);
  const [options, setOptions] = useState({
    depth: 'full' as 'quick' | 'standard' | 'full',
    knowledgeGraph: true,
    riskAnalysis: true,
  });

  const handleStartAnalysis = useCallback(() => {
    setUploadState('uploading');
    setTimeout(() => setUploadState('analyzing'), 2000);
  }, []);

  useEffect(() => {
    if (uploadState !== 'analyzing') return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setUploadState('completed'), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [uploadState]);

  const getStepStatus = (idx: number) => {
    if (idx < activeStep) return 'completed' as const;
    if (idx === activeStep) return 'active' as const;
    return 'pending' as const;
  };

  const recentRepos = repositories.slice(0, 3);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Analyze Any Repository
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Upload a repository and transform it into organizational knowledge.
        </p>
      </motion.div>

      {/* Hero Card */}
      <motion.div variants={fadeUp} className="glass-card glow-blue rounded-xl border border-glass-border p-6 space-y-5">
        {/* Upload Tabs */}
        <div className="flex gap-2">
          {([
            { key: 'github' as UploadTab, label: 'GitHub Repository', icon: Github },
            { key: 'gitlab' as UploadTab, label: 'GitLab Repository', icon: GitBranch },
            { key: 'zip' as UploadTab, label: 'ZIP Upload', icon: Upload },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                tab === t.key
                  ? 'border-electric/50 bg-electric/10 text-electric'
                  : 'border-glass-border bg-glass text-muted-foreground hover:text-foreground'
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab !== 'zip' ? (
            <motion.div
              key="git-input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <Label className="text-xs text-muted-foreground">
                {tab === 'github' ? 'GitHub Repository URL' : 'GitLab Repository URL'}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    tab === 'github'
                      ? 'https://github.com/organization/repository'
                      : 'https://gitlab.com/organization/repository'
                  }
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-surface-inset border-glass-border"
                />
                <Button size="sm" className="shrink-0">
                  {tab === 'github' ? <Github className="h-3.5 w-3.5 mr-1.5" /> : <GitBranch className="h-3.5 w-3.5 mr-1.5" />}
                  Connect Repository
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="zip-drop"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
              className={cn(
                'rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer',
                isDragOver ? 'border-electric/60 bg-electric/5' : 'border-glass-border hover:border-electric/30'
              )}
            >
              <Upload className={cn('h-8 w-8 mx-auto mb-3', isDragOver ? 'text-electric' : 'text-muted-foreground')} />
              <p className="text-sm font-medium text-foreground">Drop repository archive here</p>
              <p className="text-xs text-muted-foreground mt-1">.zip, .tar.gz</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Options */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs">Analysis Depth</Label>
            <div className="flex gap-2">
              {(['quick', 'standard', 'full'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setOptions((o) => ({ ...o, depth: d }))}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                    options.depth === d
                      ? 'border-electric/50 bg-electric/10 text-electric'
                      : 'border-glass-border bg-glass text-muted-foreground hover:text-foreground'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-foreground">Enable Knowledge Graph</p>
              <p className="text-[10px] text-muted-foreground">Build interactive knowledge graph from code analysis</p>
            </div>
            <Switch
              checked={options.knowledgeGraph}
              onCheckedChange={(v) => setOptions((o) => ({ ...o, knowledgeGraph: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-foreground">Enable Risk Analysis</p>
              <p className="text-[10px] text-muted-foreground">Detect knowledge debt, bus factor risks, and security issues</p>
            </div>
            <Switch
              checked={options.riskAnalysis}
              onCheckedChange={(v) => setOptions((o) => ({ ...o, riskAnalysis: v }))}
            />
          </div>
        </div>

        {/* Start Button */}
        <Button className="w-full" onClick={handleStartAnalysis}>
          Start Analysis
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </motion.div>

      {/* State Machine */}
      <AnimatePresence mode="wait">
        {uploadState === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card rounded-xl border border-glass-border p-6 space-y-3"
          >
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-electric animate-pulse" />
              <p className="text-sm font-medium text-foreground">Connecting to repository...</p>
            </div>
            <Progress value={45} className="h-1.5 [&>div]:bg-electric" />
            <p className="text-[10px] text-muted-foreground">Establishing secure connection and cloning repository files.</p>
          </motion.div>
        )}

        {uploadState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card rounded-xl border border-glass-border p-6 space-y-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-electric" />
              <h2 className="text-sm font-semibold text-foreground">Analysis Pipeline</h2>
              <Badge variant="outline" className="ml-auto text-[10px] border-electric/40 text-electric">
                In Progress
              </Badge>
            </div>
            {pipelineSteps.map((step, idx) => (
              <TimelineCard
                key={step.label}
                step={idx + 1}
                title={step.label}
                description={step.desc}
                status={getStepStatus(idx)}
                icon={step.icon}
              />
            ))}
          </motion.div>
        )}

        {uploadState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            variants={stagger}
            className="space-y-5"
          >
            <motion.div variants={fadeUp}>
              <div className="glass-card glow-emerald rounded-xl border border-emerald-accent/30 p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-accent">Analysis Complete</p>
                  <p className="text-xs text-muted-foreground">Repository has been fully analyzed and indexed.</p>
                </div>
              </div>
            </motion.div>

            {/* Row 1 - Tech details */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {detailCards.map((card) => (
                <div key={card.label} className="glass-card rounded-xl border border-glass-border p-4 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{card.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Row 2 - Metrics */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {metricsCards.map((card) => (
                <div key={card.label} className="glass-card rounded-xl border border-glass-border p-4 text-center">
                  <p className="text-[10px] text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-lg font-bold gradient-text">{card.value}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button
                className="w-full"
                onClick={() => setCurrentView('repository-analysis')}
              >
                View Full Analysis
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {uploadState === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card glow-danger rounded-xl border border-danger-accent/30 p-6 space-y-4 text-center"
          >
            <AlertTriangle className="h-8 w-8 mx-auto text-danger-accent" />
            <div>
              <p className="text-sm font-medium text-danger-accent">Analysis Failed</p>
              <p className="text-xs text-muted-foreground mt-1">
                Unable to connect to the repository. Please check the URL and try again.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => { setUploadState('idle'); setActiveStep(3); }}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Uploads */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Uploads</h2>
        {recentRepos.map((repo) => (
          <div
            key={repo.id}
            className="glass-card glass-card-hover rounded-xl border border-glass-border p-4 flex items-center gap-4 transition-all duration-300"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric/15">
              <GitBranch className="h-5 w-5 text-electric" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{repo.name}</p>
              <p className="text-[10px] text-muted-foreground">{repo.files} files analyzed</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(repo.lastAnalyzed).toLocaleDateString()}
              </div>
              <Badge variant="outline" className={cn('text-[10px]', statusColors[repo.status])}>
                {repo.status}
              </Badge>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}