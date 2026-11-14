import { describe, expect, it } from 'vitest';
import { createRng, nextFloat, nextInRange, nextInt } from './rng';

function take(seed: number, count: number): number[] {
  const values: number[] = [];
  let rng = createRng(seed);
  for (let i = 0; i < count; i++) {
    const roll = nextFloat(rng);
    values.push(roll.value);
    rng = roll.rng;
  }
  return values;
}

describe('seeded rng', () => {
  it('gives the same sequence for the same seed', () => {
    expect(take(1234, 20)).toEqual(take(1234, 20));
  });

  it('gives different sequences for different seeds', () => {
    expect(take(1, 5)).not.toEqual(take(2, 5));
  });

  it('does not mutate: the same state always yields the same roll', () => {
    const rng = createRng(99);
    expect(nextFloat(rng)).toEqual(nextFloat(rng));
  });

  it('stays inside [0, 1) and is roughly uniform', () => {
    const values = take(42, 10_000);
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
  });

  it('respects ranges', () => {
    let rng = createRng(7);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const spread = nextInRange(rng, 0.85, 1.15);
      expect(spread.value).toBeGreaterThanOrEqual(0.85);
      expect(spread.value).toBeLessThan(1.15);
      const die = nextInt(spread.rng, 1, 6);
      expect(Number.isInteger(die.value)).toBe(true);
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(6);
      seen.add(die.value);
      rng = die.rng;
    }
    expect(seen.size).toBe(6);
  });
});
