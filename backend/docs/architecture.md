# CodebaseOS Architecture

## Overview

CodebaseOS is an AI Engineering Knowledge Platform designed to transform repositories into organizational knowledge.

The system analyzes repositories, creates repository memory, detects risks, measures survivability and recoverability, and performs agent-driven actions through GitLab.

---

# High Level Architecture

```txt
Frontend (Next.js)
        │
        ▼
Backend API (Node.js / Express)
        │
        ├───────────────┐
        ▼               ▼
Repository Engine   Agent Engine
        │               │
        ▼               ▼
Memory Engine      GitLab MCP
        │               │
        ▼               ▼
MongoDB        Google Cloud Agent Builder
        │
        ▼
Gemini
```

---

# Core Layers

## Layer 1

Frontend Layer

Technology:

* Next.js
* TypeScript
* Tailwind
* shadcn/ui
* Framer Motion
* React Flow
* Recharts

Responsibilities:

* User Interface
* Visualizations
* Repository Upload
* Dashboard
* Agent Views
* Graphs
* Reports

Frontend must remain presentation-only.

Business logic belongs in backend services.

---

## Layer 2

Backend API Layer

Technology:

* Node.js
* Express

Responsibilities:

* Authentication
* API Routing
* Repository Processing
* Scoring
* Agent Workflows
* GitLab Integration

---

## Layer 3

Repository Intelligence Layer

Purpose:

Understand repository structure.

Modules:

Repository Parser

AST Analysis

Dependency Analyzer

Framework Detection

Knowledge Graph Builder

Documentation Generator

Outputs:

Repository Metadata

Architecture Graph

Knowledge Graph

Risk Data

---

## Layer 4

Repository Memory Layer

Purpose:

Persistent repository understanding.

Problem:

Large repositories exceed AI context windows.

Solution:

Repository Memory Engine™

---

Pipeline

Repository

↓

Parse Files

↓

Generate Chunks

↓

AST Analysis

↓

Module Summaries

↓

Dependency Mapping

↓

Embeddings

↓

Knowledge Graph

↓

Repository Memory Store

---

Outputs

Knowledge Chunks

Relationships

Embeddings

Repository Context

---

Benefits

Prevents:

* Context Loss
* Hallucinations
* Repeated Uploads

---

## Layer 5

Scoring Layer

Purpose:

Calculate repository intelligence metrics.

Scoring Services:

Knowledge Debt Service

Survivability Service

Recoverability Service

Bus Factor Service

Risk Service

Health Service

Outputs:

Repository Scores

Repository Risks

Recommendations

---

## Layer 6

Agent Layer

Purpose:

Convert analysis into actions.

Technology:

Google Cloud Agent Builder

Gemini

---

Responsibilities

Repository Reasoning

Risk Detection

Recommendation Generation

Action Planning

GitLab Actions

Knowledge Transfer Planning

---

Agent Workflow

Repository Uploaded

↓

Repository Parsed

↓

Repository Memory Generated

↓

Knowledge Graph Generated

↓

Risk Analysis

↓

Reasoning

↓

Recommendation Creation

↓

GitLab Action

↓

Result

---

## Layer 7

GitLab Integration Layer

Purpose:

Execute actions.

Technology:

GitLab MCP

---

Supported Actions

Create Issue

Create Task

Create Documentation Issue

Create Learning Mission

Create Ownership Issue

Create Risk Issue

Create Recoverability Issue

Create Survivability Issue

---

Workflow

Agent Detects Problem

↓

Agent Generates Recommendation

↓

GitLab Issue Created

↓

User Reviews

↓

Action Completed

---

## Layer 8

Storage Layer

Technology:

MongoDB

Purpose:

Store repository intelligence.

---

Collections

repositories

repository_chunks

repository_embeddings

repository_scores

repository_risks

repository_actions

repository_documents

gitlab_issues

missions

interviews

---

# Repository Analysis Architecture

Repository URL

↓

Clone Repository

↓

Parse Files

↓

Detect Framework

↓

Analyze Dependencies

↓

Extract APIs

↓

Extract Services

↓

Extract Models

↓

Generate Metadata

↓

Store Results

---

# Repository Memory Architecture

Repository Files

↓

Chunk Engine

↓

AST Engine

↓

Knowledge Graph Builder

↓

Embedding Generator

↓

MongoDB

↓

Repository Memory

---

# Architecture Graph Generation

Repository

↓

Dependency Analysis

↓

Service Mapping

↓

API Mapping

↓

Database Mapping

↓

Graph Generation

↓

React Flow Visualization

---

# Knowledge Graph Generation

Repository

↓

Concept Extraction

↓

Entity Detection

↓

Relationship Mapping

↓

Knowledge Graph

↓

Visualization

---

# Risk Analysis Architecture

Repository Metadata

Repository Memory

Knowledge Graph

↓

Risk Engine

↓

Knowledge Debt

Survivability

Recoverability

Bus Factor

Dependency Risk

↓

Risk Center

---

# Agent Architecture

Input

Repository Context

↓

Gemini Reasoning

↓

Agent Planner

↓

Action Generator

↓

GitLab MCP

↓

Output

Issues

Tasks

Missions

Documentation

---

# Recoverability Analysis Architecture

Repository

↓

Knowledge Debt

↓

Survivability

↓

Dependency Health

↓

Architecture Complexity

↓

Documentation Coverage

↓

Recoverability Score

↓

Recommendation

Healthy

Recoverable

Refactor

Rebuild

---

# Survivability Analysis Architecture

Repository

↓

Documentation

↓

Ownership

↓

Bus Factor

↓

Complexity

↓

Dependencies

↓

Survivability Score

---

# Freelancer Rescue Workflow

Repository Upload

↓

Repository Analysis

↓

Memory Generation

↓

Architecture Discovery

↓

Risk Detection

↓

Recoverability Assessment

↓

Critical Files

↓

Danger Zones

↓

Onboarding Plan

↓

Rescue Report

---

# Future Scalability

Future Features

Commit Story Generator™

Architecture Drift Detection™

AI Refactoring Advisor™

Multi Repository Analysis™

Team Knowledge Analytics™

Repository Benchmarking™

---

# Architectural Principles

1. Frontend is presentation only.
2. Backend owns business logic.
3. Repository Memory is source of truth.
4. Agent actions require reasoning.
5. GitLab actions must be traceable.
6. Scores must be explainable.
7. Analysis must be reproducible.
8. Context must persist across sessions.

---

# Final Goal

The architecture exists to answer:

How does this repository work?

Can it survive?

Can it be recovered?

Who owns the knowledge?

What actions should be taken?

CodebaseOS transforms repositories into organizational knowledge through Repository Memory, Intelligence Analysis, Risk Detection, and Agent Actions.
