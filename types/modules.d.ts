// Global module declarations for TypeScript
/// <reference types="vite/client" />

// Fix for server/vite.ts import path
declare module "../../vite.config" {
  import type { UserConfig } from 'vite';
  const config: UserConfig;
  export default config;
}

// Additional module declarations can be added here if needed