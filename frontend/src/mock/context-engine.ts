interface ContextEngineData {
  problem: string;
  solution: string;
  traditionalFlow: { step: string; description: string }[];
  codebaseOSFlow: { step: string; description: string }[];
  metrics: { label: string; value: number; max: number; description: string }[];
}

export const contextEngineData: ContextEngineData = {
  problem:
    'Traditional AI coding assistants lose context about a codebase as conversation length grows. After a few hundred messages, the AI forgets earlier decisions, contradicts its own recommendations, and fails to understand the architectural constraints that were established at the start of the session. This "context decay" results in inconsistent suggestions, broken code, and frustrated developers.',
  solution:
    'CodebaseOS maintains a persistent knowledge layer that is independent of any single conversation. The context engine continuously builds and updates a structured understanding of the codebase — its architecture, ownership patterns, business logic, and knowledge gaps. This knowledge persists across sessions, agents, and time, ensuring every AI interaction starts with complete, current codebase awareness.',
  traditionalFlow: [
    {
      step: 'Paste Code Snippet',
      description:
        'Developer copies a file or function into the AI chat and manually provides context about what they need. The AI only sees what is explicitly shared and has no awareness of the broader system.',
    },
    {
      step: 'AI Analyzes Isolated Context',
      description:
        'The AI processes the provided snippet without understanding its relationships to other modules, the original design intent, or constraints imposed by the architecture. Suggestions are made in isolation.',
    },
    {
      step: 'Context Window Fills Up',
      description:
        'As the conversation continues, earlier context is compressed or dropped to make room for new messages. The AI gradually loses awareness of architectural decisions and business logic constraints discussed earlier.',
    },
    {
      step: 'Contradictions & Hallucinations',
      description:
        'After extended sessions, the AI begins suggesting changes that contradict earlier decisions, ignore established patterns, or introduce code that breaks cross-module contracts. Developer must manually verify every suggestion.',
    },
  ],
  codebaseOSFlow: [
    {
      step: 'CodebaseOS Reads Full Repository',
      description:
        'CodebaseOS performs an AST-level analysis of every file, building a comprehensive model of imports, exports, function signatures, type relationships, and architectural patterns. This analysis happens once and is continuously updated.',
    },
    {
      step: 'Knowledge Graph Captures Relationships',
      description:
        'Every module, function, type, and configuration is indexed in a knowledge graph that tracks ownership, dependencies, documentation coverage, and business logic mappings. The graph persists across all sessions.',
    },
    {
      step: 'Context Engine Enriches Queries',
      description:
        'When an AI assistant needs to generate code, the context engine automatically injects relevant architectural constraints, ownership awareness, dependency maps, and business logic rules. The AI always operates with full system context.',
    },
    {
      step: 'Continuous Validation & Updates',
      description:
        'Every code change is analyzed to update the knowledge graph, detect new risks, and validate that architectural patterns are maintained. The system grows smarter with every change and never forgets what it has learned.',
    },
  ],
  metrics: [
    {
      label: 'Repository Coverage',
      value: 94,
      max: 100,
      description:
        'Percentage of repository files that have been parsed and indexed into the knowledge graph. 94% of 12 files are fully analyzed with AST-level detail, imports mapped, and relationships captured.',
    },
    {
      label: 'Memory Coverage',
      value: 87,
      max: 100,
      description:
        'Percentage of architectural decisions, design patterns, and business logic rules that are captured in persistent memory. 87% means the system retains awareness of most critical constraints across sessions.',
    },
    {
      label: 'Knowledge Coverage',
      value: 78,
      max: 100,
      description:
        'Percentage of undocumented modules that now have generated or captured knowledge entries. 78% of previously undocumented code now has at least a basic knowledge entry available for AI context injection.',
    },
    {
      label: 'Relationship Coverage',
      value: 82,
      max: 100,
      description:
        'Percentage of inter-module dependencies, import chains, and cross-references that are mapped in the knowledge graph. 82% coverage means most dependency chains are traceable for impact analysis.',
    },
    {
      label: 'Business Logic Coverage',
      value: 72,
      max: 100,
      description:
        'Percentage of business rules, state machines, validation constraints, and domain logic that are explicitly captured. 72% coverage means the system understands most domain-specific rules that constrain code generation.',
    },
  ],
};
