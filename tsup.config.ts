import { defineConfig } from 'tsup';

const common = {
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  external: ['react', 'react-dom'],
  sourcemap: true,
} as const;

export default defineConfig([
  { ...common, format: ['esm', 'cjs'], external: ['react', 'react-dom'], entry: { index: 'src/index.ts' } },
  { ...common, format: ['esm', 'cjs'], external: ['react', 'react-dom'], entry: { monaco: 'src/monaco/index.ts' } },
]);
