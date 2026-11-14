/**
 * Architecture guard: the rules engine must stay pure.
 * It may import from src/engine and src/data only — never Phaser, the DOM
 * layer in src/render, or anything else that draws or touches the browser.
 * See docs/ARCHITECTURE.md.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ENGINE_DIR = join(process.cwd(), 'src', 'engine');
const FORBIDDEN = [/from\s+['"]phaser['"]/, /from\s+['"][^'"]*\/render\//, /\bMath\.random\s*\(/];
const FORBIDDEN_GLOBALS = [/\bwindow\./, /\bdocument\./, /\bDate\.now\s*\(/, /\bsetTimeout\s*\(/];

function engineSources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return engineSources(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') ? [path] : [];
  });
}

describe('engine purity', () => {
  const files = engineSources(ENGINE_DIR);

  it('finds engine source files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s has no rendering imports, browser globals, clocks or Math.random', (file) => {
    const source = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    for (const pattern of [...FORBIDDEN, ...FORBIDDEN_GLOBALS]) {
      expect(source, `${file} matches ${pattern}`).not.toMatch(pattern);
    }
  });
});
