  # CodebaseOS Scoring Engine

## Overview

The CodebaseOS Scoring Engine converts repository intelligence into measurable risk and knowledge metrics.

The purpose of scoring is not to determine code quality.

The purpose is to determine:

* Knowledge Risk
* Repository Survivability
* Repository Recoverability
* Ownership Concentration
* Onboarding Difficulty

All scores must be explainable.

Every score must expose the factors that contributed to the result.

---

# Scoring Principles

1. Scores must be transparent.
2. Scores must be reproducible.
3. Scores must be explainable.
4. Scores must not be random.
5. Scores must provide actionable recommendations.
6. Scores are repository-specific.
7. Scores are decision support tools.

---

# Score Categories

## Healthy

```txt id="rh1"
0-30
```

Low Risk

---

## Moderate

```txt id="rh2"
31-60
```

Manageable Risk

---

## High Risk

```txt id="rh3"
61-80
```

Significant Risk

---

## Critical

```txt id="rh4"
81-100
```

Immediate Attention Required

---

# Knowledge Debt Score™

## Purpose

Measure how difficult a repository is to understand, transfer, and maintain.

Knowledge Debt is the primary score in CodebaseOS.

---

## Inputs

Documentation Coverage

Architecture Complexity

Knowledge Concentration

Dependency Health

Onboarding Difficulty

Repository Memory Coverage

---

## Weights

Documentation Coverage

25%

Architecture Complexity

20%

Knowledge Concentration

20%

Dependency Health

15%

Onboarding Difficulty

10%

Repository Memory Coverage

10%

---

## Formula

```txt id="kd1"
Knowledge Debt =
(Docs × 0.25)
+
(Complexity × 0.20)
+
(Knowledge Concentration × 0.20)
+
(Dependency Risk × 0.15)
+
(Onboarding Difficulty × 0.10)
+
(Memory Coverage Risk × 0.10)
```

---

## Example

Documentation

85

Complexity

70

Ownership

90

Dependencies

40

Onboarding

80

Memory Risk

60

Output

81

Status

High Risk

---

## Recommendations

Low Documentation

Generate Docs

High Ownership Concentration

Create Knowledge Transfer Plan

High Complexity

Generate Refactoring Recommendations

---

# Survivability Score™

## Purpose

Determine whether the repository can survive without its original creator.

---

## Inputs

Documentation Coverage

Bus Factor

Ownership Distribution

Architecture Complexity

Dependency Health

Onboarding Difficulty

---

## Weights

Documentation

20%

Bus Factor

25%

Ownership

25%

Architecture

10%

Dependencies

10%

Onboarding

10%

---

## Formula

```txt id="sv1"
Survivability Risk =
(Docs Risk × 0.20)
+
(Bus Factor Risk × 0.25)
+
(Ownership Risk × 0.25)
+
(Architecture Risk × 0.10)
+
(Dependency Risk × 0.10)
+
(Onboarding Risk × 0.10)
```

Final Output

```txt id="sv2"
100 - Survivability Risk
```

---

## Example

Documentation

20

Bus Factor

10

Ownership

15

Architecture

40

Dependencies

80

Onboarding

30

Output

34

Status

High Risk

---

## Interpretation

0–30

Critical

31–60

High Risk

61–80

Moderate

81–100

Healthy

---

# Recoverability Score™

## Purpose

Determine whether inherited software should be:

Continue

Refactor

Rebuild

---

## Target Users

Freelancers

Consultants

Agencies

Startups

---

## Inputs

Knowledge Debt

Survivability

Dependency Health

Architecture Complexity

Dead Code

Duplicate Logic

Documentation Coverage

---

## Weights

Knowledge Debt

30%

Survivability

25%

Architecture

15%

Dependencies

10%

Dead Code

10%

Duplicate Logic

5%

Documentation

5%

---

## Formula

```txt id="rc1"
Recoverability =
100
-
(
Knowledge Debt × 0.30
+
Survivability Risk × 0.25
+
Architecture Risk × 0.15
+
Dependency Risk × 0.10
+
Dead Code Risk × 0.10
+
Duplicate Logic Risk × 0.05
+
Documentation Risk × 0.05
)
```

---

## Decision Engine

### Healthy

81–100

Continue Development

---

### Recoverable

61–80

Minor Refactoring Recommended

---

### High Refactoring Cost

41–60

Significant Refactoring Required

---

### Rebuild Recommended

0–40

Rebuild Core Systems

---

## Example

Output

38

Recommendation

Rebuild Recommended

---

# Bus Factor Score™

## Purpose

Measure knowledge concentration risk.

---

## Formula

Bus Factor

```txt id="bf1"
Number of critical contributors required before repository becomes unsafe.
```

---

## Example

Authentication

92% Alice

Payments

88% Charlie

Infrastructure

94% Alice

Bus Factor

1

---

## Risk Levels

1

Critical

2

High

3–4

Moderate

5+

Healthy

---

# Ownership Health Score™

## Purpose

Measure knowledge distribution.

---

## Inputs

Ownership %

Backup Owners

Contributor Count

Module Distribution

---

## Formula

Higher concentration

↓

Lower score

Better distribution

↓

Higher score

---

## Example

Authentication

92% Alice

Risk

Critical

Database

60% Bob

20% Alice

20% Charlie

Risk

Healthy

---

# Dependency Health Score™

## Purpose

Measure dependency risk.

---

## Inputs

Outdated Packages

Deprecated Packages

Vulnerabilities

Version Conflicts

Unused Dependencies

---

## Formula

```txt id="dp1"
Dependency Health =
100 - Total Dependency Risk
```

---

## Example

Health

61

Status

Moderate Risk

---

# Architecture Complexity Score™

## Purpose

Measure architectural maintainability.

---

## Inputs

Dependency Graph Size

Circular Dependencies

Coupling

Layer Violations

Module Size

Service Count

---

## Formula

Complexity increases with:

* Coupling
* Circular Dependencies
* Giant Modules
* Layer Violations

---

## Example

Output

73

Status

High Complexity

---

# Repository Health Score™

## Purpose

Overall technical health.

---

## Inputs

Dependency Health

Dead Code

Duplicate Logic

Complexity

Architecture

Documentation

---

## Output

0–100

---

# Overall Repository Risk™

## Purpose

Executive Summary Metric

---

## Inputs

Knowledge Debt

Survivability

Recoverability

Dependency Risk

Architecture Risk

Bus Factor

---

## Formula

```txt id="or1"
Overall Risk =
Average(
Knowledge Debt,
Survivability Risk,
Recoverability Risk,
Dependency Risk,
Architecture Risk,
Bus Factor Risk
)
```

---

## Risk Levels

0–30

Healthy

31–60

Moderate

61–80

High

81–100

Critical

---

# AI Recommendations Engine

Every score must generate recommendations.

Example

If:

Bus Factor = 1

Then:

* Generate Documentation
* Create Learning Mission
* Create Knowledge Transfer Plan
* Create GitLab Issue

---

If:

Recoverability < 40

Then:

* Recommend Rebuild
* Generate Recovery Plan
* Create Refactoring Tasks

---

If:

Knowledge Debt > 80

Then:

* Generate Documentation
* Generate Architecture Report
* Create Onboarding Tasks

---

# Future Scoring Models

Commit Story Score™

Knowledge Transfer Readiness™

Architecture Drift Score™

Documentation Health Score™

AI Maintainability Score™

---

# Final Principle

Scores exist to help humans make decisions.

They are not intended to replace engineering judgment.

The goal of CodebaseOS is not to judge code.

The goal is to preserve, measure, transfer, and operationalize software knowledge.
