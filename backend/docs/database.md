# CodebaseOS Database Design

## Overview

CodebaseOS uses MongoDB as the primary database.

The database stores:

* Repository metadata
* Repository memory
* Knowledge graphs
* Scores
* Risks
* Agent actions
* GitLab actions
* Documentation
* Learning missions
* Knowledge interviews

MongoDB is chosen because repository intelligence data is highly connected and semi-structured.

---

# Collection Overview

```txt
repositories

repository_chunks

repository_embeddings

knowledge_graphs

architecture_graphs

repository_scores

repository_risks

repository_documents

agent_actions

gitlab_issues

learning_missions

knowledge_interviews

users
```

---

# repositories

Purpose:

Store repository metadata.

Example Document

```json
{
  "_id": "repo_001",
  "name": "nextjs-commerce",
  "description": "E-commerce platform",
  "source": "github",
  "repositoryUrl": "https://github.com/example/repo",
  "branch": "main",
  "framework": "Next.js",
  "language": "TypeScript",
  "database": "MongoDB",
  "authentication": "JWT",
  "status": "analyzed",
  "createdAt": "2026-01-01",
  "updatedAt": "2026-01-01"
}
```

Indexes

```txt
repositoryUrl
name
status
```

---

# repository_chunks

Purpose:

Store repository memory chunks.

Example

```json
{
  "_id": "chunk_001",
  "repositoryId": "repo_001",
  "filePath": "/src/auth/login.ts",
  "module": "Authentication",
  "summary": "Handles login flow",
  "chunkContent": "...",
  "relationships": ["jwt_service"],
  "createdAt": "2026-01-01"
}
```

Indexes

```txt
repositoryId
module
filePath
```

---

# repository_embeddings

Purpose:

Store embedding references.

Example

```json
{
  "_id": "embedding_001",
  "repositoryId": "repo_001",
  "chunkId": "chunk_001",
  "embeddingProvider": "gemini",
  "embeddingVector": [],
  "createdAt": "2026-01-01"
}
```

Indexes

```txt
repositoryId
chunkId
```

---

# knowledge_graphs

Purpose:

Store repository knowledge graph.

Example

```json
{
  "_id": "graph_001",
  "repositoryId": "repo_001",
  "nodes": [],
  "edges": [],
  "createdAt": "2026-01-01"
}
```

Structure

Nodes

```json
{
  "id": "jwt",
  "type": "concept",
  "label": "JWT"
}
```

Edges

```json
{
  "source": "jwt",
  "target": "auth",
  "type": "relationship"
}
```

---

# architecture_graphs

Purpose:

Store architecture visualization data.

Example

```json
{
  "_id": "architecture_001",
  "repositoryId": "repo_001",
  "nodes": [],
  "edges": [],
  "complexityScore": 74
}
```

---

# repository_scores

Purpose:

Store all repository intelligence scores.

Example

```json
{
  "_id": "score_001",
  "repositoryId": "repo_001",

  "knowledgeDebt": 81,

  "survivability": 34,

  "recoverability": 38,

  "busFactor": 1,

  "healthScore": 58,

  "dependencyHealth": 61,

  "architectureRisk": 73,

  "ownershipHealth": 22,

  "createdAt": "2026-01-01"
}
```

Indexes

```txt
repositoryId
```

---

# repository_risks

Purpose:

Store detected risks.

Example

```json
{
  "_id": "risk_001",
  "repositoryId": "repo_001",
  "title": "Authentication Knowledge Concentration",
  "severity": "critical",
  "description": "Authentication owned by one contributor",
  "affectedFiles": [],
  "recommendation": "Create onboarding documentation",
  "status": "open"
}
```

Severity

```txt
low
medium
high
critical
```

Indexes

```txt
repositoryId
severity
status
```

---

# repository_documents

Purpose:

Store generated documentation.

Document Types

```txt
README

Architecture

API

Onboarding

Maintenance

Knowledge Transfer
```

Example

```json
{
  "_id": "doc_001",
  "repositoryId": "repo_001",
  "type": "architecture",
  "content": "...",
  "generatedBy": "agent",
  "createdAt": "2026-01-01"
}
```

---

# agent_actions

Purpose:

Store all agent executions.

Example

```json
{
  "_id": "action_001",
  "repositoryId": "repo_001",
  "actionType": "create_documentation",
  "reasoning": "Documentation coverage low",
  "confidence": 0.92,
  "status": "completed",
  "createdAt": "2026-01-01"
}
```

Action Types

```txt
create_documentation

create_gitlab_issue

create_learning_mission

generate_report

transfer_knowledge
```

Indexes

```txt
repositoryId
actionType
status
```

---

# gitlab_issues

Purpose:

Track GitLab MCP actions.

Example

```json
{
  "_id": "gitlab_issue_001",
  "repositoryId": "repo_001",
  "gitlabIssueId": 101,
  "title": "Authentication Risk",
  "status": "open",
  "url": "",
  "createdAt": "2026-01-01"
}
```

Indexes

```txt
repositoryId
gitlabIssueId
```

---

# learning_missions

Purpose:

Store repository-specific learning tasks.

Example

```json
{
  "_id": "mission_001",
  "repositoryId": "repo_001",
  "title": "Understand JWT Authentication",
  "difficulty": "medium",
  "estimatedTime": "2 hours",
  "objective": "Understand login workflow",
  "status": "pending"
}
```

Indexes

```txt
repositoryId
status
```

---

# knowledge_interviews

Purpose:

Store interview sessions and scores.

Example

```json
{
  "_id": "interview_001",
  "repositoryId": "repo_001",

  "authenticationScore": 80,

  "databaseScore": 60,

  "architectureScore": 70,

  "securityScore": 50,

  "overallScore": 65
}
```

Indexes

```txt
repositoryId
```

---

# users

Purpose:

Store user information.

Example

```json
{
  "_id": "user_001",
  "email": "user@example.com",
  "name": "Developer",
  "provider": "google",
  "createdAt": "2026-01-01"
}
```

Indexes

```txt
email
```

---

# Relationships

Repository

↓

Chunks

↓

Embeddings

↓

Knowledge Graph

↓

Architecture Graph

↓

Scores

↓

Risks

↓

Agent Actions

↓

GitLab Issues

---

# Future Collections

Potential Future Expansion

```txt
commit_stories

architecture_drift

repository_benchmarks

team_analytics

repository_snapshots
```

---

# Database Principles

1. Repository is the root entity.
2. Repository Memory is persistent.
3. Scores are explainable.
4. Agent actions are auditable.
5. GitLab actions are traceable.
6. Documents are versionable.
7. Graphs are stored separately.
8. Backend services must never hardcode schemas.

---

# Final Goal

The database exists to support:

Repository Understanding

Repository Memory

Knowledge Preservation

Risk Detection

Agent Actions

GitLab Workflows

and long-term organizational knowledge management.
