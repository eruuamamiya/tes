import {defineConfig} from 'vite';
export default defineConfig({
  build: {target: 'esnext'},
  esbuild: {target: 'esnext'},          // top-level await
  server: {port: 5173, allowedHosts: true, hmr: {clientPort: 443}},
});
