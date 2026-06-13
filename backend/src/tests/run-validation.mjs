/**
 * CodebaseOS Runtime Validation Bootstrap
 *
 * Starts ephemeral MongoDB in-memory, launches the Express server,
 * runs the full validation test suite, then cleans up.
 *
 * Usage:
 *   node src/tests/run-validation.mjs
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_PORT = 9876; // Use non-standard port to avoid conflicts
const BASE_URL = `http://localhost:${SERVER_PORT}`;
const LOG_FILE = path.join(__dirname, '..', '..', 'validation-output.log');

let mongod;
let serverProcess;

// ─── Logging ──────────────────────────────────────────────────────────────

function log(msg) {
  const line = `  ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
}

// ─── Phase 0: Start In-Memory MongoDB ─────────────────────────────────────

async function startMongoDB() {
  log('Starting in-memory MongoDB...');
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    log(`MongoMemoryServer URI: ${uri}`);

    await mongoose.connect(uri);
    log('Mongoose connected to in-memory MongoDB');
    return uri;
  } catch (err) {
    log(`FAILED to start in-memory MongoDB: ${err.message}`);
    throw err;
  }
}

// ─── Phase 1: Start Express Server ────────────────────────────────────────

function startServer(mongoUri) {
  return new Promise((resolve, reject) => {
    log(`Starting Express server on port ${SERVER_PORT}...`);

    // We'll run ts-node-dev on server.ts, injecting env vars
    const env = {
      ...process.env,
      PORT: String(SERVER_PORT),
      MONGO_URI: mongoUri,
      NODE_ENV: 'test',
    };

    serverProcess = spawn('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'src/server.ts'], {
      cwd: path.join(__dirname, '..', '..'),
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        reject(new Error('Server did not start within 60 seconds'));
      }
    }, 60000);

    const checkOutput = (data) => {
      const text = data.toString();
      // Log server output for debugging
      if (!text.includes('MongoDB connection error')) {
        fs.appendFileSync(LOG_FILE, `[SERVER] ${text.trim()}\n`, 'utf8');
      }
      if (text.includes('Server listening') || text.includes('running on port')) {
        started = true;
        clearTimeout(timeout);
        // Give it a moment to fully initialize
        setTimeout(() => resolve(), 2000);
      }
    };

    serverProcess.stdout.on('data', checkOutput);
    serverProcess.stderr.on('data', checkOutput);

    serverProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    serverProcess.on('exit', (code) => {
      if (!started) {
        clearTimeout(timeout);
        reject(new Error(`Server process exited with code ${code}`));
      }
    });
  });
}

// ─── Phase 2: Wait for server to respond ──────────────────────────────────

async function waitForServer(maxRetries = 30) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const resp = await fetch(`${BASE_URL}/api/health`);
      const data = await resp.json();
      if (resp.ok && data.success) {
        log(`Server ready after ${i}s`);
        return true;
      }
    } catch {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Server did not become ready');
}

// ─── Phase 3: Run the validation tests ────────────────────────────────────

async function runValidation() {
  const { spawn } = await import('child_process');
  return new Promise((resolve, reject) => {
    log('\n──────────────────────────────────────────────');
    log('  Running validation test suite...');
    log('──────────────────────────────────────────────\n');

    const validation = spawn('node', ['src/tests/validation.mjs'], {
      cwd: path.join(__dirname, '..', '..'),
      env: { ...process.env, BASE_URL },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let output = '';
    validation.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    validation.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });

    validation.on('close', (code) => {
      resolve({ code, output });
    });

    validation.on('error', reject);
  });
}

// ─── Cleanup ──────────────────────────────────────────────────────────────

async function cleanup() {
  log('\n──────────────────────────────────────────────');
  log('  Cleaning up...');
  log('──────────────────────────────────────────────\n');

  if (serverProcess) {
    log('Killing server process...');
    serverProcess.kill('SIGTERM');
    await new Promise(r => setTimeout(r, 1000));
    serverProcess.kill('SIGKILL');
  }

  if (mongoose.connection.readyState !== 0) {
    log('Disconnecting Mongoose...');
    await mongoose.disconnect();
  }

  if (mongod) {
    log('Stopping in-memory MongoDB...');
    await mongod.stop();
  }

  log('Cleanup complete.');
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  // Clear previous log
  try { fs.unlinkSync(LOG_FILE); } catch {}

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`  CodebaseOS Runtime Validation Bootstrap`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  try {
    // Phase 0: Start MongoDB
    log('■ Phase 0: Starting in-memory MongoDB...');
    const mongoUri = await startMongoDB();

    // Phase 1: Start server
    log('\n■ Phase 1: Starting Express server...');
    await startServer(mongoUri);

    // Phase 2: Wait for server to respond
    log('\n■ Phase 2: Waiting for server to become ready...');
    await waitForServer();
    log('  Health endpoint responded OK');

    // Phase 3: Run validation tests
    log('\n■ Phase 3: Running validation tests...');
    const result = await runValidation();

    log('\n═══════════════════════════════════════════════════════════');
    log('  VALIDATION RUN COMPLETE');
    log(`  Exit code: ${result.code}`);
    log(`  Full log: ${LOG_FILE}`);
    log('═══════════════════════════════════════════════════════════\n');

    return result.code;
  } catch (err) {
    log(`\n  ❌ FATAL: ${err.message}`);
    console.error(err);
    return 1;
  } finally {
    await cleanup();
  }
}

main().then((code) => {
  process.exit(code);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});