import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset paths, so the same build works on GitHub Pages
  // (served from /<repo>/) and inside a Capacitor app later.
  base: './',
  build: {
    // Phaser is a single large library; this silences the size warning.
    chunkSizeWarningLimit: 2500,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
