# CodebaseOS API Specification

## Overview

This document defines all API endpoints used by CodebaseOS.

The API follows REST principles.

Base URL:

```txt
/api/v1
```

Response Format:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

Error Format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
```

---

# Repository APIs

## Create Repository Analysis

POST

```txt
/api/v1/repositories/analyze
```

Purpose

Analyze repository.

Request

```json
{
  "repositoryUrl": "https://github.com/example/project",
  "source": "github"
}
```

Response

```json
{
  "success": true,
  "data": {
    "repositoryId": "repo_001",
    "status": "processing"
  }
}
```

---

## Upload ZIP Repository

POST

```txt
/api/v1/repositories/upload
```

Multipart Form Data

Fields

```txt
file
```

Response

```json
{
  "success": true,
  "data": {
    "repositoryId": "repo_001"
  }
}
```

---

## Get Repository

GET

```txt
/api/v1/repositories/:repositoryId
```

Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Get All Repositories

GET

```txt
/api/v1/repositories
```

Response

```json
{
  "success": true,
  "data": []
}
```

---

## Delete Repository

DELETE

```txt
/api/v1/repositories/:repositoryId
```

---

# Repository Intelligence APIs

## Repository Intelligence Report

GET

```txt
/api/v1/intelligence/:repositoryId
```

Response

```json
{
  "repositoryName": "nextjs-commerce",
  "framework": "Next.js",
  "database": "MongoDB",
  "authentication": "JWT",
  "services": 12,
  "apis": 24,
  "modules": 18
}
```

---

## Framework Detection

GET

```txt
/api/v1/intelligence/:repositoryId/frameworks
```

---

## Dependency Analysis

GET

```txt
/api/v1/intelligence/:repositoryId/dependencies
```

---

## Service Analysis

GET

```txt
/api/v1/intelligence/:repositoryId/services
```

---

## API Analysis

GET

```txt
/api/v1/intelligence/:repositoryId/apis
```

---

# Repository Memory APIs

## Get Repository Memory

GET

```txt
/api/v1/memory/:repositoryId
```

Response

```json
{
  "filesIndexed": 842,
  "chunks": 3204,
  "apis": 82,
  "services": 31,
  "coverage": 92
}
```

---

## Get Repository Chunks

GET

```txt
/api/v1/memory/:repositoryId/chunks
```

---

## Get Chunk Details

GET

```txt
/api/v1/memory/chunks/:chunkId
```

---

## Rebuild Repository Memory

POST

```txt
/api/v1/memory/:repositoryId/rebuild
```

---

# Architecture APIs

## Get Architecture Graph

GET

```txt
/api/v1/architecture/:repositoryId
```

Response

```json
{
  "nodes": [],
  "edges": []
}
```

---

## Get Architecture Complexity

GET

```txt
/api/v1/architecture/:repositoryId/complexity
```

---

# Knowledge Graph APIs

## Get Knowledge Graph

GET

```txt
/api/v1/knowledge-graph/:repositoryId
```

Response

```json
{
  "nodes": [],
  "edges": []
}
```

---

## Search Knowledge Graph

GET

```txt
/api/v1/knowledge-graph/:repositoryId/search?q=jwt
```

---

# Knowledge Debt APIs

## Get Knowledge Debt Score

GET

```txt
/api/v1/scores/:repositoryId/knowledge-debt
```

Response

```json
{
  "score": 81,
  "status": "high-risk"
}
```

---

# Survivability APIs

## Get Survivability Score

GET

```txt
/api/v1/scores/:repositoryId/survivability
```

Response

```json
{
  "score": 34,
  "status": "high-risk"
}
```

---

# Recoverability APIs

## Get Recoverability Score

GET

```txt
/api/v1/scores/:repositoryId/recoverability
```

Response

```json
{
  "score": 38,
  "recommendation": "rebuild"
}
```

---

# Bus Factor APIs

## Get Bus Factor

GET

```txt
/api/v1/scores/:repositoryId/bus-factor
```

Response

```json
{
  "busFactor": 1,
  "risk": "critical"
}
```

---

# Ownership APIs

## Get Ownership Map

GET

```txt
/api/v1/ownership/:repositoryId
```

Response

```json
{
  "modules": []
}
```

---

## Get Module Ownership

GET

```txt
/api/v1/ownership/:repositoryId/modules/:moduleId
```

---

# Risk Center APIs

## Get Risk Center Dashboard

GET

```txt
/api/v1/risk-center/:repositoryId
```

Response

```json
{
  "knowledgeDebt": 81,
  "survivability": 34,
  "recoverability": 38,
  "overallRisk": "high"
}
```

---

## Get Repository Risks

GET

```txt
/api/v1/risks/:repositoryId
```

---

## Get Critical Risks

GET

```txt
/api/v1/risks/:repositoryId/critical
```

---

# Documentation APIs

## Generate Documentation

POST

```txt
/api/v1/documentation/:repositoryId/generate
```

Request

```json
{
  "type": "architecture"
}
```

---

## Get Documentation

GET

```txt
/api/v1/documentation/:repositoryId
```

---

## Export Documentation

GET

```txt
/api/v1/documentation/:repositoryId/export
```

---

# Learning Mission APIs

## Generate Learning Missions

POST

```txt
/api/v1/missions/:repositoryId/generate
```

---

## Get Learning Missions

GET

```txt
/api/v1/missions/:repositoryId
```

---

## Complete Mission

PATCH

```txt
/api/v1/missions/:missionId/complete
```

---

# Knowledge Interview APIs

## Start Interview

POST

```txt
/api/v1/interview/:repositoryId/start
```

---

## Submit Answer

POST

```txt
/api/v1/interview/:interviewId/answer
```

---

## Get Interview Results

GET

```txt
/api/v1/interview/:interviewId/results
```

---

# Freelancer Rescue APIs

## Generate Rescue Report

POST

```txt
/api/v1/freelancer-rescue/:repositoryId
```

Response

```json
{
  "recoverability": 38,
  "recommendation": "rebuild",
  "criticalFiles": [],
  "dangerZones": []
}
```

---

# Agent APIs

## Run Agent

POST

```txt
/api/v1/agent/:repositoryId/run
```

Purpose

Execute full agent workflow.

---

## Get Agent Status

GET

```txt
/api/v1/agent/:repositoryId/status
```

---

## Get Agent Timeline

GET

```txt
/api/v1/agent/:repositoryId/timeline
```

---

## Get Agent Recommendations

GET

```txt
/api/v1/agent/:repositoryId/recommendations
```

---

# GitLab MCP APIs

## Create GitLab Issue

POST

```txt
/api/v1/gitlab/issues
```

Request

```json
{
  "repositoryId": "repo_001",
  "title": "Authentication Risk",
  "description": "..."
}
```

---

## Create Documentation Issue

POST

```txt
/api/v1/gitlab/documentation-issue
```

---

## Create Learning Mission Issue

POST

```txt
/api/v1/gitlab/learning-mission
```

---

## Create Ownership Risk Issue

POST

```txt
/api/v1/gitlab/ownership-risk
```

---

## Get GitLab Activity

GET

```txt
/api/v1/gitlab/activity/:repositoryId
```

---

# Health Scanner APIs

## Get Health Report

GET

```txt
/api/v1/health/:repositoryId
```

---

## Get Dependency Risks

GET

```txt
/api/v1/health/:repositoryId/dependencies
```

---

## Get Duplicate Logic

GET

```txt
/api/v1/health/:repositoryId/duplicates
```

---

## Get Dead Code

GET

```txt
/api/v1/health/:repositoryId/dead-code
```

---

# Future APIs

Reserved

```txt
/api/v1/commit-story

/api/v1/drift-detection

/api/v1/refactoring-advisor

/api/v1/team-analytics
```

---

# API Design Principles

1. Repository is the root resource.
2. All analysis belongs to a repository.
3. Agent actions are auditable.
4. GitLab actions are traceable.
5. Scores are explainable.
6. Responses are frontend-friendly.
7. Endpoints must be versioned.
8. Frontend must never directly access GitLab or Gemini.

---

# Backend MVP Order

Build APIs in this order:

1. Repository Upload
2. Repository Analysis
3. Memory Engine
4. Architecture Graph
5. Knowledge Debt
6. Survivability
7. Recoverability
8. Agent
9. GitLab MCP
10. Documentation
11. Learning Missions

This order maximizes hackathon progress while minimizing risk.
