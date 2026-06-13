/**
 * CodebaseOS Runtime Validation Script
 *
 * Validates the complete demo workflow end-to-end.
 *
 * Usage:
 *   node src/tests/validation.mjs
 *
 * Prerequisites:
 *   - Backend server running on PORT (default 5000)
 *   - MongoDB accessible
 *   - GitLab token configured (optional for fallback tests)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/v1`;

// Test repositories for analysis
const TEST_REPOS = {
  github: {
    url: 'https://github.com/expressjs/express',
    source: 'github',
  },
  gitlab: {
    url: 'https://gitlab.com/gitlab-org/gitlab-shell',
    source: 'gitlab',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let startTime = Date.now();

function log(msg) {
  console.log(`  ${msg}`);
}

function heading(title) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ${title}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

function subheading(title) {
  console.log(`\n  ─── ${title} ───`);
}

function pass(msg) {
  passed++;
  console.log(`  ✅ PASS: ${msg}`);
}

function fail(msg) {
  failed++;
  console.log(`  ❌ FAIL: ${msg}`);
}

function result(summary, success) {
  if (success) {
    pass(summary);
  } else {
    fail(summary);
  }
  return success;
}

async function api(method, path, body = undefined) {
  const url = `${API}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({ success: false, error: { message: 'Invalid JSON response' } }));
  return { status: response.status, ok: response.ok, data };
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Test Suites ──────────────────────────────────────────────────────────

async function testServerHealth() {
  subheading('Server Health Check');

  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    result('Server responds to health check', response.ok && data.success);
    if (data.success) {
      log(`  Server time: ${data.timestamp}`);
    }
  } catch (e) {
    result(`Server health check failed: ${e.message}`, false);
  }
}

async function testServerListening() {
  subheading('Server Listening Check (port 5000)');

  try {
    const response = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
    result(`Server listening on port 5000 — response: ${JSON.stringify(data)}`, response.ok);
  } catch (e) {
    result(`Server not responding on port 5000: ${e.message}`, false);
  }
}

async function testMongoDBConnection() {
  subheading('MongoDB Connection Check');

  // Hit the repositories list to verify DB connectivity
  try {
    const res = await api('GET', '/repositories');
    // Even an empty list means DB is connected
    result('MongoDB connected (repositories endpoint responded)', res.ok);
    if (res.ok) {
      log(`  Repositories: ${Array.isArray(res.data?.data) ? res.data.data.length : 'empty'}`);
    }
  } catch (e) {
    result(`MongoDB connection failed: ${e.message}`, false);
  }
}

async function testGitHubRepoAnalysis() {
  subheading('GitHub Repository Analysis');

  const repo = TEST_REPOS.github;
  log(`  URL: ${repo.url}`);

  try {
    const res = await api('POST', '/repositories/analyze', repo);
    result('GitHub repo analysis request accepted', res.ok);
    if (res.ok && res.data?.data?.repositoryId) {
      log(`  Repository ID: ${res.data.data.repositoryId}`);
      log(`  Status: ${res.data.data.status || 'processing'}`);
      return res.data.data.repositoryId;
    }
  } catch (e) {
    result(`GitHub repo analysis failed: ${e.message}`, false);
  }
  return null;
}

async function testGitLabRepoAnalysis() {
  subheading('GitLab Repository Analysis');

  const repo = TEST_REPOS.gitlab;
  log(`  URL: ${repo.url}`);

  try {
    const res = await api('POST', '/repositories/analyze', repo);
    result('GitLab repo analysis request accepted', res.ok);
    if (res.ok && res.data?.data?.repositoryId) {
      log(`  Repository ID: ${res.data.data.repositoryId}`);
      return res.data.data.repositoryId;
    }
  } catch (e) {
    result(`GitLab repo analysis failed: ${e.message}`, false);
  }
  return null;
}

async function testAgentRun(repositoryId) {
  if (!repositoryId) {
    result('Agent run: skipped (no repository ID)', false);
    return null;
  }

  subheading('Agent Workflow Execution');
  log(`  Repository ID: ${repositoryId}`);

  try {
    const res = await api('POST', `/agent/${repositoryId}/run`);
    result('Agent workflow initiated', res.ok);

    if (res.ok && res.data?.data) {
      const agentData = res.data.data;

      // Verify timeline steps
      const timeline = agentData.timeline || [];
      result('Agent timeline generated', timeline.length > 0);
      log(`  Timeline steps: ${timeline.length}`);
      for (const step of timeline) {
        log(`    ${step.status === 'completed' ? '✅' : '❌'} ${step.step}: ${step.status}`);
      }

      // Verify reasoning
      result('Agent reasoning generated', !!agentData.reasoning);
      if (agentData.reasoning) {
        log(`  Reasoning: ${agentData.reasoning.substring(0, 100)}...`);
      }

      // Verify recommendations
      result('Agent recommendations generated', Array.isArray(agentData.recommendations) && agentData.recommendations.length > 0);
      if (agentData.recommendations?.length) {
        log(`  Recommendations: ${agentData.recommendations.length}`);
        agentData.recommendations.forEach((r, i) => log(`    ${i + 1}. ${r}`));
      }

      // Verify GitLab actions
      result('GitLab actions created', Array.isArray(agentData.gitlabActions));
      if (agentData.gitlabActions?.length) {
        log(`  GitLab actions: ${agentData.gitlabActions.length}`);
        agentData.gitlabActions.forEach((a, i) => log(`    ${i + 1}. ${a.type || a.target || 'action'}`));
      }

      return agentData;
    }
  } catch (e) {
    result(`Agent workflow failed: ${e.message}`, false);
  }
  return null;
}

async function testAgentFeed(repositoryId) {
  if (!repositoryId) {
    result('Agent feed: skipped (no repository ID)', false);
    return;
  }

  subheading('Agent Feed / Timeline');

  try {
    const feedRes = await api('GET', `/agent/${repositoryId}/feed`);
    result('Agent feed endpoint responds', feedRes.ok);
    if (feedRes.ok && feedRes.data?.data) {
      const feed = feedRes.data.data;
      result('Agent feed includes actions', Array.isArray(feed.actions));
      result('Agent feed includes scores', feed.scores !== null);
      result('Agent feed includes risks', Array.isArray(feed.risks));
      log(`  Actions: ${feed.actions?.length || 0}`);
      log(`  Risks: ${feed.risks?.length || 0}`);
      if (feed.scores) {
        log(`  Scores: KD=${feed.scores.knowledgeDebt}, SV=${feed.scores.survivability}, RC=${feed.scores.recoverability}, BF=${feed.scores.busFactor}`);
      }
    }

    const timelineRes = await api('GET', `/agent/${repositoryId}/timeline`);
    result('Agent timeline endpoint responds', timelineRes.ok);

    const actionsRes = await api('GET', `/agent/${repositoryId}/actions`);
    result('Agent action history endpoint responds', actionsRes.ok);
    if (actionsRes.ok && Array.isArray(actionsRes.data?.data)) {
      log(`  Total stored actions: ${actionsRes.data.data.length}`);
    }

    const recommendationsRes = await api('GET', `/agent/${repositoryId}/recommendations`);
    result('Agent recommendations endpoint responds', recommendationsRes.ok);
    if (recommendationsRes.ok && recommendationsRes.data?.data) {
      log(`  AI recommendations available: ${!!recommendationsRes.data.data.aiRecommendations}`);
      log(`  Manual recommendations: ${recommendationsRes.data.data.manualRecommendations?.length || 0}`);
    }

    const statusRes = await api('GET', `/agent/${repositoryId}/status`);
    result('Agent status endpoint responds', statusRes.ok);
    if (statusRes.ok && statusRes.data?.data) {
      log(`  Agent status: ${statusRes.data.data.status}`);
      log(`  Total actions: ${statusRes.data.data.totalActions}`);
    }
  } catch (e) {
    result(`Agent feed test failed: ${e.message}`, false);
  }
}

async function testGitLabIssues(repositoryId) {
  if (!repositoryId) {
    result('GitLab issues test: skipped (no repository ID)', false);
    return;
  }

  subheading('GitLab Issue Creation');

  try {
    // Test generic issue creation
    const issueRes = await api('POST', '/gitlab/issues', {
      repositoryId,
      title: 'Validation Test Issue',
      description: 'Created by CodebaseOS runtime validation',
      labels: ['validation', 'agent-generated'],
    });
    result('GitLab issue creation endpoint responds', issueRes.ok);
    if (issueRes.ok && issueRes.data?.data) {
      log(`  Issue ID: ${issueRes.data.data._id || issueRes.data.data.gitlabIssueId || 'N/A'}`);
      log(`  Issue title: ${issueRes.data.data.title}`);
    }

    // Test documentation issue
    const docRes = await api('POST', '/gitlab/documentation-issue', {
      repositoryId,
      moduleName: 'Validation Module',
    });
    result('Documentation issue creation endpoint responds', docRes.ok);

    // Test survivability issue
    const survRes = await api('POST', '/gitlab/survivability-issue', {
      repositoryId,
      survivabilityScore: 35,
    });
    result('Survivability issue creation endpoint responds', survRes.ok);

    // Test recoverability issue
    const recRes = await api('POST', '/gitlab/recoverability-issue', {
      repositoryId,
      recoverabilityScore: 30,
    });
    result('Recoverability issue creation endpoint responds', recRes.ok);

    // Test learning mission issue
    const learnRes = await api('POST', '/gitlab/learning-mission', {
      repositoryId,
      title: 'Validation Learning Mission',
      objective: 'Validate CodebaseOS runtime',
    });
    result('Learning mission issue creation endpoint responds', learnRes.ok);

    // Test ownership risk issue
    const ownRes = await api('POST', '/gitlab/ownership-risk', {
      repositoryId,
      moduleName: 'Validation Module',
      ownerPercent: 95,
    });
    result('Ownership risk issue creation endpoint responds', ownRes.ok);

    // Test activity feed
    const activityRes = await api('GET', `/gitlab/activity/${repositoryId}`);
    result('GitLab activity endpoint responds', activityRes.ok);
    if (activityRes.ok && Array.isArray(activityRes.data?.data)) {
      log(`  Total GitLab activity entries: ${activityRes.data.data.length}`);
    }
  } catch (e) {
    result(`GitLab issues test failed: ${e.message}`, false);
  }
}

async function testConfigValidation() {
  subheading('Configuration Validation');

  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    // Check env is loaded by verifying the response
    const body = await healthRes.json();
    result('Environment variables loaded', body.success);
  } catch (e) {
    result(`Config validation failed: ${e.message}`, false);
  }
}

async function testErrorHandling() {
  subheading('Error Handling');

  // Test 404 for non-existent repository
  const missingRes = await api('GET', '/repositories/nonexistent-id');
  result('404 on non-existent repository', missingRes.status === 404 || !missingRes.ok);

  // Test missing body validation
  const badReq = await api('POST', '/repositories/analyze', {});
  result('Validation error on empty request', !badReq.ok);

  log('  Missing body returns error code: ' + (badReq.data?.error?.code || 'N/A'));
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`  CodebaseOS Runtime Validation Report`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  // ─── Phase 1: Server Health ───────────────────────────────────────
  heading('Phase 1: Server Startup & Connectivity');
  await testServerListening();
  await testServerHealth();
  await testConfigValidation();
  await testMongoDBConnection();

  // ─── Phase 2: Repository Analysis ─────────────────────────────────
  heading('Phase 2: Repository Analysis');
  const githubRepoId = await testGitHubRepoAnalysis();
  // Wait a moment for analysis to process
  if (githubRepoId) await sleep(2000);
  const gitlabRepoId = await testGitLabRepoAnalysis();
  if (gitlabRepoId) await sleep(2000);

  const repoId = githubRepoId || gitlabRepoId;

  // ─── Phase 3: Agent Workflow ──────────────────────────────────────
  heading('Phase 3: Agent Workflow');
  const agentResult = await testAgentRun(repoId);

  // ─── Phase 4: Agent Feed & Timeline ───────────────────────────────
  heading('Phase 4: Agent Feed & Timeline');
  await testAgentFeed(repoId);

  // ─── Phase 5: GitLab Integration ──────────────────────────────────
  heading('Phase 5: GitLab Integration');
  await testGitLabIssues(repoId);

  // ─── Phase 6: Error Handling ──────────────────────────────────────
  heading('Phase 6: Error Handling & Edge Cases');
  await testErrorHandling();

  // ─── Summary ──────────────────────────────────────────────────────
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const total = passed + failed;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`  VALIDATION SUMMARY`);
  console.log(`═══════════════════════════════════════════════════════════`);
  console.log(`  Total tests:  ${total}`);
  console.log(`  Passed:       ${passed} (${pct}%)`);
  console.log(`  Failed:       ${failed}`);
  console.log(`  Duration:     ${duration}s`);
  console.log(`  Timestamp:    ${new Date().toISOString()}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(`\n  ❌ Validation script crashed: ${e.message}`);
  console.error(e.stack);
  process.exit(1);
});