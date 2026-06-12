'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  BookOpen,
  CheckCircle2,
  Loader2,
  Building2,
  CreditCard,
  BarChart3,
  Globe,
  FileSearch,
  Download,
  Copy,
  Search,
  AlertTriangle,
  Layers,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  Mock doc items (kept local since used only here)                  */
/* ------------------------------------------------------------------ */
const docs = [
  { title: 'Authentication Module Documentation', description: 'Comprehensive documentation covering JWT token lifecycle, OAuth callback flows, session management, RBAC permission matrix, and MFA enrollment. Includes sequence diagrams and inline code references.', icon: Building2, status: 'generated' as const, lastUpdated: '2025-01-14T09:45:00Z', pages: 24, modules: ['Authentication', 'API Gateway'] },
  { title: 'Payment Processing Documentation', description: 'Detailed documentation of Stripe integration, webhook signature verification, idempotency key management, refund handling, and partial capture logic. Includes error scenarios and recovery procedures.', icon: CreditCard, status: 'generated' as const, lastUpdated: '2025-01-14T09:45:00Z', pages: 18, modules: ['Payment Processing'] },
  { title: 'Data Pipeline Architecture', description: 'Documentation of the Airflow DAG scheduling, data quality checks, alerting thresholds, and backfill procedures. Covers schema evolution strategy and data lineage for all 5 DAGs.', icon: BarChart3, status: 'generated' as const, lastUpdated: '2025-01-14T09:45:00Z', pages: 32, modules: ['Data Pipeline'] },
  { title: 'API Reference', description: 'Auto-generated API reference from Zod schemas and route handlers. Covers all REST endpoints, request/response types, authentication requirements, and rate limits.', icon: Globe, status: 'pending' as const, lastUpdated: '2025-01-13T14:00:00Z', pages: 45, modules: ['API Gateway'] },
  { title: 'Architecture Decision Records', description: 'Six ADRs documenting major architectural decisions: framework selection, authentication approach, database choice, caching strategy, deployment pipeline, and API design patterns.', icon: FileSearch, status: 'pending' as const, lastUpdated: null, pages: 12, modules: ['Architecture'] },
];

/* ------------------------------------------------------------------ */
/*  API endpoints for the API Docs tab                                */
/* ------------------------------------------------------------------ */
const apiEndpoints = [
  { method: 'GET', path: '/api/products', description: 'List products with pagination, filtering, and sorting', auth: false },
  { method: 'GET', path: '/api/products/:id', description: 'Retrieve full product details including variants and inventory', auth: false },
  { method: 'POST', path: '/api/cart/items', description: 'Add item to shopping cart or update quantity', auth: true },
  { method: 'POST', path: '/api/orders', description: 'Create a new order from cart contents with Stripe checkout', auth: true },
  { method: 'POST', path: '/api/webhooks/stripe', description: 'Handle Stripe webhook events for payment state changes', auth: false },
  { method: 'POST', path: '/api/auth/login', description: 'Authenticate user and issue JWT access/refresh tokens', auth: false },
] as const;

const methodColor: Record<string, string> = {
  GET: 'bg-emerald-accent/15 text-emerald-accent',
  POST: 'bg-electric/15 text-electric',
  PUT: 'bg-amber-accent/15 text-amber-accent',
  DELETE: 'bg-danger-accent/15 text-danger-accent',
};

/* ------------------------------------------------------------------ */
/*  Onboarding days                                                   */
/* ------------------------------------------------------------------ */
const onboardingDays = [
  { day: 1, title: 'Environment Setup', description: 'Clone the repository, install dependencies with bun, configure environment variables, start MongoDB and Redis locally, and verify the development server runs successfully.' },
  { day: 2, title: 'Architecture Walkthrough', description: 'Review the project directory structure, understand the modular monolith layout, trace a request from frontend through middleware to database, and study the shared component library.' },
  { day: 3, title: 'Core Module Deep Dive', description: 'Select your assigned module, read the relevant documentation, trace the code flow end-to-end, and complete the module-specific knowledge checklist.' },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */
function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="group relative my-3 rounded-lg border border-glass-border bg-surface-inset p-4 font-mono text-xs leading-relaxed text-foreground overflow-x-auto">
      <button className="absolute top-2 right-2 rounded-md border border-glass-border bg-surface-elevated px-2 py-1 text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        Copy
      </button>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function DocumentationView() {
  const [searchQuery, setSearchQuery] = useState('');

  const generatedCount = docs.filter((d) => d.status === 'generated').length;
  const pendingCount = docs.length - generatedCount;
  const totalPages = docs.reduce((sum, d) => sum + d.pages, 0);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ---- Page Header ---- */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Generated documentation for the repository. The agent analyzes source code, git history,
          and existing knowledge entries to produce comprehensive documentation that fills the most
          critical knowledge gaps.
        </p>
      </motion.div>

      {/* ---- Health Metrics ---- */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <ProgressRing value={62} max={100} size={48} strokeWidth={4} />
          <div>
            <p className="text-lg font-bold text-foreground">62%</p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-accent/15">
            <CheckCircle2 className="h-5 w-5 text-emerald-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{generatedCount}</p>
            <p className="text-[10px] text-muted-foreground">Generated</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-accent/15">
            <Loader2 className="h-5 w-5 text-amber-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{pendingCount}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-glass-border p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/15">
            <BookOpen className="h-5 w-5 text-electric" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{totalPages}</p>
            <p className="text-[10px] text-muted-foreground">Total Pages</p>
          </div>
        </div>
      </motion.div>

      {/* ---- Search & Export Bar ---- */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-9 bg-surface-inset border-glass-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-glass-border">
            <Download className="h-4 w-4 mr-1" />
            Export All
          </Button>
          <Button variant="outline" size="sm" className="border-glass-border">
            <Copy className="h-4 w-4 mr-1" />
            Copy to Clipboard
          </Button>
        </div>
      </motion.div>

      {/* ---- Tabbed Documentation ---- */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="readme" className="space-y-4">
          <TabsList className="bg-surface-inset border border-glass-border">
            <TabsTrigger value="readme">README</TabsTrigger>
            <TabsTrigger value="architecture">Architecture Docs</TabsTrigger>
            <TabsTrigger value="api">API Docs</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding Guide</TabsTrigger>
            <TabsTrigger value="modules">Module Documentation</TabsTrigger>
          </TabsList>

          {/* ---- README Tab ---- */}
          <TabsContent value="readme">
            <div className="glass-card rounded-xl border border-glass-border p-6 space-y-4 max-w-3xl">
              <h2 className="text-lg font-bold text-foreground">Next.js Commerce Platform</h2>

              <h3 className="text-sm font-semibold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A full-featured e-commerce platform built with Next.js 14, TypeScript, and MongoDB.
                Features include JWT authentication, Stripe payment processing, real-time inventory
                management, and an admin dashboard with analytics.
              </p>

              <h3 className="text-sm font-semibold text-foreground">Getting Started</h3>
              <h4 className="text-xs font-semibold text-muted-foreground">Prerequisites</h4>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 ml-2">
                <li>Node.js 20+</li>
                <li>MongoDB 7+</li>
                <li>Redis 7+</li>
                <li>Stripe account</li>
              </ul>

              <h4 className="text-xs font-semibold text-muted-foreground">Installation</h4>
              <CodeBlock>
                <code>{`git clone https://github.com/acme-corp/nextjs-commerce.git\ncd nextjs-commerce\nbun install\nbun run dev`}</code>
              </CodeBlock>

              <h4 className="text-xs font-semibold text-muted-foreground">Environment Variables</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create a <code className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px] font-mono">.env.local</code>{' '}
                file with the following variables:
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 ml-2">
                <li><code className="font-mono text-[10px]">MONGODB_URI</code> &mdash; MongoDB connection string</li>
                <li><code className="font-mono text-[10px]">JWT_SECRET</code> &mdash; Secret key for JWT token signing</li>
                <li><code className="font-mono text-[10px]">STRIPE_SECRET_KEY</code> &mdash; Stripe API secret key</li>
                <li><code className="font-mono text-[10px]">REDIS_URL</code> &mdash; Redis connection URL</li>
              </ul>

              <h3 className="text-sm font-semibold text-foreground">Architecture</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The platform follows a modular monolith architecture with clear separation between
                the frontend, API layer, services, and data access layers. Each domain module
                encapsulates its own routes, services, models, and utility functions.
              </p>
            </div>
          </TabsContent>

          {/* ---- Architecture Docs Tab ---- */}
          <TabsContent value="architecture">
            <div className="space-y-4 max-w-3xl">
              <div className="glass-card rounded-xl border border-glass-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">System Architecture Overview</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  The application is structured as a modular monolith using Next.js App Router. The
                  frontend communicates with API routes that follow REST conventions supplemented by
                  tRPC for type-safe internal calls. MongoDB serves as the primary datastore, with
                  Redis handling caching, session management, and rate limiting.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each domain module lives under <code className="font-mono text-[10px] rounded bg-surface-inset px-1.5 py-0.5">src/modules/</code>{' '}
                  and encapsulates routes, services, schemas, and utilities. Shared code lives under{' '}
                  <code className="font-mono text-[10px] rounded bg-surface-inset px-1.5 py-0.5">src/lib/</code>.
                </p>
              </div>

              <div className="glass-card rounded-xl border border-glass-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Module Dependency Diagram</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive diagram available in Architecture Graph.
                </p>
              </div>

              <div className="glass-card rounded-xl border border-glass-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">API Design Patterns</h3>
                <ul className="space-y-2">
                  {[
                    'REST API with Zod request/response validation',
                    'tRPC for type-safe internal service-to-service calls',
                    'Webhook pattern for asynchronous external events (Stripe)',
                    'Repository pattern with Mongoose ODM abstraction layer',
                  ].map((pattern) => (
                    <li key={pattern} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3 mt-0.5 shrink-0 text-electric" />
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-xl border border-glass-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Data Flow Architecture</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Client requests enter through Next.js middleware where authentication and rate
                  limiting are applied. Validated requests route to module-specific handlers, which
                  orchestrate service-layer business logic. Services interact with Mongoose models
                  for data access, with Redis caching applied at the repository level using a
                  cache-aside pattern.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ---- API Docs Tab ---- */}
          <TabsContent value="api">
            <div className="glass-card rounded-xl border border-glass-border p-6 max-w-3xl">
              <h3 className="text-sm font-semibold text-foreground mb-4">API Endpoints</h3>
              <div className="space-y-2">
                {apiEndpoints.map((ep) => (
                  <div
                    key={ep.path}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-glass-border bg-surface-inset p-3"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('rounded px-2 py-0.5 text-[10px] font-bold', methodColor[ep.method])}>
                        {ep.method}
                      </span>
                      <code className="text-xs font-mono text-foreground">{ep.path}</code>
                    </div>
                    <p className="text-xs text-muted-foreground flex-1">{ep.description}</p>
                    {ep.auth && (
                      <Badge variant="outline" className="shrink-0 text-[10px] bg-electric/15 text-electric border-0">
                        <Lock className="h-2.5 w-2.5 mr-0.5" />
                        Auth
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ---- Onboarding Guide Tab ---- */}
          <TabsContent value="onboarding">
            <div className="grid gap-3 max-w-3xl">
              {onboardingDays.map((d) => (
                <div key={d.day} className="glass-card rounded-xl border border-glass-border p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/15 text-electric font-bold text-xs">
                      {d.day}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Day {d.day}: {d.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ---- Module Documentation Tab ---- */}
          <TabsContent value="modules">
            <div className="space-y-3">
              {docs.map((doc) => {
                const isGenerated = doc.status === 'generated';
                return (
                  <motion.div
                    key={doc.title}
                    variants={fadeUp}
                    className="glass-card glass-card-hover rounded-xl border border-glass-border p-5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          isGenerated ? 'bg-emerald-accent/15' : 'bg-amber-accent/15',
                        )}
                      >
                        <doc.icon
                          className={cn(
                            'h-5 w-5',
                            isGenerated ? 'text-emerald-accent' : 'text-amber-accent',
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              isGenerated
                                ? 'bg-emerald-accent/15 text-emerald-accent'
                                : 'bg-amber-accent/15 text-amber-accent',
                            )}
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {doc.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>~{doc.pages} pages</span>
                          </div>
                          {doc.lastUpdated && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Updated {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex gap-1.5">
                            {doc.modules.map((mod) => (
                              <span key={mod} className="rounded bg-surface-inset px-1.5 py-0.5 text-[10px]">
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 border-glass-border text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ---- Missing Sections Alert ---- */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl border border-amber-accent/30 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-accent shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {pendingCount} documentation sections require attention
            </h3>
            <ul className="space-y-1">
              {docs
                .filter((d) => d.status === 'pending')
                .map((d) => (
                  <li key={d.title} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-accent" />
                    {d.title}{' '}
                    <Badge variant="outline" className="text-[10px] bg-amber-accent/15 text-amber-accent border-0">
                      pending
                    </Badge>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
