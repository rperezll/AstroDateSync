import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'node20',
  sourcemap: true,
  dts: {
    entry: 'src/index.ts',
    compilerOptions: {
      module: "esnext",
      resolveJsonModule: true,
      moduleResolution: 'node',
      types: ['astro']
    },
  },
  clean: true,
  outDir: 'dist',
  external: ['astro'], 
});