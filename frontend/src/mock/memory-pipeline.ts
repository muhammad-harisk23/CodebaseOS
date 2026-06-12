// Mock data for Memory Engine / Memory Pipeline page

interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  itemsProcessed: number;
  totalItems: number;
}

interface MemoryStat {
  label: string;
  value: number;
  unit: string;
  icon: string;
}

interface ContextLossMetric {
  label: string;
  coverage: number;
  description: string;
}

interface KnowledgeChunk {
  id: string;
  sourceFile: string;
  module: string;
  summary: string;
  relationships: number;
  status: 'indexed' | 'processing' | 'pending';
  tokens: number;
}

interface MemoryInsight {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

export const memoryPipelineStages: PipelineStage[] = [
  {
    id: 'stage-1',
    label: 'Repository Parsing',
    description: 'Scanning and parsing all source files, configuration files, and directory structure to build an initial repository map.',
    status: 'completed',
    itemsProcessed: 1847,
    totalItems: 1847,
  },
  {
    id: 'stage-2',
    label: 'Chunk Generation',
    description: 'Splitting parsed source code into semantically meaningful chunks based on functions, classes, modules, and logical boundaries.',
    status: 'completed',
    itemsProcessed: 892,
    totalItems: 892,
  },
  {
    id: 'stage-3',
    label: 'AST Analysis',
    description: 'Building abstract syntax trees for each chunk to extract type definitions, function signatures, and code structure metadata.',
    status: 'completed',
    itemsProcessed: 892,
    totalItems: 892,
  },
  {
    id: 'stage-4',
    label: 'Dependency Mapping',
    description: 'Resolving import chains, module dependencies, and cross-references between code chunks to build the dependency graph.',
    status: 'completed',
    itemsProcessed: 3421,
    totalItems: 3421,
  },
  {
    id: 'stage-5',
    label: 'Knowledge Graph',
    description: 'Constructing the knowledge graph by connecting concepts, entities, and their relationships extracted from AST and dependency analysis.',
    status: 'completed',
    itemsProcessed: 1247,
    totalItems: 1247,
  },
  {
    id: 'stage-6',
    label: 'Embedding Creation',
    description: 'Generating vector embeddings for each knowledge chunk to enable semantic search and context-aware retrieval.',
    status: 'active',
    itemsProcessed: 1342,
    totalItems: 1564,
  },
  {
    id: 'stage-7',
    label: 'Repository Memory Store',
    description: 'Persisting all indexed knowledge, embeddings, and metadata into the vector database for fast retrieval during conversations.',
    status: 'pending',
    itemsProcessed: 0,
    totalItems: 1,
  },
];

export const memoryStatistics: MemoryStat[] = [
  { label: 'Files Indexed', value: 1847, unit: 'files', icon: 'FileText' },
  { label: 'Modules Indexed', value: 12, unit: 'modules', icon: 'FolderTree' },
  { label: 'Services Indexed', value: 8, unit: 'services', icon: 'Server' },
  { label: 'APIs Indexed', value: 47, unit: 'endpoints', icon: 'Plug' },
  { label: 'Entities Indexed', value: 23, unit: 'models', icon: 'Database' },
  { label: 'Knowledge Chunks', value: 892, unit: 'chunks', icon: 'Puzzle' },
  { label: 'Embeddings Generated', value: 1564, unit: 'vectors', icon: 'Brain' },
  { label: 'Context Coverage', value: 87, unit: '%', icon: 'ShieldCheck' },
];

export const contextLossMetrics: ContextLossMetric[] = [
  {
    label: 'Repository Coverage',
    coverage: 94,
    description: 'Percentage of repository files successfully parsed and indexed into the memory engine.',
  },
  {
    label: 'Memory Coverage',
    coverage: 87,
    description: 'Overall knowledge captured across all code modules, services, and business logic paths.',
  },
  {
    label: 'Relationship Coverage',
    coverage: 78,
    description: 'Cross-module dependencies and inter-service relationships that have been mapped and indexed.',
  },
  {
    label: 'Dependency Coverage',
    coverage: 91,
    description: 'Third-party and internal package dependencies resolved and linked to their usage sites.',
  },
  {
    label: 'Business Logic Coverage',
    coverage: 72,
    description: 'Complex business rules, conditional flows, and domain-specific logic that has been fully understood and indexed.',
  },
];

export const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'chunk-1',
    sourceFile: 'src/lib/auth/jwt.ts',
    module: 'Authentication',
    summary: 'JWT token generation, verification, and refresh logic using HS256 signing with configurable expiry times.',
    relationships: 14,
    status: 'indexed',
    tokens: 1823,
  },
  {
    id: 'chunk-2',
    sourceFile: 'src/app/api/stripe/webhooks/route.ts',
    module: 'Payments',
    summary: 'Stripe webhook handler processing payment_intent.succeeded, charge.failed, and customer.subscription events.',
    relationships: 11,
    status: 'indexed',
    tokens: 2456,
  },
  {
    id: 'chunk-3',
    sourceFile: 'src/lib/db/models/User.ts',
    module: 'Database',
    summary: 'Mongoose User schema with bcrypt password hashing, role-based fields (admin, customer, vendor), and timestamp tracking.',
    relationships: 9,
    status: 'indexed',
    tokens: 1456,
  },
  {
    id: 'chunk-4',
    sourceFile: 'src/middleware.ts',
    module: 'Architecture',
    summary: 'Next.js middleware handling route protection, JWT validation, rate limiting, and request logging for API routes.',
    relationships: 18,
    status: 'indexed',
    tokens: 2104,
  },
  {
    id: 'chunk-5',
    sourceFile: 'src/lib/cache/redis-client.ts',
    module: 'Infrastructure',
    summary: 'Redis client configuration with connection pooling, cache-aside pattern implementation, and TTL-based invalidation strategies.',
    relationships: 16,
    status: 'indexed',
    tokens: 1678,
  },
  {
    id: 'chunk-6',
    sourceFile: 'src/app/api/products/route.ts',
    module: 'Products',
    summary: 'Product listing API with pagination, filtering by category/price/rating, full-text search, and response caching.',
    relationships: 12,
    status: 'indexed',
    tokens: 1932,
  },
  {
    id: 'chunk-7',
    sourceFile: 'src/lib/stripe/checkout-session.ts',
    module: 'Payments',
    summary: 'Stripe checkout session creation with line items, tax calculation, discount code application, and success/cancel URL routing.',
    relationships: 8,
    status: 'indexed',
    tokens: 1543,
  },
  {
    id: 'chunk-8',
    sourceFile: 'src/lib/db/models/Order.ts',
    module: 'Database',
    summary: 'Order Mongoose schema with line items, shipping address, payment status enum, and order lifecycle state machine transitions.',
    relationships: 13,
    status: 'indexed',
    tokens: 2015,
  },
  {
    id: 'chunk-9',
    sourceFile: 'src/app/api/cart/route.ts',
    module: 'Cart',
    summary: 'Shopping cart API supporting add, remove, update quantity, merge guest cart, and apply promotional codes with stock validation.',
    relationships: 10,
    status: 'indexed',
    tokens: 1789,
  },
  {
    id: 'chunk-10',
    sourceFile: 'src/lib/email/transactional.ts',
    module: 'Notifications',
    summary: 'Transactional email service with SendGrid integration for order confirmations, shipping updates, and password reset flows.',
    relationships: 7,
    status: 'indexed',
    tokens: 1234,
  },
  {
    id: 'chunk-11',
    sourceFile: 'src/lib/search/elasticsearch-client.ts',
    module: 'Search',
    summary: 'Elasticsearch client wrapper for product search indexing with fuzzy matching, faceted filters, and synonym expansion.',
    relationships: 9,
    status: 'processing',
    tokens: 1654,
  },
  {
    id: 'chunk-12',
    sourceFile: 'src/app/api/analytics/route.ts',
    module: 'Analytics',
    summary: 'Analytics aggregation endpoint computing daily active users, conversion funnels, revenue metrics, and top product performance.',
    relationships: 6,
    status: 'pending',
    tokens: 1456,
  },
];

export const memoryInsights: MemoryInsight[] = [
  {
    id: 'insight-1',
    title: 'Authentication flow fully indexed',
    description:
      'The complete JWT authentication pipeline including token generation, validation, refresh, and middleware integration has been fully indexed across 14 related files.',
    type: 'success',
  },
  {
    id: 'insight-2',
    title: 'Payment processing mapped end-to-end',
    description:
      'Stripe checkout sessions, webhook handlers, refund logic, and subscription management are linked across 8 files with clear data flow mapping.',
    type: 'success',
  },
  {
    id: 'insight-3',
    title: 'Database schema relationships partially mapped',
    description:
      'Core entities (User, Order, Product) are well-indexed, but vendor and inventory sub-schemas have fewer cross-references than expected. 78% relationship coverage.',
    type: 'warning',
  },
  {
    id: 'insight-4',
    title: 'Caching layer cross-references complete',
    description:
      'Redis caching strategies including cache-aside, write-through for product data, and session caching are fully mapped with 16 dependency links.',
    type: 'info',
  },
  {
    id: 'insight-5',
    title: 'Search indexing module still processing',
    description:
      'The Elasticsearch integration and product search indexing logic is currently being processed. Embeddings for this module are 40% complete.',
    type: 'warning',
  },
  {
    id: 'insight-6',
    title: 'Analytics module pending indexing',
    description:
      'The analytics aggregation endpoint and related metric computation logic has not yet been processed by the memory pipeline. Queued for the next cycle.',
    type: 'info',
  },
];