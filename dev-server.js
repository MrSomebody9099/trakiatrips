#!/usr/bin/env node
import { spawn } from 'child_process';

// Set environment variable and run the server
process.env.NODE_ENV = 'development';

const child = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});