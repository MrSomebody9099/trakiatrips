#!/usr/bin/env node
import { spawn } from 'child_process';

const child = spawn('npx', ['cross-env', 'NODE_ENV=development', 'tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`Server process exited with code ${code}, signal ${signal}`);
  process.exit(code || 0);
});