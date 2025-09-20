declare module "../../vite.config" {
  import { defineConfig } from 'vite';
  const config: ReturnType<typeof defineConfig>;
  export default config;
}